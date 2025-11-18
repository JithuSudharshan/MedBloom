import { ENV } from "../../../config/env.js";


export const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            path: '/',
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.clearCookie('accessToken', {
            path: '/',
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.log("Something went wrong while admin logout", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}