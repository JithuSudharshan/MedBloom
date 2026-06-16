// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { doctorBasicOnboarding, doctorProffesionalOnboarding } from "../controller/userControllers/DoctorDashboard/docotorOnboarding.js";
import { editDoctorProfile, fetchDoctorDetails, fetchMetricsForDoctor, updateDoctorAvatar, fetchDoctorAppointments, fetchDoctorPatients, savePrescription, completeConsultation, getPatientRecordsForConsultation, markWelcomeAsSeen } from "../controller/userControllers/DoctorDashboard/doctorProfileControllers.js";
import { getAvailability, updateAvailability } from "../controller/userControllers/DoctorDashboard/doctorAvailabilityController.js";
import { authenticateToken, authorizeRole } from "../middlewares/authMiddleware.js";
import { getTransactions, initiateTopUp, verifyTopUp } from "../controller/userControllers/walletController.js";

const router = express.Router();

router.get(
    '/profile',
    fetchDoctorDetails
)

router.post(
    "/onboarding/basic",
    upload.single("profilePicture"),
    uploadToCloudinary,
    doctorBasicOnboarding
);

router.post(
    "/onboarding/proffesional",
    upload.single('certificate'),
    uploadToCloudinary,
    doctorProffesionalOnboarding
);

router.post(
    "/avatar/update",
    upload.single("image"),
    uploadToCloudinary,
    updateDoctorAvatar
)

router.patch(
    "/edit-profile",
    upload.none(),
    editDoctorProfile
)
router.get("/Dashboard-Metrics", fetchMetricsForDoctor)
router.get("/appointments", fetchDoctorAppointments)
router.get("/patients", authenticateToken(), authorizeRole("doctor"), fetchDoctorPatients)
router.get("/availability", authenticateToken(), authorizeRole("doctor"), getAvailability)
router.put("/availability", authenticateToken(), authorizeRole("doctor"), updateAvailability)
router.put("/appointments/:id/prescription", savePrescription)
router.put("/appointments/:id/complete", completeConsultation)
router.get("/appointments/:id/patient-records", authenticateToken(), authorizeRole("doctor"), getPatientRecordsForConsultation)
router.patch("/welcome-seen", authenticateToken(), authorizeRole("doctor"), markWelcomeAsSeen);

// Wallet Routes
router.get("/wallet/transactions", authenticateToken(), authorizeRole("doctor"), getTransactions);
router.post("/wallet/topup/initiate", authenticateToken(), authorizeRole("doctor"), initiateTopUp);
router.post("/wallet/topup/verify", authenticateToken(), authorizeRole("doctor"), verifyTopUp);

export default router;
