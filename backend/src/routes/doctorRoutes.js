// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { doctorBasicOnboarding, doctorProffesionalOnboarding } from "../controller/userControllers/DoctorDashboard/docotorOnboarding.js";
import { editDoctorProfile, fetchDoctorDetails, updateDoctorAvatar } from "../controller/userControllers/DoctorDashboard/doctorProfileControllers.js";

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

export default router;
