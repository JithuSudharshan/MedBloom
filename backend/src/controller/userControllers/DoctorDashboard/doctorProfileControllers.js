import Doctor from "../../../model/doctorModel.js";
import User from "../../../model/userModel.js";
import Appointment from "../../../model/appointmentModel.js";
import Review from "../../../model/reviewModel.js";
import { MedicalRecord } from "../../../model/medicalRecordModel.js";
import Transaction from "../../../model/transactionModel.js";
import Admin from "../../../model/adminModel.js";
import crypto from 'crypto';
import { formatDOB } from "../../../utils/formatters.js";
import PDFDocument from 'pdfkit';
import { uploadBufferToCloudinary } from "../../../utils/cloudinaryUploader.js";
import { sendPrescriptionEmail } from "../../../utils/sendEmail.js";
import { notifyAdmin, sendNotification } from "../../../utils/notificationHelper.js";

const generatePrescriptionPdfBuffer = (appointment, doctor, medications) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            const docName = doctor?.user?.name ? `Dr. ${doctor.user.name}` : "Doctor";
            
            // Header
            doc.fontSize(24).fillColor('#00A4A3').text('MedBloom', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).fillColor('#333333').text('Digital Prescription', { align: 'center' });
            doc.moveDown(2);

            // Details
            doc.fontSize(12).fillColor('#555555');
            doc.text(`Doctor: ${docName}`);
            doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`);
            doc.text(`Appointment ID: ${appointment.appointmentId}`);
            doc.moveDown(2);

            // Medications
            doc.fontSize(14).fillColor('#000000').text('Medications:', { underline: true });
            doc.moveDown(0.5);

            medications.forEach((med, index) => {
                doc.fontSize(12).fillColor('#333333').text(`${index + 1}. ${med.medication}`);
                doc.fontSize(10).fillColor('#666666')
                   .text(`   Dosage: ${med.dosage} | Frequency: ${med.frequency} | Duration: ${med.duration}`);
                if (med.instructions) {
                    doc.text(`   Instructions: ${med.instructions}`);
                }
                doc.moveDown(0.5);
            });

            if (appointment.notes) {
                doc.moveDown();
                doc.fontSize(14).fillColor('#000000').text('Additional Notes:', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12).fillColor('#333333').text(appointment.notes);
            }

            // Footer
            doc.moveDown(4);
            doc.fontSize(10).fillColor('#999999').text('This is a digitally generated prescription.', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export const fetchDoctorDetails = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User.findOne({ _id: userId });

        if (!user)
            return res.status(400).json({ success: false, message: "User nt found" });


        else if (user.authMethod === 'google' && !user.isOnboarded)
            return res.status(200).json({
                success: true,
                message: "Fetching docotor data successful",
                details: {
                    avatar: {
                        src: user.profile_url,
                        alr: "Doctor avatar"
                    },
                    fullName: user.name,
                    email: user.email,
                }
            })

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor)
            return res.status(400).json({ success: false, message: "User not found" });

        const details = {
            avatar: {
                src: doctor.profilePicture || user.profile_url,
                alr: "Doctor avatar"
            },
            shortBio: doctor.shortBio,
            fullName: user.name,
            email: user.email,
            phone: doctor.contactNumber,
            dob: formatDOB(doctor.dateOfBirth),
            gender: doctor.gender,
            address: doctor.clinicAddress,
            displayName: doctor.displayName,
            primarySpecialization: doctor.primarySpecialization,
            yearsOfExperience: doctor.yearOfExperience,
            consultationMode: doctor.consultationMode,
            consultationFeesOnline: doctor.consultationFees.online,
            consultationFeesOffline: doctor.consultationFees.offline,
            authMethod: user.authMethod,
            isOnboarded: user.isOnboarded
        }

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        const todayConsultations = await Appointment.countDocuments({
            doctor: doctor._id,
            date: todayStr,
            status: { $in: ['confirmed', 'completed'] }
        });

        // Use totalReviews to compute profile completion ratio roughly (as an example)
        // Or hardcode profileStatus for doctor for now if not tracked
        const profileStatus = doctor.status === 'approved' ? '100% Complete' : 'Pending Approval';

        res.status(200).json({
            success: true,
            message: "Fetching docotor data successful",
            details: { ...details, todayConsultations, profileStatus }
        })

    } catch (error) {
        console.log("Error while fetching user data", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const updateDoctorAvatar = async (req, res) => {
    try {
        const { _id } = req.user
        const profile_url = req.body.profile_url

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        if (!profile_url)
            return res.status(400).json({ success: false, message: "Profile_url not found" })

        const user = _id;
        const doctor = await Doctor.findOne({ user })

        if (!doctor)
            return res.status(404).json({ success: false, message: "Doctor not found" })

        doctor.profilePicture = profile_url;

        await doctor.save()

        res.status(200).json({
            success: true,
            message: "Profile picture updated",
            profile_url: doctor.profilePicture
        })
    } catch (error) {
        console.log("Error while Updating Dr Avatar", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const editDoctorProfile = async (req, res) => {

    try {
        const {
            displayName,
            contactNumber,
            gender,
            location,
            shortBio,
            consultationMode,
            consultationFeesOnline,
            consultationFeesOffline
        } = req.body;

        const userId = req.user._id;

        if (
            !userId ||
            !contactNumber ||
            !gender ||
            !location ||
            !consultationMode ||
            !displayName
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Fill mandatory fields" });
        }

        if (consultationMode === "online" && !consultationFeesOnline)
            return res.status(400).json({ success: false, message: "Online consultation fee is required" })

        if (consultationMode === "offline" && !consultationFeesOffline)
            return res.status(400).json({ success: false, message: "Offline consultation fee is required" })

        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const doctor = await Doctor.findOne({ user: userDetails._id });
        if (!doctor) {
            return res
                .status(404)
                .json({ success: false, message: "Doctor not found" });
        }

        const feeChanges = [];
        if (consultationFeesOnline && Number(consultationFeesOnline) !== doctor.consultationFees.online) {
            feeChanges.push(`Online Fee changed from ₹${doctor.consultationFees.online || 0} to ₹${consultationFeesOnline}`);
        }
        if (consultationFeesOffline && Number(consultationFeesOffline) !== doctor.consultationFees.offline) {
            feeChanges.push(`Offline Fee changed from ₹${doctor.consultationFees.offline || 0} to ₹${consultationFeesOffline}`);
        }

        doctor.displayName = displayName || doctor.displayName
        doctor.contactNumber = contactNumber || doctor.contactNumber
        doctor.gender = gender || doctor.gender
        doctor.location = location || doctor.location
        doctor.shortBio = shortBio || doctor.shortBio
        doctor.consultationMode = consultationMode || doctor.consultationMode
        doctor.consultationFees.online = consultationFeesOnline || doctor.consultationFees.online
        doctor.consultationFees.offline = consultationFeesOffline || doctor.consultationFees.offline

        await doctor.save()

        if (feeChanges.length > 0) {
            await notifyAdmin({
                message: `Profile Update Alert: Dr. ${doctor.displayName} modified their fees. ${feeChanges.join(', ')}.`,
                type: 'doctor_update',
                link: '/admin/doctors'
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            doctor
        });
    } catch (error) {
        console.log("Error during Doctor edit: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const fetchMetricsForDoctor = async (req, res) => {
    try {

        const metrics = [
            { label: "Total Appointments", value: 125 },
            { label: "Total Consultations", value: 79 }
        ]

        const TotalEarnigs = 45000

        const TodaysAppointments = [
            { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
        ];

        const userId = req.user._id;
        const doctor = await Doctor.findOne({ user: userId });

        let reviews = [];
        let ratingStats = {
            overallRating: 0,
            totalReviews: 0,
            breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };

        if (doctor) {
            reviews = await Review.find({ doctor: doctor._id })
                .populate({
                    path: 'patient',
                    select: 'name profile_url user',
                    populate: { path: 'user', select: 'name profile_url' }
                })
                .sort({ createdAt: -1 })
                .limit(5); // Recent 5 reviews

            // Fetch breakdown
            const allReviews = await Review.find({ doctor: doctor._id }).select('rating');
            allReviews.forEach(r => {
                if (r.rating >= 1 && r.rating <= 5) {
                    ratingStats.breakdown[r.rating]++;
                }
            });
            ratingStats.overallRating = doctor.rating;
            ratingStats.totalReviews = doctor.totalReviews;
        }

        return res.status(200).json({
            success: true,
            metrics,
            TotalEarnigs,
            TodaysAppointments,
            reviews,
            ratingStats
        });

    } catch (error) {
        console.error("Error while fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const fetchDoctorAppointments = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const skip = (page - 1) * limit;

        const { _id } = req.user

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        const user = _id;
        const doctor = await Doctor.findOne({ user })

        if (!doctor)
            return res.status(404).json({ success: false, message: "Doctor not found" })

        const filter = {
            doctor: doctor._id,
            status: { $ne: 'pending_payment' }
        };

        const totalCount = await Appointment.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        const appointments = await Appointment.find(filter)
            .sort({ date: -1, startTime: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'patient',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });

        const mappedAppointments = appointments.map((app) => {
            let mappedStatus = "Upcoming";
            if (app.status === "completed") mappedStatus = "Completed";
            if (app.status === "cancelled") mappedStatus = "Cancelled";

            let formattedDate = app.date;
            try {
                const dateObj = new Date(app.date);
                formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } catch(e) {}

            let formattedTime = app.startTime;
            try {
                if (app.startTime && !app.startTime.includes('T')) {
                    const [hour, minute] = app.startTime.split(':');
                    const timeObj = new Date();
                    timeObj.setHours(parseInt(hour, 10), parseInt(minute, 10), 0);
                    formattedTime = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                } else {
                    const timeObj = new Date(app.startTime);
                    if (!isNaN(timeObj.getTime())) {
                        formattedTime = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                    }
                }
            } catch(e) {}

            return {
                id: app._id,
                appointmentId: app.appointmentId,
                primaryTitle: app.patient?.user?.name || "Unknown Patient",
                patientName: app.patient?.user?.name || "Unknown Patient",
                patientImage: app.patient?.profile_url,
                secondaryText: app.patient?.user?.email || "Patient",
                dateTimeLabel: `${formattedDate} at ${formattedTime}`,
                rawDate: app.date,
                rawStartTime: app.startTime,
                rawEndTime: app.endTime,
                status: mappedStatus,
                prescription: app.prescription,
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                appointments: mappedAppointments,
                page,
                totalPages,
                totalCount: totalCount
            },
        });

    } catch (error) {
        console.error("Error while fetching appointments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const savePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { prescription, notes } = req.body;
        
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (!Array.isArray(prescription) || prescription.length === 0) {
            return res.status(400).json({ success: false, message: "Prescription must contain at least one medication" });
        }

        appointment.prescription = prescription;
        if (notes !== undefined) {
            appointment.notes = notes;
        }

        const doctor = await Doctor.findById(appointment.doctor).populate('user');
        const patient = await User.findById(appointment.patient); // Patient model points to user? Wait, appointment.patient is the Patient document.
        
        // Generate PDF
        const pdfBuffer = await generatePrescriptionPdfBuffer(appointment, doctor, prescription);
        
        // Upload to Cloudinary
        const uploadResult = await uploadBufferToCloudinary(pdfBuffer, 'prescriptions', 'raw');
        appointment.prescriptionPdfUrl = uploadResult.secure_url;

        await appointment.save();

        // Auto-create a virtual MedicalRecord for this prescription
        let medicalRecord = await MedicalRecord.findOne({ appointmentId: appointment._id });
        
        const docName = doctor?.user?.name ? `Dr. ${doctor.user.name}` : "Doctor";

        if (!medicalRecord) {
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            medicalRecord = new MedicalRecord({
                patientId: appointment.patient,
                title: `Digital Prescription - ${docName}`,
                category: 'prescription',
                description: `Generated from Virtual Consultation on ${dateStr}`,
                isDigital: true,
                appointmentId: appointment._id,
                fileUrl: appointment.prescriptionPdfUrl // Attach the PDF URL
            });
            await medicalRecord.save();
        } else {
            medicalRecord.fileUrl = appointment.prescriptionPdfUrl;
            await medicalRecord.save();
        }

        // Send Email if we can get patient email
        try {
            // Need to fetch patient user to get email. Patient model schema needs investigation, but let's try populating.
            const populatedAppt = await Appointment.findById(id).populate({
                path: 'patient',
                populate: { path: 'user' }
            });
            
            const patientEmail = populatedAppt?.patient?.user?.email;
            if (patientEmail) {
                await sendPrescriptionEmail(patientEmail, doctor?.user?.name || "Doctor", pdfBuffer);
            }
        } catch (emailErr) {
            console.error("Failed to send prescription email:", emailErr);
        }

        res.status(200).json({
            success: true,
            message: "Prescription saved and sent successfully",
            data: appointment
        });
    } catch (error) {
        console.error("Error while saving prescription:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const completeConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (!appointment.prescription || appointment.prescription.length === 0) {
            return res.status(400).json({ success: false, message: "A prescription must be submitted before completing the consultation" });
        }

        appointment.status = 'completed';
        appointment.consultationEndedAt = new Date();
        await appointment.save();

        // --- Payout Engine ---
        const PLATFORM_FEE_PERCENTAGE = 0.20; // 20% Platform Commission
        const appointmentAmount = appointment.amount || 0;

        if (appointmentAmount > 0) {
            const adminFee = appointmentAmount * PLATFORM_FEE_PERCENTAGE;
            const doctorPayout = appointmentAmount - adminFee;

            const doctor = await Doctor.findById(appointment.doctor);
            if (doctor) {
                // 1. Credit Doctor's Wallet
                doctor.walletBalance = (doctor.walletBalance || 0) + doctorPayout;
                await doctor.save();

                // 2. Create Ledger Transaction
                await Transaction.create({
                    transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
                    userId: doctor._id,
                    userModel: 'Doctor',
                    type: 'credit',
                    amount: doctorPayout,
                    description: `Payout for Consultation ${appointment.appointmentId}. (Platform Fee: ₹${adminFee})`,
                    status: 'Success',
                    paymentGateway: 'system'
                });

                // 3. Notify Doctor
                await sendNotification({
                    receiverId: doctor.user, // Reference to User ID
                    message: `Consultation complete! ₹${doctorPayout} has been credited to your wallet.`,
                    type: 'wallet_topup',
                    link: '/doctor/wallet'
                });

                // 4. Admin Escrow (Debit)
                try {
                    const admin = await Admin.findOne();
                    if (admin) {
                        admin.walletBalance = (admin.walletBalance || 0) - doctorPayout;
                        await admin.save();

                        await Transaction.create({
                            userId: admin._id,
                            userModel: 'Admin',
                            transactionId: "TXN-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
                            type: 'debit',
                            amount: doctorPayout,
                            description: `Payout to Dr. ${doctor.displayName} for consultation ${appointment.appointmentId}. (Platform Fee retained: ₹${adminFee})`,
                            status: 'Success'
                        });
                    }
                } catch (adminDebitErr) {
                    console.error("Admin escrow debit failed:", adminDebitErr);
                }

                // 5. Notify Admin of Revenue
                await notifyAdmin({
                    message: `Revenue Alert: Platform earned ₹${adminFee} commission from Dr. ${doctor.displayName}'s consultation.`,
                    type: 'wallet_topup',
                    link: '/admin/dashboard'
                });
            }
        }

        res.status(200).json({
            success: true,
            message: "Consultation completed successfully",
            data: appointment
        });
    } catch (error) {
        console.error("Error while completing consultation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getPatientRecordsForConsultation = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID

        const appointment = await Appointment.findById(id).populate('patient');
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Verify the doctor is authorized for this appointment
        const doctorUserId = req.user._id;
        const doctor = await Doctor.findOne({ user: doctorUserId });
        if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to view these records" });
        }

        const patientUserId = appointment.patient.user; // Patient schema has user reference

        // Fetch the records
        const records = await MedicalRecord.find({ patientId: patientUserId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error("Error fetching patient records for consultation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
