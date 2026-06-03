import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
    {
        appointmentId: {
            type: String,
            required: true,
            unique: true
        },
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
        date: {
            type: String, // e.g. "YYYY-MM-DD"
            required: true,
        },
        startTime: {
            type: String, // ISO date string or just time e.g. "2024-12-25T09:00:00Z" or "09:00"
            required: true,
        },
        endTime: {
            type: String, // ISO date string
            required: true,
        },
        mode: {
            type: String,
            enum: ['online', 'offline'],
            required: true,
            default: 'offline'
        },
        status: {
            type: String,
            enum: ['pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
            default: 'pending_payment',
        },
        paymentId: {
            type: String,
        },
        amount: {
            type: Number,
        },
        prescription: [{
            medication: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
            instructions: { type: String }
        }],
        notes: {
            type: String,
        },
        isReviewed: {
            type: Boolean,
            default: false
        },
        isEmailReminderSent: {
            type: Boolean,
            default: false
        },
        consultationStartedAt: {
            type: Date
        },
        consultationEndedAt: {
            type: Date
        },
        prescriptionPdfUrl: {
            type: String
        }
    },
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
