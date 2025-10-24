import express from "express"
import { signUp, verifyToken, resendVerificationMail } from "../controller/userController.js"


const router = express.Router()

//Routes
router.post('/signup', signUp);
router.get('/verify-email/:id/:token', verifyToken)
router.post('/verify/resend-email', resendVerificationMail)

export default router;
