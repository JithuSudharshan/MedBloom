import Doctor from "../../../model/doctorModel.js";
import User from "../../../model/userModel.js";
import Notification from '../../../model/notificationSchema.js';
import { getIO } from '../../../config/socket.IO.js';
import Patient from "../../../model/patientModel.js";
import Department from "../../../model/departmentModel.js";


export const fetchPendingDoctorList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 5);
        const skip = (page - 1) * limit;

        const filter = { status: "pending" };

        const [doctors, total] = await Promise.all([
            Doctor.find(filter)
                .select(
                    "displayName primarySpecialization yearOfExperience contactNumber profilePicture status user"
                )
                .populate("user", "email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Doctor.countDocuments(filter),
        ]);

        const totalPages = Math.max(1, Math.ceil(total / limit));

        console.log("fetched doctors : ", doctors)

        return res.status(200).json({
            success: true,
            data: {
                doctors,
                page,
                totalPages,
                totalCount: total
            },
        });
    } catch (error) {
        console.error("Error fetching pending doctors:", error);
        return res
            .status(500)
            .json({ success: false, message: "internal server error" });
    }
}

export const approveDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findByIdAndUpdate(
            { _id: id },
            { status: "approved" },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const localUser = await User.findById({ _id: doctor.user })

        localUser.doctorId = doctor._id

        await localUser.save()

        const notification = await Notification.create({
            senderId: req.user._id,
            receiverId: localUser._id,
            message: 'Welcome to MedBloom! Your doctor profile has been approved and is now live. You can start managing appointments and patients from your dashboard.',
            type: 'admin_approval',
            link: '/doctor/notifications',
        });

        const io = getIO();
        io.to(localUser._id.toString()).emit('notification', notification);

        return res.status(200).json({
            success: true,
            message: "Doctor approved successfully",
            data: { doctor },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findByIdAndUpdate(
            { _id: id },
            { status: "rejected" },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor rejected successfully",
            data: { doctor },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchApprovedDoctorList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const skip = (page - 1) * limit;

        const filter = { status: { $in: ["approved", "blocked"] } };

        const [doctors, totalApproved, totalPending] = await Promise.all([
            Doctor.find(filter)
                .select(
                    "displayName primarySpecialization yearOfExperience contactNumber profilePicture status user"
                )
                .populate("user", "email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Doctor.countDocuments(filter),
            Doctor.countDocuments({ status: "pending" })
        ]);

        const totalPages = Math.max(1, Math.ceil(totalApproved / limit));

        return res.status(200).json({
            success: true,
            data: {
                doctors,
                page,
                totalPages,
                totalNoOfDoctors: totalApproved,
                totalPending
            },
        });
    } catch (error) {
        console.error("Error fetching approved doctors:", error);
        return res
            .status(500)
            .json({ success: false, message: "internal server error" });
    }
};

export const fetchApprovedDcotorsDetails = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id)
            return res.status(400).json({
                success: false,
                message: "User credentials misisng"
            })

        const doctor = await Doctor.findById({ _id: id })

        if (!doctor)
            return res.status(400).json({
                success: false,
                message: "User not found"
            })

        const user = await User.findById({ _id: doctor.user })

        if (!user)
            return res.status(400).json({
                success: false,
                message: "User cerdentials missing"
            })

        const details = {
            _id: doctor._id,
            fullName: user.name,
            profilePicture: doctor.profilePicture,
            displayName: doctor.displayName,
            primarySpecialization: doctor.primarySpecialization,
            yearsOfExperience: doctor.yearOfExperience,
            consultationMode: doctor.consultationMode,
            consultationFeesOnline: doctor.consultationFees.online,
            consultationFeesOffline: doctor.consultationFees.offline,
            phone: doctor.contactNumber,
            email: user.email,
            dob: doctor.dateOfBirth,
            gender: doctor.gender,
            shortBio: doctor.shortBio,
            address: doctor.clinicAddress,
            status: doctor.status
        };

        res.status(200).json({
            success: true,
            message: "Succesfully Fetched Dr details",
            details
        })
    } catch (error) {
        console.error("Error fetching doctor profile details:", error);
        return res
            .status(500)
            .json({ success: false, message: "internal server error" });
    }
};

