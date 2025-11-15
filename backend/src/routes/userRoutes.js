import express from "express"
import { signUp, loginUser, refreshToken, logout, sendEmailForForgotPassword, createPassword } from "../controller/userControllers/userAuth/index.js"
import { resendVerificationMail, verifyEmailForForgotPassword, verifyUser } from "../utils/EmailVerificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";




const router = express.Router()

//UserRoutes
router.post('/signup', signUp);
router.get('/verify-email/:id/:token', verifyUser)
router.post('/verify/resend-email', resendVerificationMail)
router.post('/login', loginUser)
router.get('/auth/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.post('/forgot-Password/send-verificationEmail', sendEmailForForgotPassword)
router.get('/verify-email-forgotPassword/:id/:token', verifyEmailForForgotPassword)
router.post('/create-new-password', createPassword)



export default router;
