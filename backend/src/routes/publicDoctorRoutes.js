import express from "express";
import { getAvailableSlots, getDoctorProfile } from "../controller/publicControllers/doctorPublicController.js";
import { getDoctorReviews } from "../controller/userControllers/patientDashBoard/reviewController.js";

const router = express.Router();
router.get("/:id", getDoctorProfile);
router.get("/:id/available-slots", getAvailableSlots);
router.get("/:id/reviews", getDoctorReviews);

export default router;
