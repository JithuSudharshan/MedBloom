import mongoose from "mongoose";
import DoctorAvailability from "./src/model/availabilityModel.js";
import Appointment from "./src/model/appointmentModel.js";

async function testSchemas() {
    // We don't necessarily need to connect to DB just to create a document instance and view it.
    // However, if we want to test validation, we can just instantiate it.
    console.log("--- MEDBLOOM SCHEMA TEST ---");

    try {
        const testDoctorId = new mongoose.Types.ObjectId();

        const doctorAvailability = new DoctorAvailability({
            doctor: testDoctorId,
            slotDuration: 20,
            bufferTime: 5,
            weeklySchedule: [
                {
                    day: "monday",
                    startTime: "09:00",
                    endTime: "13:00",
                    active: true
                },
                {
                    day: "tuesday",
                    startTime: "14:00",
                    endTime: "18:00",
                    active: true
                }
            ],
            blockedDates: ["2026-12-25T00:00:00.000Z"]
        });

        // Trigger validation
        const error = doctorAvailability.validateSync();
        if (error) {
            console.error("Validation Failed:", error);
        } else {
            console.log("\n[SUCCESS] DoctorAvailability schema validated successfully.");
            console.log("\nSample DoctorAvailability Document:");
            console.log(JSON.stringify(doctorAvailability.toObject(), null, 2));
        }

        const patientId = new mongoose.Types.ObjectId();
        
        const appointment = new Appointment({
            patient: patientId,
            doctor: testDoctorId,
            date: "2026-05-15",
            startTime: "2026-05-15T09:00:00.000Z",
            endTime: "2026-05-15T09:20:00.000Z",
            status: "confirmed",
            amount: 500
        });

        const apptError = appointment.validateSync();
        if (apptError) {
            console.error("Appointment Validation Failed:", apptError);
        } else {
            console.log("\n[SUCCESS] Appointment schema validated successfully.");
            console.log("\nSample Appointment Document:");
            console.log(JSON.stringify(appointment.toObject(), null, 2));
        }

    } catch (err) {
        console.error(err);
    }
}

testSchemas();
