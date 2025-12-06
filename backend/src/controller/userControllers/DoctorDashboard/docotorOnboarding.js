import Doctor from "../../../model/doctorModel.js";
import User from "../../../model/userModel.js";

export const doctorBasicOnboarding = async (req, res) => {
    try {
        const {
            contactNumber,
            dateOfBirth,
            gender,
            location,
            displayName,
            shortBio
        } = req.body

        const user = req.user._id
        const profilePicture = req.body.profile_url

        if (!contactNumber || !dateOfBirth || !gender || !location || !displayName || !shortBio)
            return res.status(400).json({ sucess: false, message: "Fill Mandatory fields" })

        const doctor = await Doctor.create({
            user,
            contactNumber,
            dateOfBirth,
            gender,
            location,
            displayName,
            shortBio,
            profilePicture,
            onboardingStep: "basic"
        })

        if (doctor)
            return res.status(201).json({
                success: true,
                message: "Doctor onboarded successfully",
                doctor
            })

    } catch (error) {
        console.log("Error while doctor basic onboarding : ", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const doctorProffesionalOnboarding = async (req, res) => {

    try {

        const {
            primarySpecialization,
            subSpecializations,
            medicalRegistrationNumber,
            issuingCouncil,
            licenseNumber,
            clinicAddress,
            consultationMode,
            consultationFeesOnline,
            consultationFeesOffline,
        } = req.body

        if (
            !primarySpecialization ||
            !medicalRegistrationNumber ||
            !issuingCouncil ||
            !licenseNumber ||
            !clinicAddress ||
            !consultationMode
        ) return res.status(400).json({ success: false, message: "Must enter mandatory field!" })

        if (consultationMode === "both" && (!consultationFeesOnline || !consultationFeesOffline)) {
            return res.status(400).json({
                success: false,
                message: "Both Online & offline consultation fee is required"
            })
        } else if (consultationMode === "offline" && !consultationFeesOffline) {
            return res.status(400).json({
                success: false,
                message: "Offline consultation fee is required"
            })
        } else if (consultationMode === "online" && !consultationFeesOnline) {
            return res.status(400).json({
                success: false,
                message: "Online consultation fee is required"
            })
        }

        const certificate = req.body.profile_url
        const userId = req.user._id

        if (!certificate)
            return res.status(400).json({ success: false, message: "Medical Council Registration / Licence Certificate is mandatory" })

        const doctor = await Doctor.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    primarySpecialization,
                    subSpecializations,
                    medicalRegistrationNumber,
                    issuingCouncil,
                    licenseNumber,
                    clinicAddress,
                    consultationMode,
                    consultationFees: {
                        online: consultationFeesOnline || null,
                        offline: consultationFeesOffline || null,
                    },
                    certificateUrl: certificate,
                    onboardingStep: "completed"
                },
            },
            { new: true }
        );

        if (!doctor)
            return res.status(400).json({
                success: false,
                message: "Docotor credentials are not authenticated"
            })

        return res.status(200).json({
            success: true,
            message: "Professional details updated successfully",
            doctor
        })

    } catch (error) {
        console.log("Error while doctor proffesional onboarding : ", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
