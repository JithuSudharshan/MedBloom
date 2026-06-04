import Razorpay from 'razorpay';
import crypto from 'crypto';
import Appointment from '../../../model/appointmentModel.js';
import Doctor from '../../../model/doctorModel.js';
import Patient from '../../../model/patientModel.js';
import Admin from '../../../model/adminModel.js';
import Transaction from '../../../model/transactionModel.js';
import { ENV } from '../../../config/env.js';
import { getIO } from '../../../config/socket.IO.js';
import { sendAppointmentConfirmationEmail } from '../../../utils/sendEmail.js';
import { sendNotification, notifyAdmin } from '../../../utils/notificationHelper.js';
import { formatNotificationDateTime } from '../../../utils/formatters.js';

// 1. Create Payment Order
export const createPaymentOrder = async (req, res) => {
    try {
        const { doctorId, date, slot, mode = 'offline' } = req.body;

        // Find patient using authenticated user
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient profile not found" });
        }
        const patientId = patient._id;

        // --- 1. Locking Mechanism (Race Condition Check) ---
        // Check if there is an existing appointment for this slot
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: date,
            startTime: slot,
            status: { $in: ['confirmed', 'completed', 'pending_payment'] }
        });

        if (existingAppointment) {
            if (existingAppointment.status === 'pending_payment') {
                // Check if it's older than 10 minutes (TTL)
                const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
                if (existingAppointment.createdAt > tenMinutesAgo) {
                    return res.status(409).json({
                        success: false,
                        message: "Slot is currently being booked by someone else. Please try again in a few minutes."
                    });
                } else {
                    // Lock expired, previous user abandoned cart. Free it up.
                    await Appointment.deleteOne({ _id: existingAppointment._id });
                }
            } else {
                // Confirmed or completed
                return res.status(409).json({ success: false, message: "This slot is already booked." });
            }
        }

        // --- 2. Fetch Doctor Fee Securely ---
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

        // Calculate end time (Assuming 30-minute slots)
        const [hour, minute] = slot.split(':');
        let dateObj = new Date();
        dateObj.setHours(parseInt(hour), parseInt(minute) + 30, 0);
        const endHour = String(dateObj.getHours()).padStart(2, '0');
        const endMinute = String(dateObj.getMinutes()).padStart(2, '0');
        const endTime = `${endHour}:${endMinute}`;

        // Ensure mode matches what doctor supports
        const validMode = doctor.consultationMode === 'both' ? mode : doctor.consultationMode;
        const fee = doctor.consultationFees?.[validMode] || doctor.consultationFees?.offline || 500; // fallback fee

        // --- 3. Create Temporary Lock Appointment ---
        const uniqueId = "#MED-" + crypto.randomBytes(3).toString('hex').toUpperCase();
        const newAppointment = new Appointment({
            appointmentId: uniqueId,
            patient: patientId,
            doctor: doctorId,
            date: date,
            startTime: slot,
            endTime: endTime,
            mode: validMode,
            status: 'pending_payment',
            amount: fee
        });
        await newAppointment.save();

        // --- 4. Initialize Razorpay Order ---
        if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "Razorpay API keys are missing in the backend environment variables."
            });
        }

        const razorpayInstance = new Razorpay({
            key_id: ENV.RAZORPAY_KEY_ID,
            key_secret: ENV.RAZORPAY_SECRET_KEY
        });

        const orderOptions = {
            amount: fee * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${newAppointment._id}`
        };

        const order = await razorpayInstance.orders.create(orderOptions);

        return res.status(200).json({
            success: true,
            order,
            appointmentId: newAppointment._id,
            keyId: ENV.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Error creating payment order", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Verify Payment and Finalize Booking
export const verifyPaymentAndBook = async (req, res) => {
    try {
        const { payment_id, order_id, signature, appointmentId } = req.body;

        // --- 1. Verify Signature ---
        const generatedSignature = crypto.createHmac('sha256', ENV.RAZORPAY_SECRET_KEY)
            .update(order_id + "|" + payment_id)
            .digest('hex');

        if (generatedSignature !== signature) {
            // Unsuccessful payment, optionally remove the lock or keep it till 10 min expiry
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // --- 2. Update Appointment Status ---
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

        if (appointment.status === 'confirmed') {
            return res.status(200).json({ success: true, message: "Appointment already confirmed" });
        }

        appointment.status = 'confirmed';
        appointment.paymentId = payment_id;
        await appointment.save();

        // --- 3. Update Doctor and Patient arrays ---
        await Doctor.findByIdAndUpdate(appointment.doctor, { $push: { appointments: appointment._id } });
        await Patient.findByIdAndUpdate(appointment.patient, { $push: { appointments: appointment._id } });

        // --- 4. Admin Wallet Escrow (Credit) ---
        try {
            const admin = await Admin.findOne();
            if (admin) {
                admin.walletBalance = (admin.walletBalance || 0) + (appointment.amount || 0);
                await admin.save();

                await Transaction.create({
                    userId: admin._id,
                    userModel: 'Admin',
                    transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
                    type: 'credit',
                    amount: appointment.amount || 0,
                    description: `Payment received for appointment ${appointment.appointmentId}`,
                    status: 'Success'
                });
            }
        } catch (adminEscrowErr) {
            console.error("Admin escrow credit failed:", adminEscrowErr);
        }

        // --- 5. Real-time updates & Email ---
        try {
            const doctorObj = await Doctor.findById(appointment.doctor).populate('user');
            const patientObj = await Patient.findById(appointment.patient).populate('user');

            if (doctorObj && doctorObj.user && patientObj && patientObj.user) {
                const formattedDateTime = formatNotificationDateTime(appointment.date, appointment.startTime);
                // Notify Doctor
                await sendNotification({
                    senderId: patientObj.user._id,
                    receiverId: doctorObj.user._id,
                    message: `You have a new appointment with ${patientObj.user.name} on ${formattedDateTime}.`,
                    type: 'appointment_booked',
                    link: `/doctor/appointments/${appointment._id}`
                });

                // Notify Patient
                await sendNotification({
                    senderId: doctorObj.user._id,
                    receiverId: patientObj.user._id,
                    message: `Your appointment with Dr. ${doctorObj.displayName} on ${formattedDateTime} is confirmed.`,
                    type: 'appointment_booked',
                    link: `/patient/appointments/${appointment._id}`
                });

                // Notify Admin
                await notifyAdmin({
                    message: `New appointment booked: ${patientObj.user.name} with Dr. ${doctorObj.displayName} on ${formattedDateTime}.`,
                    type: 'appointment_booked',
                    link: `/admin/appointments`
                });
            }
        } catch (notifErr) {
            console.error("Notification failed:", notifErr);
        }

        // Send Email to Patient
        try {
            const doctorObj = await Doctor.findById(appointment.doctor);
            const patientObj = await Patient.findById(appointment.patient).populate('user');
            if (patientObj && patientObj.user && doctorObj) {
                await sendAppointmentConfirmationEmail(
                    patientObj.user.email,
                    doctorObj.displayName,
                    appointment.date,
                    appointment.startTime
                );
            }
        } catch (emailErr) {
            console.error("Email sending failed:", emailErr);
        }

        return res.status(200).json({ success: true, message: "Booking confirmed successfully", appointment });

    } catch (error) {
        console.error("Error verifying payment", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Refund Estimate
export const getRefundEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

        if (appointment.status === 'cancelled' || appointment.status === 'completed') {
            return res.status(400).json({ success: false, message: `Appointment is already ${appointment.status}` });
        }

        let refundPercentage = 0;
        let refundAmount = 0;

        if (appointment.status !== 'pending_payment' && appointment.amount) {
            const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
            const appointmentDateTime = new Date(`${appointmentDateStr}T${appointment.startTime}`);
            const now = new Date();
            const hoursDifference = (appointmentDateTime - now) / (1000 * 60 * 60);

            if (hoursDifference > 24) {
                refundPercentage = 100;
            } else if (hoursDifference > 1 && hoursDifference <= 24) {
                refundPercentage = 50;
            } else {
                refundPercentage = 0;
            }
            refundAmount = (appointment.amount * refundPercentage) / 100;
        }

        return res.status(200).json({
            success: true,
            refundPercentage,
            refundAmount
        });
    } catch (error) {
        console.error("Error getting refund estimate", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Cancel Appointment
export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.findById(id);
        console.log("appointment", appointment)
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Verify patient ownership
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient || appointment.patient.toString() !== patient._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to cancel this appointment" });
        }

        if (appointment.status === 'cancelled' || appointment.status === 'completed') {
            return res.status(400).json({ success: false, message: `Appointment is already ${appointment.status}` });
        }

        // --- Calculate Refund Policy ---
        let refundPercentage = 0;
        let refundAmount = 0;

        if (appointment.status !== 'pending_payment') {
            // Safe parse of appointment date/time
            const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
            const appointmentDateTime = new Date(`${appointmentDateStr}T${appointment.startTime}`);
            const now = new Date();
            const hoursDifference = (appointmentDateTime - now) / (1000 * 60 * 60);

            if (hoursDifference > 24) {
                refundPercentage = 100;
            } else if (hoursDifference > 1 && hoursDifference <= 24) {
                refundPercentage = 50;
            } else {
                refundPercentage = 0;
            }

            refundAmount = (appointment.amount * refundPercentage) / 100;

            if (refundAmount > 0) {
                // 1. Credit Patient Wallet
                patient.walletBalance = (patient.walletBalance || 0) + refundAmount;
                await patient.save();

                await Transaction.create({
                    userId: patient._id,
                    userModel: 'Patient',
                    transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
                    type: 'credit',
                    amount: refundAmount,
                    description: `Refund (${refundPercentage}%) for cancelled appointment ${appointment.appointmentId}`,
                    status: 'Success'
                });

                try {
                    await sendNotification({
                        receiverId: patient.user,
                        message: `A refund of ₹${refundAmount} (${refundPercentage}%) has been credited to your wallet for the cancelled appointment ${appointment.appointmentId}.`,
                        type: 'wallet_topup',
                        link: `/patient/wallet`
                    });
                } catch (notifErr) {
                    console.error("Patient refund notification failed:", notifErr);
                }

                // 2. Debit Admin Escrow Wallet
                try {
                    const admin = await Admin.findOne();
                    if (admin) {
                        admin.walletBalance = Math.max(0, (admin.walletBalance || 0) - refundAmount);
                        await admin.save();

                        await Transaction.create({
                            userId: admin._id,
                            userModel: 'Admin',
                            transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
                            type: 'debit',
                            amount: refundAmount,
                            description: `Refund issued for cancelled appointment ${appointment.appointmentId}`,
                            status: 'Success'
                        });

                        await notifyAdmin({
                            message: `Refund of ₹${refundAmount} processed for cancelled appointment ${appointment.appointmentId}.`,
                            type: 'wallet_deduction',
                            link: `/admin/wallet`
                        });
                    }
                } catch (adminRefundErr) {
                    console.error("Admin escrow refund failed:", adminRefundErr);
                }
            }
        }

        appointment.status = 'cancelled';
        await appointment.save();

        const doctorObj = await Doctor.findById(appointment.doctor).populate('user');
        const formattedDateTime = formatNotificationDateTime(appointment.date, appointment.startTime);

        // Send Cancellation Notifications for doctor
        try {
            if (doctorObj?.user) {
                await sendNotification({
                    senderId: patient.user,
                    receiverId: doctorObj.user._id,
                    message: `Appointment on ${formattedDateTime} cancelled by patient ${req.user.name}.`,
                    type: 'appointment_cancelled',
                    link: `/doctor/appointments/${appointment._id}`
                });
            }
        } catch (notifErr) {
            console.error("Notification failed:", notifErr);
        }

        // --- Notify Admin for Last-Minute Cancellation ---
        try {
            const appointmentDate = new Date(appointment.date);
            // Try to extract hours/minutes from startTime if available to be more precise, but date is fine for MVP
            const now = new Date();
            const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);

            await notifyAdmin({
                message: `Cancellation Alert: Patient ${req.user.name} cancelled their appointment with Dr. ${doctorObj?.displayName || 'Unknown'} scheduled for ${formattedDateTime}.`,
                type: 'appointment_cancelled',
                link: '/admin/appointments'
            });
        } catch (adminNotifErr) {
            console.error("Admin notification failed:", adminNotifErr);
        }

        // Send Cancellation Notifications for patient
        try {
            const patientObj = await Patient.findById(appointment.patient).populate('user');
            console.log("patientObj === ", patientObj)

            if (patientObj?.user && doctorObj?.user) {
                await sendNotification({
                    senderId: doctorObj.user._id,
                    receiverId: patientObj.user._id,
                    message: `Your appointment with Dr. ${doctorObj.displayName} on ${formattedDateTime} has been cancelled successfully.`,
                    type: 'appointment_cancelled',
                    link: `/patient/appointments/${appointment._id}`
                });
            }
        } catch (notifErr) {
            console.error("Notification failed:", notifErr);
        }

        return res.status(200).json({ 
            success: true, 
            message: "Appointment cancelled successfully",
            refundAmount,
            refundPercentage
        });
    } catch (error) {
        console.error("Error cancelling appointment", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Reschedule Appointment
export const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate, newSlot, mode } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient || appointment.patient.toString() !== patient._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to reschedule this appointment" });
        }

        if (appointment.status === 'cancelled' || appointment.status === 'completed') {
            return res.status(400).json({ success: false, message: `Cannot reschedule a ${appointment.status} appointment` });
        }

        // Check if new slot is available
        const existingAppointment = await Appointment.findOne({
            doctor: appointment.doctor,
            date: newDate,
            startTime: newSlot,
            status: { $in: ['confirmed', 'completed', 'pending_payment'] }
        });

        if (existingAppointment) {
            if (existingAppointment.status === 'pending_payment') {
                const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
                if (existingAppointment.createdAt > tenMinutesAgo) {
                    return res.status(409).json({ success: false, message: "Slot is currently unavailable." });
                } else {
                    await Appointment.deleteOne({ _id: existingAppointment._id });
                }
            } else {
                return res.status(409).json({ success: false, message: "This slot is already booked." });
            }
        }

        // Calculate end time
        const [hour, minute] = newSlot.split(':');
        let dateObj = new Date();
        dateObj.setHours(parseInt(hour), parseInt(minute) + 30, 0);
        const endHour = String(dateObj.getHours()).padStart(2, '0');
        const endMinute = String(dateObj.getMinutes()).padStart(2, '0');
        const endTime = `${endHour}:${endMinute}`;

        appointment.date = newDate;
        appointment.startTime = newSlot;
        appointment.endTime = endTime;
        if (mode) appointment.mode = mode;
        // Rescheduling typically confirms it, if it was already paid.
        appointment.status = 'confirmed';

        await appointment.save();

        // Send Reschedule Notifications
        try {
            const doctorObj = await Doctor.findById(appointment.doctor).populate('user');
            if (doctorObj && doctorObj.user) {
                const formattedDateTime = formatNotificationDateTime(newDate, newSlot);
                // Notify Doctor
                await sendNotification({
                    senderId: patient.user,
                    receiverId: doctorObj.user._id,
                    message: `Appointment rescheduled to ${formattedDateTime} by patient ${req.user.name}.`,
                    type: 'appointment_rescheduled',
                    link: `/doctor/appointments/${appointment._id}`
                });

                // Notify Patient
                await sendNotification({
                    senderId: doctorObj.user._id,
                    receiverId: patient.user,
                    message: `Your appointment with Dr. ${doctorObj.displayName} has been rescheduled to ${formattedDateTime}.`,
                    type: 'appointment_rescheduled',
                    link: `/patient/appointments/${appointment._id}`
                });
            }
        } catch (notifErr) {
            console.error("Notification failed:", notifErr);
        }

        return res.status(200).json({ success: true, message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.error("Error rescheduling appointment", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Book Appointment with Wallet
export const bookAppointmentWithWallet = async (req, res) => {
    try {
        const { doctorId, date, slot, mode = 'offline' } = req.body;

        const patient = await Patient.findOne({ user: req.user._id }).populate('user');
        if (!patient) return res.status(404).json({ success: false, message: "Patient profile not found" });

        // Lock check
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: date,
            startTime: slot,
            status: { $in: ['confirmed', 'completed', 'pending_payment'] }
        });

        if (existingAppointment) {
            if (existingAppointment.status === 'pending_payment') {
                const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
                if (existingAppointment.createdAt > tenMinutesAgo) {
                    return res.status(409).json({ success: false, message: "Slot is currently being booked by someone else." });
                } else {
                    await Appointment.deleteOne({ _id: existingAppointment._id });
                }
            } else {
                return res.status(409).json({ success: false, message: "This slot is already booked." });
            }
        }

        const doctor = await Doctor.findById(doctorId).populate('user');
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

        // Calculate end time
        const [hour, minute] = slot.split(':');
        let dateObj = new Date();
        dateObj.setHours(parseInt(hour), parseInt(minute) + 30, 0);
        const endHour = String(dateObj.getHours()).padStart(2, '0');
        const endMinute = String(dateObj.getMinutes()).padStart(2, '0');
        const endTime = `${endHour}:${endMinute}`;

        const validMode = doctor.consultationMode === 'both' ? mode : doctor.consultationMode;
        const fee = doctor.consultationFees?.[validMode] || doctor.consultationFees?.offline || 500;

        // Check wallet balance
        if (patient.walletBalance < fee) {
            return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
        }

        // Deduct from wallet
        patient.walletBalance -= fee;

        const uniqueId = "#MED-" + crypto.randomBytes(3).toString('hex').toUpperCase();
        const newAppointment = new Appointment({
            appointmentId: uniqueId,
            patient: patient._id,
            doctor: doctor._id,
            date: date,
            startTime: slot,
            endTime: endTime,
            mode: validMode,
            status: 'confirmed',
            amount: fee,
            paymentMethod: 'wallet'
        });

        await newAppointment.save();

        // Create transaction record
        const transaction = new Transaction({
            userId: patient._id,
            userModel: 'Patient',
            transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
            type: 'debit',
            amount: fee,
            description: `Payment for appointment ${uniqueId} with Dr. ${doctor.displayName}`,
            status: 'Success'
        });
        await transaction.save();

        // Admin Escrow (Credit)
        try {
            const admin = await Admin.findOne();
            if (admin) {
                admin.walletBalance = (admin.walletBalance || 0) + fee;
                await admin.save();

                await Transaction.create({
                    userId: admin._id,
                    userModel: 'Admin',
                    transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
                    type: 'credit',
                    amount: fee,
                    description: `Payment received for appointment ${uniqueId}`,
                    status: 'Success'
                });
            }
        } catch (adminEscrowErr) {
            console.error("Admin escrow credit failed:", adminEscrowErr);
        }

        // Update arrays
        patient.appointments.push(newAppointment._id);
        await patient.save();

        doctor.appointments.push(newAppointment._id);
        await doctor.save();

        // Real-time notifications to BOTH Patient and Doctor
        try {
            const formattedDateTime = formatNotificationDateTime(newAppointment.date, newAppointment.startTime);
            // Notify Doctor
            await sendNotification({
                senderId: patient.user._id,
                receiverId: doctor.user._id,
                message: `You have a new appointment with ${patient.user.name} on ${formattedDateTime}.`,
                type: 'appointment_booked',
                link: `/doctor/appointments/${newAppointment._id}`
            });

            // Notify Patient
            await sendNotification({
                senderId: doctor.user._id,
                receiverId: patient.user._id,
                message: `Your appointment with Dr. ${doctor.displayName} on ${formattedDateTime} is confirmed.`,
                type: 'appointment_booked',
                link: `/patient/appointments/${newAppointment._id}`
            });

            // Notify Admin
            await notifyAdmin({
                message: `New appointment booked: ${patient.user.name} with Dr. ${doctor.displayName} on ${formattedDateTime}.`,
                type: 'appointment_booked',
                link: `/admin/appointments`
            });
        } catch (notifErr) {
            console.error("Notification failed:", notifErr);
        }

        // Email to patient
        await sendAppointmentConfirmationEmail(
            patient.user.email,
            doctor.displayName,
            newAppointment.date,
            newAppointment.startTime
        );

        return res.status(200).json({ success: true, message: "Booking confirmed successfully via Wallet", appointment: newAppointment });

    } catch (error) {
        console.error("Error booking with wallet", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
