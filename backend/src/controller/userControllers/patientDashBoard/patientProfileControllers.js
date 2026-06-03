import User from "../../../model/userModel.js";
import Patient from "../../../model/patientModel.js";
import Appointment from "../../../model/appointmentModel.js";
import { formatDOB, formatName } from '../../../utils/formatters.js'


export const fetchUserDetails = async (req, res) => {

    try {
        const { email } = req.user
        const purpose = req.query.purpose

        if (!purpose)
            return res.status(400).json({ success: false, message: "Invalid url" })

        const isUser = await User.findOne({ email })

        if (!isUser)
            return res.status(400).json({ success: false, message: "User not found" })

        const fullName = formatName(isUser.name)

        const patient = await Patient.findOne({ user: isUser._id })

        if (!patient)
            return res.status(200).json({
                success: true,
                details: {
                    fullName: fullName,
                    email: isUser.email,
                    phone: isUser.phone,
                    authMethod: isUser.authMethod,
                    isOnboarded: isUser.isOnboarded,
                    avatar: {
                        src: isUser.profile_url,
                        alt: "profile picture"
                    },
                }
            });


        const DOB = formatDOB(patient.dob)

        const fieldsToCheck = [
            patient.gender, patient.address, patient.bloodType, patient.cholesterol,
            patient.height, patient.weight, patient.bloodPressure, patient.glucoseLevel,
            patient.allergies, patient.smoking, patient.drinking, patient.medicalCondition,
            patient.Food_or_Drug_Intolerances, patient.Mental_Health_History, patient.emergencyNumber,
            isUser.phone, patient.dob
        ];
        const filledFields = fieldsToCheck.filter(field => field !== undefined && field !== null && field !== "").length;
        const profileStatus = Math.round((filledFields / fieldsToCheck.length) * 100) + "% Complete";

        res.status(200).json({
            success: true,
            details: {
                fullName: fullName || isUser.name,
                email: isUser.email,
                authMethod: isUser.authMethod,
                phone: isUser.phone,
                dob: purpose === "forDashboard" ? DOB : patient.dob,
                gender: patient.gender,
                address: patient.address,
                bloodType: patient.bloodType,
                cholesterol: patient.cholesterol,
                height: patient.height,
                weight: patient.weight,
                bloodPressure: patient.bloodPressure,
                glucoseLevel: patient.glucoseLevel,
                allergies: patient.allergies,
                smoking: patient.smoking,
                drinking: patient.drinking,
                medicalCondition: patient.medicalCondition,
                avatar: {
                    src: patient.profile_url || isUser.profile_url,
                    alt: "profile picture"
                },
                Food_or_Drug_Intolerances: patient.Food_or_Drug_Intolerances,
                Mental_Health_History: patient.Mental_Health_History,
                isOnboarded: isUser.isOnboarded,
                phone: isUser.phone,
                emergencyNumber: patient.emergencyNumber,
                profileStatus: profileStatus,
                nextAppointment: "Oct 24, 2026",
                lastCheckup: "2 months ago"
            }
        });

    } catch (error) {
        console.log("Error while fetching user details: ", error)
        res.status(500).json({ Success: false, message: "error while fetching user details" });
    }
};

