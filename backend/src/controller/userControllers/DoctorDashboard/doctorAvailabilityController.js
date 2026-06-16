import Doctor from "../../../model/doctorModel.js";
import Availability from "../../../model/availabilityModel.js";
import { authenticateToken, authorizeRole } from "../../../middlewares/authMiddleware.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidTime = (t) => typeof t === 'string' && TIME_REGEX.test(t);
const hhmmToMins = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

/**
 * Validate incoming availability payload.
 * Returns { valid: true } or { valid: false, message: "..." }
 */
function validatePayload({ rules, weekly, blockedDates }) {
    if (!rules || typeof rules.duration !== 'number' || rules.duration < 5 || rules.duration > 120) {
        return { valid: false, message: "Slot duration must be between 5 and 120 minutes." };
    }
    if (typeof rules.buffer !== 'number' || rules.buffer < 0 || rules.buffer > 60) {
        return { valid: false, message: "Buffer time must be between 0 and 60 minutes." };
    }
    if (typeof rules.advanceWindow !== 'number' || rules.advanceWindow < 1 || rules.advanceWindow > 90) {
        return { valid: false, message: "Advance window must be between 1 and 90 days." };
    }

    for (const day of DAYS) {
        const dayConfig = weekly[day];
        if (!dayConfig || !dayConfig.enabled) continue;

        if (!Array.isArray(dayConfig.slots) || dayConfig.slots.length === 0) {
            return { valid: false, message: `${day} is enabled but has no time slots.` };
        }

        for (const slot of dayConfig.slots) {
            if (!isValidTime(slot.start) || !isValidTime(slot.end)) {
                return { valid: false, message: `Invalid time format in ${day}. Use HH:MM (24h).` };
            }
            if (hhmmToMins(slot.start) >= hhmmToMins(slot.end)) {
                return { valid: false, message: `In ${day}, end time must be after start time.` };
            }
        }
    }

    if (!Array.isArray(blockedDates)) {
        return { valid: false, message: "blockedDates must be an array." };
    }
    for (const d of blockedDates) {
        if (!DATE_REGEX.test(d)) {
            return { valid: false, message: `Blocked date "${d}" is not in YYYY-MM-DD format.` };
        }
    }

    return { valid: true };
}

// ─── Map backend → frontend ──────────────────────────────────────────────────

function mapToFrontend(availability) {
    const weeklyConfig = {};
    for (const day of DAYS) {
        weeklyConfig[day] = { enabled: false, slots: [] };
    }

    for (const daySch of availability.weeklySchedule) {
        if (daySch.active && DAYS.includes(daySch.day)) {
            weeklyConfig[daySch.day].enabled = true;
            // Map all windows (Bug #1 fix: multiple windows per day)
            for (const w of (daySch.windows || [])) {
                weeklyConfig[daySch.day].slots.push({
                    id: `${daySch.day}-${w.startTime}-${w.endTime}`,
                    start: w.startTime,
                    end: w.endTime
                });
            }
        }
    }

    return {
        rules: {
            duration: availability.slotDuration,
            buffer: availability.bufferTime,
            advanceWindow: availability.advanceWindow || 7
        },
        weekly: weeklyConfig,
        blockedDates: availability.blockedDates || []
    };
}

// ─── Map frontend → backend ──────────────────────────────────────────────────

function mapToBackend(weekly) {
    const weeklySchedule = [];
    for (const day of DAYS) {
        if (!weekly[day]?.enabled) continue;
        const windows = (weekly[day].slots || []).map(s => ({
            startTime: s.start,
            endTime: s.end
        }));
        weeklySchedule.push({ day, active: true, windows });
    }
    return weeklySchedule;
}

// ─── Default config (when no availability set yet) ───────────────────────────

const buildDefaultConfig = () => ({
    rules: { duration: 20, buffer: 5, advanceWindow: 7 },
    weekly: Object.fromEntries(DAYS.map(d => [d, { enabled: false, slots: [] }])),
    blockedDates: []
});

// ─── Controller: GET /doctor/availability ────────────────────────────────────

export const getAvailability = async (req, res) => {
    try {
        const userId = req.user._id;
        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const availability = await Availability.findOne({ doctor: doctor._id });
        if (!availability) {
            return res.status(200).json({ success: true, data: buildDefaultConfig() });
        }

        return res.status(200).json({ success: true, data: mapToFrontend(availability) });

    } catch (error) {
        console.error("Error fetching availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── Controller: PUT /doctor/availability ────────────────────────────────────

export const updateAvailability = async (req, res) => {
    try {
        const userId = req.user._id;
        const { rules, weekly, blockedDates } = req.body;

        // Bug #12: Server-side validation
        const validation = validatePayload({ rules, weekly: weekly || {}, blockedDates: blockedDates || [] });
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const weeklySchedule = mapToBackend(weekly);

        let availability = await Availability.findOne({ doctor: doctor._id });

        if (availability) {
            availability.slotDuration = rules.duration;
            availability.bufferTime = rules.buffer;             // Bug #14: now saved correctly
            availability.advanceWindow = rules.advanceWindow;
            availability.weeklySchedule = weeklySchedule;
            availability.blockedDates = blockedDates || [];
            await availability.save();
        } else {
            availability = await Availability.create({
                doctor: doctor._id,
                slotDuration: rules.duration,
                bufferTime: rules.buffer,                        // Bug #14: now saved correctly
                advanceWindow: rules.advanceWindow,
                weeklySchedule,
                blockedDates: blockedDates || []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Availability updated successfully",
            data: mapToFrontend(availability)
        });

    } catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
