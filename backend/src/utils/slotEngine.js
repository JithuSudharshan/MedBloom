/**
 * Generates available time slots for a doctor on a specific date,
 * taking into account slot duration, buffer time, and existing bookings.
 *
 * KEY FIXES:
 * - Bug #5: Iterates ALL windows per day (not just the first)
 * - Bug #6: Filters out past slots when targetDate is today
 * - Bug #7: Enforces advanceWindow server-side
 * - Bug #9: Fixed overlap detection — compares HH:mm strings correctly
 *
 * @param {Object} availability - The DoctorAvailability document
 * @param {String} targetDateStr - Target date in YYYY-MM-DD format
 * @param {Array}  bookedSlots   - Appointment documents for that date
 * @returns {Array} Array of { displayTime, isoStart, isoEnd }
 */
export function generateAvailableSlots(availability, targetDateStr, bookedSlots) {
    // ─── Guard: valid date ───────────────────────────────────────────────────
    const targetDate = new Date(`${targetDateStr}T00:00:00`); // parse as LOCAL midnight
    if (isNaN(targetDate.getTime())) return [];

    // ─── Guard: date must be within advanceWindow ────────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + (availability.advanceWindow || 7));
    if (targetDate < today || targetDate > maxDate) return [];

    // ─── Guard: explicitly blocked date ─────────────────────────────────────
    if (availability.blockedDates?.includes(targetDateStr)) return [];

    // ─── Guard: find the day schedule ────────────────────────────────────────
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[targetDate.getDay()];
    const daySchedule = availability.weeklySchedule.find(d => d.day === dayOfWeek);
    if (!daySchedule?.active || !daySchedule.windows?.length) return [];

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const pad = (n) => n.toString().padStart(2, '0');

    const hhmmToMinutes = (hhmm) => {
        if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) return NaN;
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    };

    const minutesToHhmm = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

    const formatDisplay = (hhmm) => {
        const [h, m] = hhmm.split(':').map(Number);
        const suffix = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${pad(m)} ${suffix}`;
    };

    // Current time in minutes (for today's "past slot" filter)
    const isToday = targetDate.toDateString() === today.toDateString();
    const nowMinutes = isToday ? (new Date().getHours() * 60 + new Date().getMinutes()) : -1;

    // Pre-process booked slots into HH:mm minutes for fast comparison
    const bookedRanges = bookedSlots
        .filter(apt => apt.status !== 'cancelled')
        .map(apt => {
            // startTime stored as "HH:mm"
            const startMins = hhmmToMinutes(apt.startTime);
            const endMins   = hhmmToMinutes(apt.endTime);
            return { startMins, endMins };
        })
        .filter(r => !isNaN(r.startMins) && !isNaN(r.endMins));

    const { slotDuration, bufferTime } = availability;
    const totalCycle = slotDuration + bufferTime;

    const availableSlots = [];

    // ─── Iterate each time window for the day ────────────────────────────────
    for (const window of daySchedule.windows) {
        const windowStart = hhmmToMinutes(window.startTime);
        const windowEnd   = hhmmToMinutes(window.endTime);

        if (isNaN(windowStart) || isNaN(windowEnd) || windowStart >= windowEnd) continue;

        let cursor = windowStart;

        while (cursor + slotDuration <= windowEnd) {
            const candidateStart = cursor;
            const candidateEnd   = cursor + slotDuration;

            // Bug #6: Skip past slots for today
            if (isToday && candidateStart <= nowMinutes) {
                cursor += totalCycle;
                continue;
            }

            // Bug #9: Overlap check uses HH:mm minutes consistently
            const isOverlapping = bookedRanges.some(
                r => candidateStart < r.endMins && candidateEnd > r.startMins
            );

            if (!isOverlapping) {
                const isoStart = minutesToHhmm(candidateStart);
                const isoEnd   = minutesToHhmm(candidateEnd);
                availableSlots.push({
                    displayTime: `${formatDisplay(isoStart)} – ${formatDisplay(isoEnd)}`,
                    isoStart,
                    isoEnd
                });
            }

            cursor += totalCycle;
        }
    }

    return availableSlots;
}
