import User from "../../model/userModel.js"
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenService.js"
import { checkLoginAttempts, clearFailedLoginAttempts, logFailedLoginAttempt } from "../../utils/MonitorFailedLoginAttempt.js"
import { ENV } from "../../config/env.js"

export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ success: false, message: "Email and password are required" })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ success: false, message: "Invalid email format" })

        const user = await User.findOne({ email }).select('+passwordHash')
        if (!user)
            return res.status(401).json({ success: false, message: "Invalid credentials" })

        if (!user.isVerified)
            return res.status(403).json({ success: false, message: "Verify Your email before Login" })

        if (user.status === "suspended" || user.status === "banned")
            return res.status(400).json({ success: false, message: "Your account has been suspended" })


        const isValidPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isValidPassword) {
            await logFailedLoginAttempt(user._id, req.ip)
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const recentFailedAttempts = await checkLoginAttempts(user._id, req.ip);
        if (recentFailedAttempts.isLocked) {
            return res.status(429).json({ success: false, message: "Too many failed Attempts, Try again in 15 Minutes!" })
        }

        const accessToken = await generateAccessToken(user._id, user.email, user.role)

        const refreshToken = await generateRefreshToken(user._id)

        //since no default value in schema
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push({
            token: refreshToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        });

        if (user.refreshTokens.length > 0) {
            user.refreshTokens = user.refreshTokens.slice(-5)
        }

        user.lastLogin = Date.now();

        const response = await user.save();

        if (response) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: ENV.NODE_ENV,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
            })
        }

        //clear all failed login after successfull login
        await clearFailedLoginAttempts(user._id, req.ip);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.log("Error while loggin in:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error while login"
        })
    }
}

