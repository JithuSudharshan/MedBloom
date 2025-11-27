import express from "express"
import { signUp, loginUser, refreshToken, logout, sendEmailForForgotPassword, createPassword } from "../controller/userControllers/userAuth/index.js"
import { resendVerificationMail, verifyEmailForForgotPassword, verifyUser } from "../utils/EmailVerificationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { verifyToken } from "../controller/userControllers/Oauth/OauthController.js";
import { saveEnquiry } from "../controller/userControllers/userAuth/enquiryContoller.js";

const router = express.Router()

//UserRoutes
router.post('/signup', signUp)
router.post('/logout', logout)
router.post('/login', loginUser)
router.post('/enquiry', saveEnquiry)
router.post('/create-new-password', createPassword)
router.post('/verify/resend-email', resendVerificationMail)
router.post('/forgot-Password/send-verificationEmail', sendEmailForForgotPassword)
router.get('/auth/refresh-Token', refreshToken)
router.get('/verify-email/:id/:token', verifyUser)
router.get('/context-auth-verify', authenticateToken, verifyToken)
router.get('/verify-email-forgotPassword/:id/:token', verifyEmailForForgotPassword)

export default router;
