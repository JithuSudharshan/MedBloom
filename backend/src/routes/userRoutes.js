import express from "express"
import { signUp, loginUser, refreshToken, logout } from "../controller/auth/index.js"
import { verifyToken, resendVerificationMail } from "../controller/EmailVerificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";



const router = express.Router()

//UserRoutes
router.post('/signup', signUp);
router.get('/verify-email/:id/:token', verifyToken)
router.post('/verify/resend-email', resendVerificationMail)
router.post('/login', loginUser)
router.get('/auth/refresh', refreshToken)
router.post('/logout', authenticate, logout)

export default router;
