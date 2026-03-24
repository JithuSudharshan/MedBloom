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
    unblockDoctorProfile,
    changeDoctorAvatar,
    changePatientAvatar,
    sendDoctorDetailsForReview,
    addNewDepartment,
    fetchDataForDepartmentTable,
    editDepartmentInfo,
    fetchAppointments,
    fetchMetrics
} from '../controller/adminControllers/adminDashboard/adminDashboardController.js';
import {
    editPatientsProfile,
    fetchPatientDetailsToEdit,
    fetchPatientPorfile,
    fetchTotalPatients
} from '../controller/adminControllers/adminDashboard/adminPatientControllers.js';
import { uploadToCloudinary } from '../middlewares/uploadToCloudinary.js';

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
router.get("/patients", fetchTotalPatients)
router.get("/patient/:id/profile", fetchPatientPorfile)
router.get("/patient/:id/edit", fetchPatientDetailsToEdit)
router.patch('/patient/:id/edit-profile', upload.none(), editPatientsProfile)
router.get("/doctor/review/details/:doctorId", sendDoctorDetailsForReview)
router.post("/departemnts/add-new", addNewDepartment)
router.get("/department/table-info", fetchDataForDepartmentTable)
router.post("/department/edit-info", editDepartmentInfo)
router.get("/appointments", fetchAppointments)
router.get("/Dashboard-Metrics", fetchMetrics);

router.patch(
    "/doctors/:id/edit-profile",
    upload.none(),
    editDoctorsProfile
);

router.patch(
    "/doctor/change-avatar/:id",
    upload.single("image"),
    uploadToCloudinary,
    changeDoctorAvatar
)

router.patch(
    "/patient/change-avatar/:id",
    upload.single("image"),
    uploadToCloudinary,
    changePatientAvatar
)

export default router;

