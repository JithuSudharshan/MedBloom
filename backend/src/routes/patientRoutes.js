// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { onboardPatient } from "../controller/userControllers/patientDashBoard/patientOnboarding.js";

const router = express.Router();

// multer → cloudinary → controller
router.post(
    "/onboarding",
    upload.single("profilePicture"),
    (req, res, next) => {
        console.log("Multer req.file:", req.file);
        next();
    },
    uploadToCloudinary,
    onboardPatient
)

export default router;
