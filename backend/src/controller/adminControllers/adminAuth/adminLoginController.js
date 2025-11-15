import Admin from "../../../model/adminModel.js"
import jwt from 'jsonwebtoken'
import { ENV } from "../../../config/env.js";
import bcrypt from "bcrypt"

export const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({
                success: false,
                message: "Email Id & Password feilds cannot be empty"
            })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ success: false, message: "Invalid email format" })

        const admin = await Admin.findOne({ email }).select('password')

        if (!admin)
            return res.status(400).json({
                success: false,
                message: "Invalid Admin Credentials"
            })

        const isPasswordValid = await bcrypt.compare(password, admin.password)

        if (!isPasswordValid)
            return res.status(400).json({
                success: false,
                message: "Invalid Admin credentials"
            })

        const token = jwt.sign(
            { email },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        })

    } catch (error) {
        console.log("Something went wrong while admin login", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}