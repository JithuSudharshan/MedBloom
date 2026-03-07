import Patient from "../../../model/patientModel.js";
import User from "../../../model/userModel.js";
import { formatDOB, formatName } from "../../../utils/formatters.js";


export const fetchTotalPatients = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "15", 10);
        const skip = (page - 1) * limit;

        const filter = { role: "patient", isVerified: true };

        const [users, totalPatients] = await Promise.all([
            User.find(filter)
                .select("name email phone lastLogin")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);

        const userIds = users.map((u) => u._id);

        const patientDocs = await Patient.find({ user: { $in: userIds } })
            .select("user gender")
            .lean();


        const patientByUserId = new Map(
            patientDocs.map((p) => [String(p.user), p])
        );

        const patients = users.map((u) => {
            const p = patientByUserId.get(String(u._id));
            return {
                ...u,
                gender: p?.gender || null,
            };
        });

        console.log("fetched patients", users)

        const totalPages = Math.max(1, Math.ceil(totalPatients / limit));

        return res.status(200).json({
            success: true,
            data: {
                patients,
                page,
                totalPages,
                totalPatients,
            },
        });
    } catch (error) {
        console.log("Error during fetching Total Patients ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const fetchPatientPorfile = async (req, res) => {
    try {
        const { id } = req.params

        const patient = await Patient.findOne({ user: id })


        if (!patient)
            return res.status(400).json({ success: false, message: "User not found" })

        const isUser = await User.findOne({ _id: patient.user })

        if (!isUser)
            return res.status(400).json({ success: false, message: "User not found" })



        const fullName = formatName(isUser.name)
        const DOB = formatDOB(patient.dob)
        const height = patient.height.toString().concat(" cm")
        const weight = patient.weight.toString().concat(" kg")

        res.status(200).json({
            success: true,
            details: {
                _id: patient._id,
                fullName: fullName,
                email: isUser.email,
                phone: isUser.phone,
                dob: DOB,
                gender: patient.gender,
                address: patient.address,
                bloodType: patient.bloodType,
                cholesterol: patient.cholesterol,
                height: height,
                weight: weight,
                bloodPressure: patient.bloodPressure,
                glucoseLevel: patient.glucoseLevel,
                allergies: patient.allergies,
                smoking: patient.smoking,
                drinking: patient.smoking,
                medicalCondition: patient.medicalCondition,
                avatar: {
                    src: patient.profile_url,
                    alt: "profile picture"
                },
                Food_or_Drug_Intolerances: patient.Food_or_Drug_Intolerances,
                Mental_Health_History: patient.Mental_Health_History
            }
        });

    } catch (error) {
        console.log("Error while fetching patient details: ", error)
        res.status(500).json({ Success: false, message: "error while fetching user details" });
    }
};

export const fetchPatientDetailsToEdit = async (req, res) => {
    try {
        const { id } = req.params

        const patient = await Patient.findOne({ _id: id })
        console.log("patient =>", patient)

        if (!patient)
            return res.status(400).json({ success: false, message: "User not found" })


        const isUser = await User.findOne({ _id: patient.user })

        if (!isUser)
            return res.status(400).json({ success: false, message: "User not found" })


        const fullName = formatName(isUser.name)
        const DOB = formatDOB(patient.dob)
        const height = patient.height.toString().concat(" cm")
        const weight = patient.weight.toString().concat(" kg")

        res.status(200).json({
            success: true,
            details: {
                _id: patient._id,
                fullName: fullName,
                email: isUser.email,
                phone: isUser.phone,
                dob: DOB,
                gender: patient.gender,
                address: patient.address,
                bloodType: patient.bloodType,
                cholesterol: patient.cholesterol,
                height: height,
                weight: weight,
                bloodPressure: patient.bloodPressure,
                glucoseLevel: patient.glucoseLevel,
                allergies: patient.allergies,
                smoking: patient.smoking,
                drinking: patient.smoking,
                medicalCondition: patient.medicalCondition,
                avatar: {
                    src: patient.profile_url,
                    alt: "profile picture"
                },
                Food_or_Drug_Intolerances: patient.Food_or_Drug_Intolerances,
                Mental_Health_History: patient.Mental_Health_History
            }
        });

    } catch (error) {
        console.log("Error while fetching user details: ", error)
        res.status(500).json({ Success: false, message: "error while fetching user details" });
    }
}

export const editPatientsProfile = async (req, res) => {
    try {
        let {
            emergencyNumber,
            dateOfBirth,
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

        const { id } = req.params

        if (
            !emergencyNumber ||
            !dateOfBirth ||
            !gender ||
            !address ||
            !smoking ||
            !drinking
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Fill mandatory fields" });
        }

        const patient = await Patient.findOne({ _id: id });
        if (!patient) {
            return res
                .status(404)
                .json({ success: false, message: "Patient not found" });
        }

        const userDetails = await User.findById({ _id: patient.user });
        if (!userDetails) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }



        height = height.split(" ")
        weight = weight.split(" ")

        patient.emergencyNumber = emergencyNumber || patient.emergencyNumber;
        patient.dob = dateOfBirth
            ? new Date(dateOfBirth)
            : patient.dob;
        patient.gender = gender || patient.gender
        patient.address = address || patient.address
        patient.bloodType = bloodType || patient.bloodType
        patient.cholesterol = cholesterol || patient.cholesterol
        patient.height = Number(height[0]) || patient.height
        patient.weight = Number(weight[0]) || patient.weight
        patient.bloodPressure = bloodPressure || patient.bloodPressure
        patient.glucoseLevel = glucoseLevel || patient.glucoseLevel
        patient.allergies = allergies || patient.allergies
        patient.medicalCondition = medicalCondition || patient.medicalCondition
        patient.smoking = smoking || patient.smoking
        patient.drinking = drinking || patient.drinking
        patient.Food_or_Drug_Intolerances = Food_or_Drug_Intolerances || patient.Food_or_Drug_Intolerances
        patient.Mental_Health_History = Mental_Health_History || patient.Mental_Health_History

        await patient.save()

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
}