export const updateProfilePicture = async (req, res) => {

    try {
        const { _id } = req.user
        const profile_url = req.body.profile_url

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        if (!profile_url)
            return res.status(400).json({ success: false, message: "Profile_url not found" })

        const user = _id;
        const patient = await Patient.findOne({ user })

        if (!patient)
            return res.status(404).json({ success: false, message: "Patient not found" })

        patient.profile_url = profile_url;

        await patient.save()

        res.status(200).json({
            success: true,
            message: "Profile picture updated",
            profile_url: patient.profile_url
        })

    } catch (error) {
        console.log("Error in updating profile picture", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
};

export const editProfile = async (req, res) => {
    try {
        let {
            emergencyNumber,
            phone,
            gender,
            address,
            bloodType,
            cholesterol,
            height,
            weight,
            bloodPressure,
            glucoseLevel,
            allergies,
            medicalCondition,
            smoking,
            drinking,
            Food_or_Drug_Intolerances,
            Mental_Health_History,
        } = req.body;

        const userId = req.user._id;

        if (
            !userId ||
            !emergencyNumber ||
            !gender ||
            !address ||
            !smoking ||
            !drinking
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Fill mandatory fields" });
        }

        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const patient = await Patient.findOne({ user: userDetails._id });
        if (!patient) {
            return res
                .status(404)
                .json({ success: false, message: "Patient not found" });
        }


        patient.emergencyNumber = emergencyNumber || patient.emergencyNumber;
        patient.gender = gender || patient.gender
        patient.address = address || patient.address
        patient.bloodType = bloodType || patient.bloodType
        patient.cholesterol = cholesterol || patient.cholesterol
        patient.height = height || patient.height
        patient.weight = weight || patient.weight
        patient.bloodPressure = bloodPressure || patient.bloodPressure
        patient.glucoseLevel = glucoseLevel || patient.glucoseLevel
        patient.allergies = allergies || patient.allergies
        patient.medicalCondition = medicalCondition || patient.medicalCondition
        patient.smoking = smoking || patient.smoking
        patient.drinking = drinking || patient.drinking
        patient.Food_or_Drug_Intolerances = Food_or_Drug_Intolerances || patient.Food_or_Drug_Intolerances
        patient.Mental_Health_History = Mental_Health_History || patient.Mental_Health_History
        userDetails.phone = phone || userDetails.phone


        await patient.save()
        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "Patient profile updated successfully",
            patient
        });
    } catch (error) {
        console.log("Error during patient edit: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const fetchPatientAppointments = async (req, res) => {
    try {

        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const skip = (page - 1) * limit;


        const { _id } = req.user

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        const user = _id;
        const patient = await Patient.findOne({ user })

        if (!patient)
            return res.status(404).json({ success: false, message: "Patient not found" })

        const filter = { 
            patient: patient._id, 
            status: { $ne: 'pending_payment' } 
        }; 

        const totalCount = await Appointment.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        const appointments = await Appointment.find(filter)
            .sort({ date: -1, startTime: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'doctor',
                select: 'displayName primarySpecialization profilePicture clinicAddress consultationMode'
            });

        const mappedAppointments = appointments.map((app) => {
            // Map status
            let mappedStatus = "Upcoming";
            if (app.status === "completed") mappedStatus = "Completed";
            if (app.status === "cancelled") mappedStatus = "Cancelled";

            // Format date to something readable e.g., "Nov 10, 2023"
            let formattedDate = app.date;
            try {
                const dateObj = new Date(app.date);
                formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } catch(e) {}

            // Format time properly (app.startTime is an ISO string)
            let formattedTime = app.startTime;
            try {
                if (app.startTime && !app.startTime.includes('T')) {
                    const [hour, minute] = app.startTime.split(':');
                    const timeObj = new Date();
                    timeObj.setHours(parseInt(hour, 10), parseInt(minute, 10), 0);
                    formattedTime = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                } else {
                    const timeObj = new Date(app.startTime);
                    if (!isNaN(timeObj.getTime())) {
                        formattedTime = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                    }
                }
            } catch(e) {}

            let docName = app.doctor?.displayName || "Unknown";
            const docNameLower = docName.toLowerCase().trim();
            if (!docNameLower.startsWith("dr.") && !docNameLower.startsWith("dr ")) {
                docName = `Dr. ${docName}`;
            } else if (docNameLower.startsWith("dr ")) {
                // Ensure it has a period if it just says "Dr "
                docName = `Dr. ${docName.substring(3).trim()}`;
            }

            return {
                id: app._id,
                appointmentId: app.appointmentId || `#MED-${app._id.toString().slice(-6).toUpperCase()}`,
                doctorId: app.doctor?._id,
                primaryTitle: docName,
                secondaryText: app.doctor?.primarySpecialization || "Specialist",
                doctorImage: app.doctor?.profilePicture || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150',
                clinicAddress: app.doctor?.clinicAddress || "MedBloom Central Hospital",
                consultationMode: app.mode || app.doctor?.consultationMode || "offline",
                dateTimeLabel: `${formattedDate}  ${formattedTime}`,
                rawDate: app.date,
                rawEndTime: app.endTime,
                status: mappedStatus,
                isReviewed: app.isReviewed || false,
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                appointments: mappedAppointments,
                page,
                totalPages,
                totalCount: totalCount
            },
        });

    } catch (error) {
        console.error("Error while fetching appointments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAppointmentDetailsForConsultation = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id).populate({
            path: 'doctor',
            populate: { path: 'user' }
        });

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        const patientDoc = await Patient.findOne({ user: req.user._id });
        // Verify patient owns the appointment
        if (!patientDoc || appointment.patient.toString() !== patientDoc._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to view this appointment" });
        }

        return res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error("Error fetching appointment details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
