import express from 'express'
import { logoutAdmin } from '../controller/adminControllers/adminAuth/adminLogoutController.js';
import upload from '../config/multer.js';
import {
    approveDoctor,
    rejectDoctor,
    fetchApprovedDcotorsDetails,
    fetchApprovedDoctorList,
    fetchDoctorsDetailsToEdit,
    fetchPendingDoctorList,
    editDoctorsProfile,
    blockDoctorProfile,
    unblockDoctorProfile
} from '../controller/adminControllers/adminDashboard/adminDashboardController.js';
import {
    editPatientsProfile,
    fetchPatientDetailsToEdit,
    fetchPatientPorfile,
    fetchTotlPatients
} from '../controller/adminControllers/adminDashboard/adminPatientControllers.js';

const router = express.Router()

//AdminRoutes
router.post("/logout", logoutAdmin)
router.get("/doctors/pending", fetchPendingDoctorList)
router.get("/doctors/approved", fetchApprovedDoctorList)
router.patch("/doctors/:id/approve", approveDoctor)
router.patch("/doctors/:id/reject", rejectDoctor)
router.get('/doctors/approved/:id/details', fetchApprovedDcotorsDetails);
router.get('/doctor/:id/to-edit', fetchDoctorsDetailsToEdit);
router.patch("/doctor/block/:id", blockDoctorProfile)
router.patch("/doctor/unblock/:id", unblockDoctorProfile)
router.get("/patients", fetchTotlPatients)
router.get("/patient/:id/profile", fetchPatientPorfile)
router.get("/patient/:id/edit", fetchPatientDetailsToEdit)
router.patch('/patient/:id/edit-profile', upload.none(), editPatientsProfile)

router.patch(
    "/doctors/:id/edit-profile",
    upload.none(),
    editDoctorsProfile
);

export default router;

