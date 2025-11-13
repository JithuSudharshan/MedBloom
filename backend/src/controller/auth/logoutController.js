import User from "../../model/userModel.js"
import { ENV } from "../../config/env.js"

export const logout = async (req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken
        const userId = req?.user?.userId

        if (refreshToken && userId) {

            // Remove this specific refresh token from database
            await User.findByIdAndUpdate(userId, {
                $pull: { refreshTokens: { token: refreshToken } }
            })
        }

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })

    } catch (error) {
        console.error('Logout error:', error);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        })
    }
};