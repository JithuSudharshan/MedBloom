// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { onboardPatient } from "../controller/userControllers/patientDashBoard/patientOnboarding.js";
import { editProfile, fetchPatientAppointments, fetchUserDetails, updateProfilePicture, getAppointmentDetailsForConsultation } from "../controller/userControllers/patientDashBoard/patientProfileControllers.js";
import { createPaymentOrder, verifyPaymentAndBook, cancelAppointment, rescheduleAppointment, bookAppointmentWithWallet } from "../controller/userControllers/patientControllers/bookingController.js";
import { authenticateToken, authorizeRole } from "../middlewares/authMiddleware.js";

import { uploadRecord, getRecords, updateRecord, deleteRecord } from "../controllers/medicalRecordController.js";

import { getTransactions, initiateTopUp, verifyTopUp } from "../controller/userControllers/walletController.js";
import { submitReview } from "../controller/userControllers/patientDashBoard/reviewController.js";
import { paymentLimiter } from "../middlewares/rateLimiter.js";
import { analyzeSymptoms } from "../controller/patientControllers/aiController.js";

const router = express.Router();

// AI Symptom Checker
router.post("/symptom-checker", authenticateToken(), authorizeRole("patient"), analyzeSymptoms);

router.post(
    "/onboarding",
    upload.single("profilePicture"),
    uploadToCloudinary,
    onboardPatient
);
router.post('/avatar/update',
    upload.single("image"),
    uploadToCloudinary,
    updateProfilePicture
);

router.get('/profile', fetchUserDetails);
router.get("/appointments", fetchPatientAppointments)

router.patch("/edit-profile",
    upload.none(),
    editProfile
);

// Booking Routes
router.post("/appointments/create-order", paymentLimiter, authenticateToken(), authorizeRole("patient"), createPaymentOrder);
router.post("/appointments/book-wallet", authenticateToken(), authorizeRole("patient"), bookAppointmentWithWallet);
router.post("/appointments/verify-payment", paymentLimiter, authenticateToken(), authorizeRole("patient"), verifyPaymentAndBook);
router.put("/appointments/:id/cancel", authenticateToken(), authorizeRole("patient"), cancelAppointment);
router.put("/appointments/:id/reschedule", authenticateToken(), authorizeRole("patient"), rescheduleAppointment);
router.get("/appointments/:id/consultation-details", authenticateToken(), authorizeRole("patient"), getAppointmentDetailsForConsultation);

// Medical Records Routes
router.post("/records", authenticateToken(), authorizeRole("patient"), upload.single("file"), uploadRecord);
router.get("/records", authenticateToken(), authorizeRole("patient"), getRecords);
router.put("/records/:id", authenticateToken(), authorizeRole("patient"), updateRecord);
router.delete("/records/:id", authenticateToken(), authorizeRole("patient"), deleteRecord);

// Wallet Routes
router.get("/wallet/transactions", authenticateToken(), authorizeRole("patient"), getTransactions);
router.post("/wallet/topup/initiate", paymentLimiter, authenticateToken(), authorizeRole("patient"), initiateTopUp);
router.post("/wallet/topup/verify", paymentLimiter, authenticateToken(), authorizeRole("patient"), verifyTopUp);

// Review Routes
router.post("/reviews", authenticateToken(), authorizeRole("patient"), submitReview);

export default router;
