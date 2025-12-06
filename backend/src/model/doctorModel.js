import mongoose, { Schema } from "mongoose";

const DoctorSchema = new Schema(
    {
        // --- Link to auth user ---//
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },


        // --- Basic Info ---//

        displayName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },
        dateOfBirth: {
            type: Date
        },
        contactNumber: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            required: true
        },
        location: {
            type: String
        },


        // --- Professional Info ---//
        primarySpecialization: { type: String },
        subSpecializations: { type: [String], default: [] },



        // --- Registration / License ---//
        medicalRegistrationNumber: {
            type: String,
            trim: true,
        },
        licenseNumber: {
            type: String,
            trim: true,
        },
        issuingCouncil: {
            type: String,
            trim: true,
        },
        certificateUrl: {
            type: String,
            required: true,
        },


        // --- Clinic & Consultation ---//
        clinicAddress: {
            type: String,
            trim: true,
        },
        consultationMode: {
            type: String,
            enum: ["online", "offline", "both"],
            default: "offline",
        },
        consultationFees: {
            online: { type: Number, min: 0 },
            offline: { type: Number, min: 0 },
        },


        // --- Profile Meta ---//
        shortBio: {
            type: String,
            maxlength: 800
        },

        rating: {
            type: Number,
            default: 0
        },

        numberOfPatientsTreated: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["approved", "pending", "rejected", "blocked"],
            default: "pending",
        },

        isAdminVerified: {
            type: Boolean,
            default: false
        },

        onboardingStep: {
            type: String,
            enum: ["basic", "completed"],
            default: "basic",
        }
    },
    { collection: "doctors", timestamps: true }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
