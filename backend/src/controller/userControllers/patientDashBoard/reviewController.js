import Review from "../../../model/reviewModel.js";
import Appointment from "../../../model/appointmentModel.js";
import Doctor from "../../../model/doctorModel.js";
import Patient from "../../../model/patientModel.js";
import { sendNotification, notifyAdmin } from "../../../utils/notificationHelper.js";

export const submitReview = async (req, res) => {
    try {
        const { appointmentId, rating, reviewText } = req.body;
        const userId = req.user._id;

        // Verify patient
        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // Verify appointment
        const appointment = await Appointment.findById(appointmentId).populate('doctor');
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.patient.toString() !== patient._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to review this appointment" });
        }

        if (appointment.status !== 'completed') {
            return res.status(400).json({ success: false, message: "Can only review completed appointments" });
        }

        if (appointment.isReviewed) {
            return res.status(400).json({ success: false, message: "Appointment already reviewed" });
        }

        // Create review
        const newReview = new Review({
            patient: patient._id,
            doctor: appointment.doctor._id,
            appointment: appointment._id,
            rating,
            reviewText
        });
        await newReview.save();

        // Mark appointment as reviewed
        appointment.isReviewed = true;
        await appointment.save();

        // Update doctor rating
        const doctor = await Doctor.findById(appointment.doctor._id);
        const newTotalReviews = doctor.totalReviews + 1;
        const currentTotalRating = doctor.rating * doctor.totalReviews;
        const newRating = (currentTotalRating + rating) / newTotalReviews;

        doctor.totalReviews = newTotalReviews;
        doctor.rating = Number(newRating.toFixed(1)); // Keep 1 decimal place
        await doctor.save();

        // Send notification to doctor
        await sendNotification({
            senderId: userId,
            receiverId: doctor.user,
            message: `${patient.name || 'A patient'} left a ${rating}-star review for your consultation.`,
            type: 'new_review',
            link: '/doctor/dashboard' // Adjust link if there's a specific review page
        });

        // Escalate low ratings to Admin
        if (rating <= 2) {
            await notifyAdmin({
                message: `Quality Alert: Dr. ${doctor.displayName} received a ${rating}-star review from ${patient.name || 'a patient'}.`,
                type: 'new_review',
                link: '/admin/doctors'
            });
        }

        res.status(201).json({ success: true, message: "Review submitted successfully", data: newReview });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ success: false, message: "Failed to submit review" });
    }
};

export const getDoctorReviews = async (req, res) => {
    try {
        const { id: doctorId } = req.params; // Expects Doctor Object ID

        const reviews = await Review.find({ doctor: doctorId })
            .populate({
                path: 'patient',
                select: 'name profile_url user',
                populate: {
                    path: 'user',
                    select: 'name profile_url'
                }
            })
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        console.error("Error fetching doctor reviews:", error);
        res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
};
