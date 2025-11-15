import express from 'express'
import { loginAdmin } from "../controller/adminControllers/adminAuth/adminLoginController.js";
import { logoutAdmin } from '../controller/adminControllers/adminAuth/adminLogoutController.js';

const router = express.Router()

//AdminRoutes
router.post("/login", loginAdmin)
router.post("/logout", logoutAdmin)


export default router

