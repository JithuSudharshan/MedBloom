// routes/patientRoutes.js
import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary.js";
import { onboardPatient } from "../controller/userControllers/patientDashBoard/patientOnboarding.js";
import { ChangePatientPassword, editProfile, fetchUserDetails, updateProfilePicture } from "../controller/userControllers/patientDashBoard/patientProfileControllers.js";

const router = express.Router();

router.post(
    "/onboarding",
    upload.single("profilePicture"),
    uploadToCloudinary,
    onboardPatient
);
router.post('/profile-picture/update',
    upload.single("image"),
    uploadToCloudinary,
    updateProfilePicture
);

router.get('/profile', fetchUserDetails)
router.post("/change-password", ChangePatientPassword)

router.patch("/edit-profile",
    upload.none(),
    editProfile
);

export default router;
