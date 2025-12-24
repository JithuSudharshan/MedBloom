import Admin from "../../../model/adminModel.js"
import { ENV } from "../../../config/env.js";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenService.js";

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

        const admin = await Admin.findOne({ email }).select('password').select('email').select('role')
        console.log(admin)

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

        const accessToken = await generateAccessToken(admin._id, admin.email, admin.role)

        const refreshToken = await generateRefreshToken(admin._id)
        //since no default value in schema
        admin.refreshTokens = admin.refreshTokens || [];
        admin.refreshTokens.push({
            token: refreshToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        });

        if (admin.refreshTokens.length > 0) {
            admin.refreshTokens = admin.refreshTokens.slice(-5)
        }

        admin.lastLogin = Date.now();

        const response = await admin.save();

        if (response) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: ENV.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
            })
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: ENV.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
        }

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            user: {
                id: admin._id,
                email: admin.email,
                role: "admin"
            }
        }
        )


    } catch (error) {
        console.log("Something went wrong while admin login", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}