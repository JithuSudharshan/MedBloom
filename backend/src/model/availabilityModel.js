import mongoose, { Schema } from "mongoose";

const DayScheduleSchema = new Schema({
    day: { 
        type: String, 
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], 
        required: true 
    },
    startTime: { 
        type: String, // e.g. "09:00"
        required: true 
    },
    endTime: { 
        type: String, // e.g. "17:00"
        required: true 
    },
    active: { 
        type: Boolean, 
        default: false 
    }
}, { _id: false });

const DoctorAvailabilitySchema = new Schema(
    {
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
            unique: true,
        },
        slotDuration: {
            type: Number, // in minutes
            required: true,
            default: 20
        },
        bufferTime: {
            type: Number, // in minutes
            required: true,
            default: 5
        },
        advanceWindow: {
            type: Number, // in days
            default: 7
        },
        weeklySchedule: {
            type: [DayScheduleSchema],
            default: []
        },
        blockedDates: {
            type: [String], // Array of ISO date strings e.g. "2024-12-25"
            default: []
        }
    },
    { collection: "availability", timestamps: true }
);

const DoctorAvailability = mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);

export default DoctorAvailability;
