import express from "express"
import { signUp } from "../controller/userController.js"


const router = express.Router()

//Routes
router.post('/signup', signUp);

export default router;
