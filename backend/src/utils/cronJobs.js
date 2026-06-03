import cron from 'node-cron';
import Appointment from '../model/appointmentModel.js';
import { sendNotification } from './notificationHelper.js';
import { sendAppointmentReminderEmail } from './sendEmail.js';

export const initCronJobs = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            // We want to find appointments that are exactly 5 minutes away
            // For a cron job running every minute, we check if the start time is between 4.5 and 5.5 minutes from now.
            // However, appointments are usually stored with 'date' (YYYY-MM-DD) and 'startTime' ("HH:MM").
            // We need to fetch all confirmed appointments for today.

            const todayStr = now.toISOString().split('T')[0];
            
            const appointments = await Appointment.find({
                date: todayStr,
                status: 'confirmed'
            }).populate({ path: 'patient', populate: { path: 'user' } })
              .populate({ path: 'doctor', populate: { path: 'user' } });

            for (const appt of appointments) {
                // Parse the start time
                const [hours, minutes] = appt.startTime.split(':').map(Number);
                const apptTime = new Date(now);
                apptTime.setHours(hours, minutes, 0, 0);

                const diffMs = apptTime.getTime() - now.getTime();
                const diffMinutes = Math.floor(diffMs / 60000);

                // --- 60 MINUTE EMAIL REMINDER ---
                if (diffMinutes >= 59 && diffMinutes <= 60 && !appt.isEmailReminderSent) {
                    // Send to Doctor
                    if (appt.doctor && appt.doctor.user && appt.doctor.user.email) {
                        await sendAppointmentReminderEmail(
                            appt.doctor.user.email,
                            appt.doctor.user.name || appt.doctor.displayName,
                            appt.patient?.user?.name || "Patient",
                            appt.startTime,
                            true
                        );
                    }

                    // Send to Patient
                    if (appt.patient && appt.patient.user && appt.patient.user.email) {
                        await sendAppointmentReminderEmail(
                            appt.patient.user.email,
                            appt.patient.user.name,
                            appt.doctor?.displayName || "Doctor",
                            appt.startTime,
                            false
                        );
                    }

                    appt.isEmailReminderSent = true;
                    await appt.save();
                    console.log(`Cron: Sent 1-hour email reminders for appointment ${appt._id}`);
                }

                // --- 5 MINUTE IN-APP NOTIFICATION ---
                if (diffMinutes === 5) {
                    // Send to Doctor
                    if (appt.doctor && appt.doctor.user) {
                        await sendNotification({
                            receiverId: appt.doctor.user._id,
                            message: `Reminder: Your video consultation with ${appt.patient.user.name} starts in 5 minutes!`,
                            type: 'video_reminder',
                            link: `/doctor/appointments`
                        });
                    }

                    // Send to Patient
                    if (appt.patient && appt.patient.user) {
                        await sendNotification({
                            receiverId: appt.patient.user._id,
                            message: `Reminder: Your video consultation with Dr. ${appt.doctor.displayName} starts in 5 minutes!`,
                            type: 'video_reminder',
                            link: `/patient/appointments`
                        });
                    }
                }
            }

            // --- Auto-complete past appointments ---
            try {
                const pastAppointments = await Appointment.find({
                    status: 'confirmed'
                });

                const bulkOps = [];
                for (const appt of pastAppointments) {
                    const parseTimeStr = (dateStr, timeStr) => {
                        if (timeStr && timeStr.includes('T')) return new Date(timeStr);
                        const d = new Date(`${dateStr}T${timeStr}`);
                        if (!isNaN(d.getTime())) return d;
                        return null;
                    };

                    const targetStartDate = parseTimeStr(appt.date, appt.startTime);
                    let targetEndDate = appt.endTime ? parseTimeStr(appt.date, appt.endTime) : null;
                    
                    if (targetStartDate && !targetEndDate) {
                        targetEndDate = new Date(targetStartDate.getTime() + 30 * 60000);
                    }

                    if (targetEndDate && now.getTime() >= targetEndDate.getTime()) {
                        bulkOps.push({
                            updateOne: {
                                filter: { _id: appt._id },
                                update: { $set: { status: 'completed' } }
                            }
                        });
                    }
                }

                if (bulkOps.length > 0) {
                    await Appointment.bulkWrite(bulkOps);
                    console.log(`Cron: Auto-completed ${bulkOps.length} appointments.`);
                }
            } catch (err) {
                console.error("Cron Job Error (Auto-Complete):", err);
            }

        } catch (error) {
            console.error("Cron Job Error (Video Call Reminder):", error);
        }
    });

    console.log("Cron jobs initialized.");
};
