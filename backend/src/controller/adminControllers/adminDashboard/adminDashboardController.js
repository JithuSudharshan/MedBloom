import Doctor from "../../../model/doctorModel.js";
import User from "../../../model/userModel.js";
import Notification from '../../../model/notificationSchema.js';
import { getIO } from '../../../config/socket.IO.js';
import Patient from "../../../model/patientModel.js";
import Department from "../../../model/departmentModel.js";
import Appointment from "../../../model/appointmentModel.js";
import Transaction from "../../../model/transactionModel.js";


export const fetchPendingDoctorList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
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
            { status: "approved", isAdminVerified: true },
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

        const localUser = await User.findById({ _id: doctor.user });
        if (localUser) {
            const notification = await Notification.create({
                senderId: req.user._id,
                receiverId: localUser._id,
                message: 'Your doctor profile application has been rejected. Please contact support for more details.',
                type: 'admin_rejection',
                link: '/doctor/notifications',
            });

            const io = getIO();
            io.to(localUser._id.toString()).emit('notification', notification);
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

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            
            // Search Doctor displayName or User email
            // To search user email, we first find matching Users
            const matchedUsers = await User.find({ email: searchRegex }).select('_id');
            const userIds = matchedUsers.map(u => u._id);

            filter.$or = [
                { displayName: searchRegex },
                { user: { $in: userIds } }
            ];
        }

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
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "10", 10);
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.search) {
            filter.departmentName = new RegExp(req.query.search, 'i');
        }

        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }

        const [departments, total, totalOverall, activeCount, inactiveCount] = await Promise.all([
            Department.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Department.countDocuments(filter),
            Department.countDocuments({}),
            Department.countDocuments({ status: 'active' }),
            Department.countDocuments({ status: 'inactive' })
        ]);

        const totalPages = Math.max(1, Math.ceil(total / limit));

        const formattedData = departments.map((dept) => ({
            id: dept._id,
            departmentName: dept.departmentName,
            departmentDescription: dept.departmentDescription,
            doctorCount: dept.doctors ? dept.doctors.length : 0,
            status: dept.status
        }));

        res.status(200).json({
            success: true,
            message: "succesfully fetched department data for displaying in the frontend",
            data: {
                departments: formattedData,
                page,
                totalPages,
                totalCount: total,
                metrics: {
                    total: totalOverall,
                    active: activeCount,
                    inactive: inactiveCount
                }
            }
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

        // --- SAFETY CHECK FOR DEPARTMENT INTEGRITY ---
        const isRenaming = departmentName && departmentName !== department.departmentName;
        const isDeactivating = status === 'inactive' && department.status !== 'inactive';

        if (isRenaming || isDeactivating) {
            const activeDoctorsCount = await Doctor.countDocuments({ 
                primarySpecialization: department.departmentName 
            });

            if (activeDoctorsCount > 0) {
                const action = isRenaming ? "rename" : "deactivate";
                return res.status(400).json({
                    success: false,
                    message: `Cannot ${action} department. There are ${activeDoctorsCount} active doctors assigned to this specialization.`
                });
            }
        }
        // ----------------------------------------------

        department.departmentName = departmentName || department.departmentName
        department.departmentDescription = departmentDescription || department.departmentDescription
        department.status = status || department.status

        const updatedDepartment = await department.save()

        if (!updatedDepartment)
            return res.status(400).json({ success: false, message: "something went wrong while updating info" })

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

export const fetchAppointments = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "10", 10);
        const skip = (page - 1) * limit;

        const matchCondition = {};
        
        // Tab / Status filter
        if (req.query.status && req.query.status !== "All") {
            matchCondition.status = req.query.status;
        }

        // Search text
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');

            // 1. Find matching Doctors by displayName
            const matchedDoctors = await Doctor.find({ displayName: searchRegex }).select('_id');
            const doctorIds = matchedDoctors.map(d => d._id);

            // 2. Find matching Users by name for Patients
            const matchedUsers = await User.find({ name: searchRegex }).select('_id');
            const matchedPatients = await Patient.find({ user: { $in: matchedUsers.map(u => u._id) } }).select('_id');
            const patientIds = matchedPatients.map(p => p._id);

            matchCondition.$or = [
                { appointmentId: searchRegex },
                { doctor: { $in: doctorIds } },
                { patient: { $in: patientIds } }
            ];
        }

        const [appointmentsData, total] = await Promise.all([
            Appointment.find(matchCondition)
                .populate("doctor", "displayName primarySpecialization user")
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select: "name email"
                    }
                })
                .sort({ date: -1, startTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Appointment.countDocuments(matchCondition)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / limit));

        const formattedAppointments = appointmentsData.map(app => {
            const patientName = app.patient?.user?.name || "Unknown Patient";
            const doctorName = app.doctor?.displayName || "Unknown Doctor";
            const speciality = app.doctor?.primarySpecialization || "N/A";
            
            // Format date e.g. "2023-11-10 at 10:00 AM"
            let dateTimeLabel = "N/A";
            if (app.date && app.startTime) {
                const dateObj = new Date(app.date);
                if (!isNaN(dateObj.getTime())) {
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    // Convert startTime (e.g., "14:30") to 12-hour AM/PM
                    let timeStr = app.startTime;
                    if (app.startTime.includes(":")) {
                        const [hours, minutes] = app.startTime.split(":");
                        const h = parseInt(hours, 10);
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        const h12 = h % 12 || 12;
                        timeStr = `${h12}:${minutes} ${ampm}`;
                    }
                    dateTimeLabel = `${formattedDate} at ${timeStr}`;
                }
            }

            return {
                id: app._id,
                appointmentId: app.appointmentId,
                patientName,
                doctorName,
                speciality,
                dateTimeLabel,
                status: app.status
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                appointments: formattedAppointments,
                page,
                totalPages,
                totalCount: total
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

export const fetchMetrics = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        // 1. Basic Counts
        const [totalPatients, activeDoctors] = await Promise.all([
            Patient.countDocuments(),
            Doctor.countDocuments({ status: "approved" })
        ]);

        // 2. Appointment Metrics
        // Today's appointments (matching date string YYYY-MM-DD or created today depending on schema)
        // Since schema uses string date "YYYY-MM-DD"
        const todayStr = today.toISOString().split('T')[0];
        
        const todaysAppointments = await Appointment.countDocuments({ date: todayStr });
        const monthlyAppointments = await Appointment.countDocuments({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const metrics = [
            { label: "Total Patients", value: totalPatients },
            { label: "Active Doctors", value: activeDoctors },
            { label: "Today's Appointments", value: todaysAppointments },
            { label: "Monthly Appointments", value: monthlyAppointments },
        ];

        // 3. Monthly Earnings
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

        const [earningsAgg, lastMonthEarningsAgg] = await Promise.all([
            Transaction.aggregate([
                { $match: { status: "Success", createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Transaction.aggregate([
                { $match: { status: "Success", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        const monthlyEarnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;
        const lastMonthlyEarnings = lastMonthEarningsAgg.length > 0 ? lastMonthEarningsAgg[0].total : 0;
        
        let revenueGrowth = 0;
        if (lastMonthlyEarnings === 0) {
            revenueGrowth = monthlyEarnings > 0 ? 100 : 0;
        } else {
            revenueGrowth = Math.round(((monthlyEarnings - lastMonthlyEarnings) / lastMonthlyEarnings) * 100);
        }

        // 4. Top Rated Doctors
        const topDoctorsData = await Doctor.find({ status: "approved" })
            .sort({ rating: -1, totalReviews: -1 })
            .limit(5)
            .select('displayName profilePicture rating primarySpecialization');
        
        const TopRatedDoctors = topDoctorsData.map((doc, index) => ({
            id: index + 1,
            name: doc.displayName,
            avatar: doc.profilePicture || "https://i.pravatar.cc/40",
            rating: doc.rating || 0,
            speciality: doc.primarySpecialization || "General Physician"
        }));

        // 5. Graph Data (Top Consulted Specialities)
        const specialityAgg = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctor",
                    foreignField: "_id",
                    as: "doctorDetails"
                }
            },
            { $unwind: "$doctorDetails" },
            {
                $group: {
                    _id: "$doctorDetails.primarySpecialization",
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 4 }
        ]);

        const graphData = specialityAgg.map(item => ({
            name: item._id || "Unknown",
            value: item.value
        }));

        // Fallback graph data if no appointments
        if (graphData.length === 0) {
            const activeDepartments = await Department.find({ status: 'active' }).limit(4).select('departmentName');
            if (activeDepartments.length > 0) {
                graphData = activeDepartments.map(dept => ({
                    name: dept.departmentName,
                    value: 0
                }));
            } else {
                graphData.push(
                    { name: "General", value: 0 }
                );
            }
        }

        return res.status(200).json({
            success: true,
            metrics,
            monthlyEarnings,
            revenueGrowth,
            TopRatedDoctors,
            graphData
        });

    } catch (error) {
        console.error("Error while fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
