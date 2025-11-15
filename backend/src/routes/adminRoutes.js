import express from 'express'
import { loginAdmin } from "../controller/adminControllers/adminAuth/adminLoginController.js";

const router = express.Router()

//AdminRoutes
router.post("/login", loginAdmin)


export default router