export const fetchDoctorsDetailsToEdit = async (req, res) => {
    try {

        const { id } = req.params;

        console.log("id:=>", id)

        const doctor = await Doctor.findOne({ _id: id });

        console.log("Docotor =>", doctor)

        if (!doctor)
            return res.status(400).json({ success: false, message: "User not found" });

        const user = await User.findOne({ _id: doctor.user });
        console.log("User=>", user)
        if (!user)
            return res.status(400).json({ success: false, message: "User nt found" });

        const details = {
            avatar: {
                src: doctor.profilePicture,
                alr: "Doctor avatar"
            },
            shortBio: doctor.shortBio,
            fullName: req.user.name,
            email: req.user.email,
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
            authMethod: user.authMethod

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
}

export const editDoctorsProfile = async (req, res) => {
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

        const { id } = req.params;

        if (
            !id ||
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


        const doctor = await Doctor.findById({ _id: id });
        if (!doctor) {
            return res
                .status(404)
                .json({ success: false, message: "Doctor not found" });
        }

        const userDetails = await User.findOne({ _id: doctor.user });
        if (!userDetails) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
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
}

export const blockDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params
        console.log("id=>", id)

        if (!id)
            return res.status(400).json({
                success: false,
                message: "User credentials not found"
            })

        const doctor = await Doctor.findByIdAndUpdate(
            id.toString(),
            { status: "blocked" },
            { new: true }
        );

        if (!doctor)
            return res.status(400).json({
                success: false,
                message: "Doctor not found"
            })

        return res.status(200).json({
            success: true,
            message: "Doctor blocked successfully",
            data: { doctor }
        })

    } catch (error) {
        console.log("Error during blocking Doctor profile: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const unblockDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params

        if (!id)
            return res.status(400).json({
                success: false,
                message: "User credentials not found"
            })

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );

        if (!doctor)
            return res.status(400).json({
                success: false,
                message: "Doctor not found"
            })

        return res.status(200).json({
            success: true,
            message: "Doctor unblocked successfully",
            data: { doctor }
        })

    } catch (error) {
        console.log("Error during unblocking Doctor profile: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const changeDoctorAvatar = async (req, res) => {
    try {
        const { id } = req.params
        const profile_url = req.body.profile_url

        if (!id)
            return res.status(404).json({ success: false, message: "user not found" })

        if (!profile_url)
            return res.status(400).json({ success: false, message: "Profile_url not found" })

        const doctor = await Doctor.findOne({ _id: id })

        if (!doctor)
            return res.status(404).json({ success: false, message: "Doctor not found" })

        doctor.profilePicture = profile_url;

        await doctor.save()

        res.status(200).json({
            success: true,
            message: "Avatar updated",
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

export const changePatientAvatar = async (req, res) => {
    try {
        const { id } = req.params
        const profile_url = req.body.profile_url

        if (!id)
            return res.status(404).json({ success: false, message: "user not found" })

        if (!profile_url)
            return res.status(400).json({ success: false, message: "Profile_url not found" })

        const patient = await Patient.findOne({ _id: id })

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
}

export const sendDoctorDetailsForReview = async (req, res) => {
    try {
        const { doctorId } = req.params

        const doctor = await Doctor.findById({ _id: doctorId })
        if (!doctor)
            return res.status(400).json({ success: false, message: "User not found" })

        const user = await User.findOne({ _id: doctor.user })
        if (!user)
            return res.status(400).json({ success: false, message: "User not found" })

        res.status(200).json({
            success: true,
            message: "Sending doctor details for admin review",
            details: {
                profilePicture: doctor.profilePicture,
                displayName: doctor.displayName,
                gender: doctor.gender,
                contactNumber: doctor.contactNumber,
                dob: doctor.dateOfBirth,
                clinicLocation: doctor.location,
                bio: doctor.shortBio,
                ConsultationMode: doctor.consultationMode,
                certificate: doctor.certificateUrl,
                specialization: doctor.primarySpecialization,
                subSpecialization: doctor.subSpecializations,
                experience: doctor.yearOfExperience,
                registrationNumber: doctor.medicalRegistrationNumber,
                issuingCouncil: doctor.issuingCouncil,
                licenseNumber: doctor.licenseNumber,
                clinicAddress: doctor.clinicAddress,
                consultationMode: doctor.consultationMode,
                consultationFee: doctor.consultationFees,
            }
        });

    } catch (error) {
        console.log("Error while doctor details", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const addNewDepartment = async (req, res) => {
    try {

        const { departmentName, status, departmentDescription } = req.body

        if (!departmentName || !status || !departmentDescription)
            return res.status(400).json({ success: false, message: "All fields are mandatory" })

        const isExisting = await Department.findOne({ departmentName })

        if (isExisting)
            return res.status(400).json({ success: false, message: `${departmentName} department already exist` })

        const department = await Department.create({
            departmentName,
            status,
            departmentDescription
        })

        if (!department)
            return res.status(400).json({ success: false, message: "something went wrong while creating new department" })


        const formattedData = await Department.find({}).select('-__v');

        console.log("formattedData", formattedData)

        if (!formattedData)
            return res.status(400).json({ success: false, message: "Failed to fetch data" })

        res.status(200).json({
            success: true,
            message: "New department Added Successfully",
            latestData: formattedData
        })

    } catch (error) {
        console.log("Error while Adding new Department", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const fetchDataForDepartmentTable = async (req, res) => {

    const { page, } = req.params
    try {
        const departments = await Department.find();
        const formattedData = departments.map((dept) => ({
            id: dept._id,
            departmentName: dept.departmentName,
            departmentDescription: dept.departmentDescription,
            doctorCount: dept.doctors.length,
            status: dept.status
        }));

        if (!formattedData)
            return res.status(400).json({ success: false, message: "Failed to fetch data" })

        res.status(200).json({
            success: true,
            message: "succesfully fetched department data for displaying in the frontend",
            departments: formattedData
        })

    } catch (error) {
        console.error("Error while fetching departments:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
};

export const editDepartmentInfo = async (req, res) => {
    try {

        const {
            id,
            departmentDescription,
            departmentName,
            status
        } = req.body

        console.log("id : ", id)
        console.log("departmentDescription : ", departmentDescription)
        console.log("departmentName : ", departmentName)
        console.log("status : ", status)

        if (
            !id ||
            !departmentDescription ||
            !departmentName ||
            !status
        )
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })

        const department = await Department.findById(id)

        if (!department)
            return res.status(400).json({
                success: false,
                message: "No Record of department found"
            })

        department.departmentName = departmentName || department.departmentName
        department.departmentDescription = departmentDescription || department.departmentDescription
        department.status = status || department.status

        const updatedDepartment = await department.save()

        if (!updatedDepartment)
            return status(400).json({ success: false, message: "something went wrong while updating info" })

        const formattedData = await Department.find({}).select('-__v');

        console.log("formattedData", formattedData)

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: updatedDepartment,
            latestData: formattedData
        });

    } catch (error) {
        console.error("Error while editing department info:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};
