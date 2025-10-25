import express from "express"
import { signUp, loginUser } from "../controller/userController.js"
import { verifyToken, resendVerificationMail } from "../controller/EmailVerificationController.js";



const router = express.Router()

//UserRoutes
router.post('/signup', signUp);
router.get('/verify-email/:id/:token', verifyToken)
router.post('/verify/resend-email', resendVerificationMail)
router.post('/login', loginUser);

export default router;
