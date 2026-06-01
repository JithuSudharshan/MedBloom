import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        appointment: {
            type: Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        reviewText: {
            type: String,
            trim: true,
            maxlength: 1000,
        }
    },
    { collection: "reviews", timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
