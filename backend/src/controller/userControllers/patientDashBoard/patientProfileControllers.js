import User from "../../../model/userModel.js";
import Patient from "../../../model/patientModel.js";
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
                emergencyNumber: patient.emergencyNumber
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
        const limit = parseInt(req.query.limit || "5", 5);
        const skip = (page - 1) * limit;


        const { _id } = req.user

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        const user = _id;
        const patient = await Patient.findOne({ user })

        if (!patient)
            return res.status(404).json({ success: false, message: "Patient not found" })

        const filter = { status: "pending" }; // will cyhange according to appointmnet schema

        //here comes the appointment mongoDb logic
        const totalPages = 3

        //Math.max(1, Math.ceil(total / limit));


        const dummyAppointments = [
            {
                id: 1,
                doctorName: "Dr. Arjun Menon",
                speciality: "Cardiology",
                dateTimeLabel: "2023-11-10 at 10:00 AM",
                status: "Upcoming",
            },
            {
                id: 2,
                doctorName: "Dr. Arjun Menon",
                speciality: "Cardiology",
                dateTimeLabel: "2023-11-10 at 10:00 AM",
                status: "Upcoming",
            },
            {
                id: 3,
                doctorName: "Dr. Arjun Menon",
                speciality: "Cardiology",
                dateTimeLabel: "2023-11-10 at 10:00 AM",
                status: "Completed",
            },
            {
                id: 4,
                doctorName: "Dr. Arjun Menon",
                speciality: "Cardiology",
                dateTimeLabel: "2023-11-10 at 10:00 AM",
                status: "Cancelled",
            }
        ];


        return res.status(200).json({
            success: true,
            data: {
                appointments: dummyAppointments,
                page,
                totalPages,
                totalCount: dummyAppointments.length
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
