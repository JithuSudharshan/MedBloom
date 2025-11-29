import { ENV } from "../../../config/env.js";
import User from "../../../model/userModel.js";
import Patient from "../../../model/patientModel.js";
import bcrypt from 'bcrypt';
import { formatDOB, formatName } from '../../../utils/formatters.js'

export const ChangePatientPassword = async (req, res) => {
    try {
        const { confirmPassword, currentPassword, newPassword } = req.body

        const userId = req.user._id;

        if (!confirmPassword || !currentPassword || !newPassword)
            return res.status(400).json({ success: false, message: "All fileds are mandatory" })

        if (currentPassword === newPassword)
            return res.status(400).json({
                success: false, message: "New password must be different from current password"
            });

        if (newPassword !== confirmPassword)
            return res.status(400).json({ success: false, message: "Passwords do not match. Please try again." })

        const isExist = await User.findOne({ _id: userId }).select('+passwordHash')

        if (!isExist)
            return res.status(400).json({ succes: false, message: "Credentials doesn't match" })

        const isPasswordValid = await bcrypt.compare(currentPassword, isExist.passwordHash);

        if (!isPasswordValid)
            return res.status(400).json({ success: false, message: "Enter a valid Current password" })

        const hashedPassord = await bcrypt.hash(newPassword, ENV.SALTROUND)

        isExist.passwordHash = hashedPassord

        await isExist.save()

        res.status(200).json({ success: true, message: "Password changed. Please log in again." })

    } catch (error) {
        console.log("error in change password", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

export const fetchUserDetails = async (req, res) => {

    try {
        const { email } = req.user

        const isUser = await User.findOne({ email })

        if (!isUser)
            return res.status(400).json({ success: false, message: "User not found" })

        const patient = await Patient.findOne({ user: isUser._id })

        if (!patient)
            return res.status(4000).json({ success: false, message: "User not found" })

        const fullName = formatName(isUser.name)
        const DOB = formatDOB(patient.dob)
        const height = patient.height.toString().concat(" Cm")
        const weight = patient.weight.toString().concat(" Kg")

        res.status(200).json({
            success: true,
            details: {
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
                medicalCondition: patient.medicalCondition,
                avatar: {
                    src: patient.profile_url,
                    alt: "profile picture"
                }
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