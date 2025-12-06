// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { doctorBasicOnboarding, doctorProffesionalOnboarding } from "../controller/userControllers/DoctorDashboard/docotorOnboarding.js";
const router = express.Router();

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


export default router;
