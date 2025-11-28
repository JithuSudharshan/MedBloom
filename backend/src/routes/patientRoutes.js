// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { onboardPatient } from "../controller/userControllers/patientDashBoard/patientOnboarding.js";
import { ChangePatientPassword } from "../controller/userControllers/patientDashBoard/patientProfileControllers.js";

const router = express.Router();

router.post(
    "/onboarding",
    upload.single("profilePicture"),
    uploadToCloudinary,
    onboardPatient
)

router.post("/change-password", ChangePatientPassword)

export default router;
