import mongoose, { Schema } from "mongoose";

// Each "time window" within a day (e.g., 09:00-12:00, 14:00-17:00)
const TimeWindowSchema = new Schema({
    startTime: { 
        type: String, // "HH:MM" 24h format
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format']
    },
    endTime: { 
        type: String, // "HH:MM" 24h format
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format']
    }
}, { _id: false });

// Each day has: is it active, and an array of time windows
const DayScheduleSchema = new Schema({
    day: { 
        type: String, 
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], 
        required: true 
    },
    active: { 
        type: Boolean, 
        default: false 
    },
    windows: {
        type: [TimeWindowSchema],
        default: []
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
            default: 20,
            min: [5, 'Slot duration must be at least 5 minutes'],
            max: [120, 'Slot duration cannot exceed 120 minutes']
        },
        bufferTime: {
            type: Number, // in minutes
            required: true,
            default: 5,
            min: [0, 'Buffer time cannot be negative'],
            max: [60, 'Buffer time cannot exceed 60 minutes']
        },
        advanceWindow: {
            type: Number, // in days
            default: 7,
            min: [1, 'Advance window must be at least 1 day'],
            max: [90, 'Advance window cannot exceed 90 days']
        },
        weeklySchedule: {
            type: [DayScheduleSchema],
            default: []
        },
        blockedDates: {
            type: [String], // Array of ISO date strings e.g. "2024-12-25"
            default: [],
            validate: {
                validator: function(dates) {
                    return dates.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
                },
                message: 'All blocked dates must be in YYYY-MM-DD format'
            }
        }
    },
    { collection: "availability", timestamps: true }
);

const DoctorAvailability = mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);

export default DoctorAvailability;
