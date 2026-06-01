import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from './src/model/reviewModel.js';
import Appointment from './src/model/appointmentModel.js';
import Doctor from './src/model/doctorModel.js';

dotenv.config({ path: './.env' });

const testReview = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Find a completed appointment without a review
        const appointment = await Appointment.findOne({ status: 'completed', isReviewed: false }).populate('doctor').populate('patient');
        
        if (!appointment) {
            console.log("No completed, unreviewed appointments found to test.");
            process.exit(0);
        }

        console.log(`Found appointment: ${appointment._id} for Dr. ${appointment.doctor.displayName}`);

        // 2. Initial state
        const initialDoctor = await Doctor.findById(appointment.doctor._id);
        console.log(`Initial Doctor Rating: ${initialDoctor.rating}, Total Reviews: ${initialDoctor.totalReviews}`);

        // 3. Create a mock review (simulating controller logic)
        const rating = 5;
        const newReview = new Review({
            patient: appointment.patient._id,
            doctor: appointment.doctor._id,
            appointment: appointment._id,
            rating: rating,
            reviewText: "Excellent doctor, highly recommended! Very professional."
        });
        await newReview.save();

        appointment.isReviewed = true;
        await appointment.save();

        const newTotalReviews = initialDoctor.totalReviews + 1;
        const currentTotalRating = initialDoctor.rating * initialDoctor.totalReviews;
        const newRating = (currentTotalRating + rating) / newTotalReviews;

        initialDoctor.totalReviews = newTotalReviews;
        initialDoctor.rating = Number(newRating.toFixed(1));
        await initialDoctor.save();

        console.log(`Updated Doctor Rating: ${initialDoctor.rating}, Total Reviews: ${initialDoctor.totalReviews}`);
        console.log("Review saved successfully.");

        // 4. Fetch the reviews to see if it populates
        const reviews = await Review.find({ doctor: appointment.doctor._id }).populate({
            path: 'patient',
            select: 'name profilePicture user',
            populate: { path: 'user', select: 'name' }
        });
        console.log("Fetched Reviews:");
        reviews.forEach(r => {
            console.log(`- ${r.rating} stars by ${r.patient.user?.name || 'Unknown'}: "${r.reviewText}"`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testReview();
