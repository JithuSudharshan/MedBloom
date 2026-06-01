import Doctor from "../../../model/doctorModel.js";
import User from "../../../model/userModel.js";
import Appointment from "../../../model/appointmentModel.js";
import { formatDOB } from "../../../utils/formatters.js";


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
                src: doctor.profilePicture || user.profile_url,
                alr: "Doctor avatar"
            },
            shortBio: doctor.shortBio,
            fullName: user.name,
            email: user.email,
            phone: doctor.contactNumber,
            dob: formatDOB(doctor.dateOfBirth),
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

export const fetchMetricsForDoctor = async (req, res) => {
    try {

        const metrics = [
            { label: "Total Appointments", value: 125 },
            { label: "Total Consultations", value: 79 }
        ]

        const TotalEarnigs = 45000

        const TodaysAppointments = [
            { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
            { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
        ];

        const reviews = [
            {
                name: "Akshay suresh",
                avatar: "https://i.pravatar.cc/40",
                comment: "Awesome experience.."
            },
            {
                name: "Akshay suresh",
                avatar: "https://i.pravatar.cc/41",
                comment: "Awesome experience.."
            },
            {
                name: "Akshay suresh",
                avatar: "https://i.pravatar.cc/42",
                comment: "Awesome experience.."
            },
            {
                name: "Akshay suresh",
                avatar: "https://i.pravatar.cc/43",
                comment: "Awesome experience.."
            }
        ];

        return res.status(200).json({
            success: true,
            metrics,
            TotalEarnigs,
            TodaysAppointments,
            reviews
        });

    } catch (error) {
        console.error("Error while fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const fetchDoctorAppointments = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const skip = (page - 1) * limit;

        const { _id } = req.user

        if (!_id)
            return res.status(404).json({ success: false, message: "user not found" })

        const user = _id;
        const doctor = await Doctor.findOne({ user })

        if (!doctor)
            return res.status(404).json({ success: false, message: "Doctor not found" })

        const filter = {
            doctor: doctor._id,
            status: { $ne: 'pending_payment' }
        };

        const totalCount = await Appointment.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        const appointments = await Appointment.find(filter)
            .sort({ date: -1, startTime: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'patient',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            });

        const mappedAppointments = appointments.map((app) => {
            let mappedStatus = "Upcoming";
            if (app.status === "completed") mappedStatus = "Completed";
            if (app.status === "cancelled") mappedStatus = "Cancelled";

            let formattedDate = app.date;
            try {
                const dateObj = new Date(app.date);
                formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } catch(e) {}

            let formattedTime = app.startTime;
            try {
                const timeObj = new Date(app.startTime);
                if (!isNaN(timeObj.getTime())) {
                    formattedTime = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                }
            } catch(e) {}

            return {
                id: app._id,
                primaryTitle: app.patient?.user?.name || "Unknown Patient",
                secondaryText: "Patient", // or some other patient info if needed
                dateTimeLabel: `${formattedDate} at ${formattedTime}`,
                rawDate: app.date,
                rawStartTime: app.startTime,
                rawEndTime: app.endTime,
                status: mappedStatus,
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

export const savePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { prescription, notes } = req.body;
        
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        appointment.prescription = prescription;
        if (notes !== undefined) {
            appointment.notes = notes;
        }

        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Prescription saved successfully",
            data: appointment
        });
    } catch (error) {
        console.error("Error while saving prescription:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
