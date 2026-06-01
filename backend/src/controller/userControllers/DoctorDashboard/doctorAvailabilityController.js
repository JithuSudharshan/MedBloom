import Doctor from "../../../model/doctorModel.js";
import Availability from "../../../model/availabilityModel.js";

// Fetch availability
export const getAvailability = async (req, res) => {
    try {
        const userId = req.user._id;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let availability = await Availability.findOne({ doctor: doctor._id });

        if (!availability) {
            // Return default configuration if not found
            const defaultConfig = {
                rules: { duration: 20, buffer: 5, advanceWindow: 7 },
                weekly: {
                    monday: { enabled: false, slots: [] },
                    tuesday: { enabled: false, slots: [] },
                    wednesday: { enabled: false, slots: [] },
                    thursday: { enabled: false, slots: [] },
                    friday: { enabled: false, slots: [] },
                    saturday: { enabled: false, slots: [] },
                    sunday: { enabled: false, slots: [] },
                },
                blockedDates: []
            };
            return res.status(200).json({ success: true, data: defaultConfig });
        }

        // Map backend schema to frontend structure
        const weeklyConfig = {
            monday: { enabled: false, slots: [] },
            tuesday: { enabled: false, slots: [] },
            wednesday: { enabled: false, slots: [] },
            thursday: { enabled: false, slots: [] },
            friday: { enabled: false, slots: [] },
            saturday: { enabled: false, slots: [] },
            sunday: { enabled: false, slots: [] },
        };

        availability.weeklySchedule.forEach(daySch => {
            if (daySch.active) {
                weeklyConfig[daySch.day].enabled = true;
                weeklyConfig[daySch.day].slots.push({ start: daySch.startTime, end: daySch.endTime });
            }
        });

        const mappedConfig = {
            rules: { duration: availability.slotDuration, buffer: availability.bufferTime, advanceWindow: availability.advanceWindow || 7 },
            weekly: weeklyConfig,
            blockedDates: availability.blockedDates
        };

        return res.status(200).json({ success: true, data: mappedConfig });

    } catch (error) {
        console.error("Error fetching availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Upsert availability
export const updateAvailability = async (req, res) => {
    try {
        const userId = req.user._id;
        const { rules, weekly, blockedDates } = req.body;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Map frontend structure to backend schema
        const mappedWeeklySchedule = [];
        Object.keys(weekly).forEach(day => {
            if (weekly[day].enabled) {
                // For each slot in the day, add to weeklySchedule
                weekly[day].slots.forEach(slot => {
                    mappedWeeklySchedule.push({
                        day: day.toLowerCase(),
                        startTime: slot.start,
                        endTime: slot.end,
                        active: true
                    });
                });
            }
        });

        let availability = await Availability.findOne({ doctor: doctor._id });

        if (availability) {
            // Update existing
            availability.slotDuration = rules.duration || 20;
            availability.bufferTime = rules.buffer || 5;
            availability.advanceWindow = rules.advanceWindow || 7;
            availability.weeklySchedule = mappedWeeklySchedule;
            availability.blockedDates = blockedDates || [];
            await availability.save();
        } else {
            // Create new
            availability = await Availability.create({
                doctor: doctor._id,
                slotDuration: rules.duration || 20,
                bufferTime: rules.buffer || 5,
                advanceWindow: rules.advanceWindow || 7,
                weeklySchedule: mappedWeeklySchedule,
                blockedDates: blockedDates || []
            });
        }

        return res.status(200).json({ success: true, message: "Availability updated successfully", data: availability });

    } catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
