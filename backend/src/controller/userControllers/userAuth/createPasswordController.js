import User from "../../../model/userModel.js"
import { ENV } from "../../../config/env.js"
import bcrypt from 'bcrypt'


export const createPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body

        if (!email)
            return res.status(400).json({
                success: false,
                message: "Email fields cannot be empty"
            })

        if (!password || !confirmPassword)
            return res.status(400).json({
                success: false,
                message: "Passwword field cannot be empty"
            })

        if (password !== confirmPassword)
            return res.status(400).json({
                success: false,
                message: "Passwords must match"
            })

        if (password.length > 64) {
            return res.status(400).json({
                success: false,
                message: "Password cannot exceed 64 characters"
            })
        }
        const user = await User.findOne({ email }).select('+passwordHash')

        if (!user)
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            })

        if (!user.isVerified)
            return res.status(400).json({
                success: false,
                message: "Email not verified"
            })

        const hashedPassword = await bcrypt.hash(password, Number(ENV.SALTROUND))

        user.passwordHash = hashedPassword
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login with your new password"
        });

    } catch (error) {
        console.log("Something went wrong", error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}