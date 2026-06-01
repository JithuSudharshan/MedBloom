import { generateAvailableSlots } from './src/utils/slotEngine.js';

// Mock Availability Document (20 min slot, 5 min buffer)
const mockAvailability = {
    slotDuration: 20,
    bufferTime: 5,
    blockedDates: ["2026-05-16"], // A blocked date test
    weeklySchedule: [
        {
            day: 'friday', // 2026-05-15 is a Friday
            startTime: '09:00',
            endTime: '11:00',
            active: true
        }
    ]
};

// Target Date: May 15, 2026
const targetDateStr = "2026-05-15";

// Mock Booked Appointments (Overlapping with the 09:25 and 10:15 slots)
const mockBookedSlots = [
    {
        // Books the 09:25 AM slot exactly (09:25 - 09:45)
        startTime: "2026-05-15T09:25:00.000Z",
        endTime: "2026-05-15T09:45:00.000Z"
    },
    {
        // Partially overlaps with the 10:15 AM slot (10:15 - 10:35)
        startTime: "2026-05-15T10:10:00.000Z",
        endTime: "2026-05-15T10:20:00.000Z"
    }
];

console.log("--- MEDBLOOM SLOT ENGINE TEST ---");
console.log("Config: 20-min slots | 5-min buffer | 09:00 to 11:00");
console.log("Booked Times: 09:25-09:45 AND 10:10-10:20\n");

const availableSlots = generateAvailableSlots(mockAvailability, targetDateStr, mockBookedSlots);

console.log("Generated Available Slots:");
console.log(JSON.stringify(availableSlots, null, 2));

console.log(`\nTotal Available Slots: ${availableSlots.length}`);
