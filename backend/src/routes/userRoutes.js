import express from "express"
import { signUp, verifyToken } from "../controller/userController.js"


const router = express.Router()

//Routes
router.post('/signup', signUp);
router.get('/verify-email/:id/:token', verifyToken)

export default router;
