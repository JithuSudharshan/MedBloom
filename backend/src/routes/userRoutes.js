import express from "express"
import { sendVerificationLink, signUp } from "../controller/userController.js"


const router = express.Router()

//Routes
router.post('/signup', signUp);
router.post('/verify/email/link', sendVerificationLink);

export default router;
