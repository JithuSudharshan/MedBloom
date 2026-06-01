/**
 * Generates available time slots for a doctor on a specific date,
 * taking into account slot duration, buffer time, and existing bookings.
 * 
 * @param {Object} availability - The DoctorAvailability document
 * @param {String} targetDateStr - Target date in YYYY-MM-DD format
 * @param {Array} bookedSlots - Array of existing Appointment documents for that date
 * @returns {Array} Array of available slot objects { displayTime, isoStart, isoEnd }
 */
export function generateAvailableSlots(availability, targetDateStr, bookedSlots) {
    const targetDate = new Date(targetDateStr);
    
    // Fallback if invalid date
    if (isNaN(targetDate.getTime())) return [];

    // 1. Check if date is explicitly blocked
    if (availability.blockedDates && availability.blockedDates.includes(targetDateStr)) {
        return [];
    }

    // 2. Determine the day of the week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[targetDate.getUTCDay()];

    // 3. Find schedule for that day
    const daySchedule = availability.weeklySchedule.find(d => d.day === dayOfWeek);
    if (!daySchedule || !daySchedule.active) {
        return [];
    }

    const { slotDuration, bufferTime } = availability;
    
    // Logic Step 1: Calculate totalCycleTime
    const totalCycleTime = slotDuration + bufferTime; // in minutes

    const [startHour, startMin] = daySchedule.startTime.split(':').map(Number);
    const [endHour, endMin] = daySchedule.endTime.split(':').map(Number);

    const startMs = new Date(targetDate).setUTCHours(startHour, startMin, 0, 0);
    const endMs = new Date(targetDate).setUTCHours(endHour, endMin, 0, 0);

    const availableSlots = [];
    let currentMs = startMs;

    // Logic Step 2: Map through time ranges
    while (currentMs + (slotDuration * 60000) <= endMs) {
        const candidateStart = currentMs;
        const candidateEnd = currentMs + (slotDuration * 60000);

        // Logic Step 3: Filter out overlaps with bookedSlots
        // Rule: candidateStart < aptEnd && candidateEnd > aptStart
        const isOverlapping = bookedSlots.some(apt => {
            const aptStart = new Date(apt.startTime).getTime();
            const aptEnd = new Date(apt.endTime).getTime();
            return (candidateStart < aptEnd && candidateEnd > aptStart);
        });

        if (!isOverlapping) {
            const isoStart = new Date(candidateStart).toISOString();
            const isoEnd = new Date(candidateEnd).toISOString();
            
            // Format time for display (e.g. 09:00 AM)
            const formatTime = (ms) => {
                const d = new Date(ms);
                return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
            };
            
            availableSlots.push({
                displayTime: `${formatTime(candidateStart)} - ${formatTime(candidateEnd)}`,
                isoStart,
                isoEnd
            });
        }

        // Advance by slot duration + buffer
        currentMs += (totalCycleTime * 60000);
    }

    return availableSlots;
}
