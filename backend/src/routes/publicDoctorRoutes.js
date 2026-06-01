import express from "express";
import { getAvailableSlots, getDoctorProfile } from "../controller/publicControllers/doctorPublicController.js";

const router = express.Router();
router.get("/:id", getDoctorProfile);
router.get("/:id/available-slots", getAvailableSlots);

export default router;
