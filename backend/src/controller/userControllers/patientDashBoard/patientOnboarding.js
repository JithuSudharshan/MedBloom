import Patient from "../../../model/patientModel.js";
import User from "../../../model/userModel.js";

export const onboardPatient = async (req, res) => {
    try {
        const {
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
            Mental_Health_History

        } = req.body;

        const user = req.user._id;
        const profile_url = req.body.profile_url
        console.log("url", profile_url)

        const userDetails = await User.findById({ _id: user })

        if (!user || !emergencyNumber || !dateOfBirth || !gender || !address || !smoking || !drinking)
            return res.status(400).json({ success: false, message: "Fill mandatory fields" })

        const patient = await Patient.create({
            user,
            profile_url,
            emergencyNumber,
            dob: new Date(dateOfBirth),
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
            Mental_Health_History
        })

        userDetails.isOnboarded = true;
        await userDetails.save()

        if (patient)
            return res.status(201).json({
                success: true,
                message: "Patient onboarded successfully",
                patient
            })

    } catch (error) {

        console.log("Error during patient onboarding : ", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}
