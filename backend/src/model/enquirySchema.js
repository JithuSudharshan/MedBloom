import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
        }
    },
    { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
