import DoctorAvailability from "../../model/availabilityModel.js";
import Appointment from "../../model/appointmentModel.js";
import Doctor from "../../model/doctorModel.js";
import User from "../../model/userModel.js";
import { generateAvailableSlots } from "../../utils/slotEngine.js";

/**
 * GET /api/doctors/:id
 * Fetches the public profile data of a specific doctor
 */
export const getDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.params.id;
        
        const doctor = await Doctor.findById(doctorId).populate("user", "name email");
        
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const availability = await DoctorAvailability.findOne({ doctor: doctorId });

        return res.status(200).json({
            success: true,
            data: {
                ...doctor.toObject(),
                availabilityConfig: {
                    advanceWindow: availability?.advanceWindow || 7,
                    blockedDates: availability?.blockedDates || []
                }
            }
        });
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * GET /api/doctors/:id/available-slots?date=YYYY-MM-DD
 * Fetches doctor's availability and existing appointments for the date,
 * then uses the Logic Engine to calculate exact available time slots.
 */
export const getAvailableSlots = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const targetDate = req.query.date;

        if (!targetDate) {
            return res.status(400).json({ success: false, message: "Date parameter is required" });
        }

        // 1. Fetch Doctor's Availability Configuration
        const availability = await DoctorAvailability.findOne({ doctor: doctorId });
        if (!availability) {
            return res.status(404).json({ success: false, message: "Doctor availability configuration not found" });
        }

        // 2. Fetch Booked Appointments for that specific date
        // Excludes cancelled appointments as those slots should be freed up
        const bookedSlots = await Appointment.find({ 
            doctor: doctorId, 
            date: targetDate,
            status: { $ne: 'cancelled' } 
        });

        // 3. Pass data to the Slot Logic Engine
        const availableSlots = generateAvailableSlots(availability, targetDate, bookedSlots);

        return res.status(200).json({
            success: true,
            data: {
                availableSlots,
                bookedSlots // Sent to UI to render greyed-out "locked" chips
            }
        });

    } catch (error) {
        console.error("Error fetching available slots:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
