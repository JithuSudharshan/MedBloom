import express from "express";
import { getAvailableSlots, getDoctorProfile } from "../controller/publicControllers/doctorPublicController.js";
import { getDoctorReviews } from "../controller/userControllers/patientDashBoard/reviewController.js";

import { aiTriageLimiter } from "../middlewares/rateLimiter.js";
import { analyzeSymptoms } from "../controller/patientControllers/aiController.js";

const router = express.Router();

router.post("/symptom-checker", aiTriageLimiter, analyzeSymptoms);

router.get("/:id", getDoctorProfile);
router.get("/:id/available-slots", getAvailableSlots);
router.get("/:id/reviews", getDoctorReviews);

export default router;
