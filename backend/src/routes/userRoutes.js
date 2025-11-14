import express from "express"
import { signUp, loginUser, refreshToken, logout, sendEmailForForgotPassword } from "../controller/auth/index.js"
import { resendVerificationMail, verifyEmailForForgotPassword, verifyUser } from "../controller/EmailVerificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";



const router = express.Router()

//UserRoutes
router.post('/signup', signUp);
router.get('/verify-email/:id/:token', verifyUser)
router.post('/verify/resend-email', resendVerificationMail)
router.post('/login', loginUser)
router.get('/auth/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.post('/forgotPassword/send-verificationEmail', sendEmailForForgotPassword)
router.get('/verify-email-forgotPassword/:id/:token', verifyEmailForForgotPassword)

export default router;
