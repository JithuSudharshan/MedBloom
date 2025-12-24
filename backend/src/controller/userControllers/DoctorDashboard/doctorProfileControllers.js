import Doctor from "../../../model/doctorModel.js";
import User from "../../../model/userModel.js";


export const fetchDoctorDetails = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User.findOne({ _id: userId });

        if (!user)
            return res.status(400).json({ success: false, message: "User nt found" });


        else if (user.authMethod === 'google' && !user.isOnboarded)
            return res.status(200).json({
                success: true,
                message: "Fetching docotor data successful",
                details: {
                    avatar: {
                        src: user.profile_url,
                        alr: "Doctor avatar"
                    },
                    fullName: user.name,
                    email: user.email,
                }
            })

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor)
            return res.status(400).json({ success: false, message: "User not found" });

        const details = {
            avatar: {
                src: doctor.profilePicture,
                alr: "Doctor avatar"
            },
            shortBio: doctor.shortBio,
            fullName: user.name,
            email: user.email,
            phone: doctor.contactNumber,
            dob: doctor.dateOfBirth,
            gender: doctor.gender,
            address: doctor.clinicAddress,
            displayName: doctor.displayName,
            primarySpecialization: doctor.primarySpecialization,
            yearsOfExperience: doctor.yearOfExperience,
            consultationMode: doctor.consultationMode,
            consultationFeesOnline: doctor.consultationFees.online,
            consultationFeesOffline: doctor.consultationFees.offline,
            authMethod: user.authMethod,
            isOnboarded: user.isOnboarded
        }

        res.status(200).json({
            success: true,
            message: "Fetching docotor data successful",
            details
        })

    } catch (error) {
        console.log("Error while fetching user data", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const updateDoctorAvatar = async (req, res) => {
    try {
        const { _id } = req.user
        const profile_url = req.body.profile_url

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        if (!profile_url)
            return res.status(400).json({ success: false, message: "Profile_url not found" })

        const user = _id;
        const doctor = await Doctor.findOne({ user })

        if (!doctor)
            return res.status(404).json({ success: false, message: "Doctor not found" })

        doctor.profilePicture = profile_url;

        await doctor.save()

        res.status(200).json({
            success: true,
            message: "Profile picture updated",
            profile_url: doctor.profilePicture
        })
    } catch (error) {
        console.log("Error while Updating Dr Avatar", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const editDoctorProfile = async (req, res) => {

    try {
        const {
            displayName,
            contactNumber,
            gender,
            location,
            shortBio,
            consultationMode,
            consultationFeesOnline,
            consultationFeesOffline
        } = req.body;

        const userId = req.user._id;

        if (
            !userId ||
            !contactNumber ||
            !gender ||
            !location ||
            !consultationMode ||
            !displayName
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Fill mandatory fields" });
        }

        if (consultationMode === "online" && !consultationFeesOnline)
            return res.status(400).json({ success: false, message: "Online consultation fee is required" })

        if (consultationMode === "offline" && !consultationFeesOffline)
            return res.status(400).json({ success: false, message: "Offline consultation fee is required" })

        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const doctor = await Doctor.findOne({ user: userDetails._id });
        if (!doctor) {
            return res
                .status(404)
                .json({ success: false, message: "Doctor not found" });
        }

        doctor.displayName = displayName || doctor.displayName
        doctor.contactNumber = contactNumber || doctor.contactNumber
        doctor.gender = gender || doctor.gender
        doctor.location = location || doctor.location
        doctor.shortBio = shortBio || doctor.shortBio
        doctor.consultationMode = consultationMode || doctor.consultationMode
        doctor.consultationFees.online = consultationFeesOnline || doctor.consultationFees.online
        doctor.consultationFees.offline = consultationFeesOffline || doctor.consultationFees.offline

        await doctor.save()

        return res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            doctor
        });
    } catch (error) {
        console.log("Error during Doctor edit: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

