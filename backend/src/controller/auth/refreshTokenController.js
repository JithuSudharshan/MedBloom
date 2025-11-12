import User from "../../model/userModel.js"
import { generateAccessToken } from "../../utils/tokenService.js"
import { ENV } from "../../config/env.js"

export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from httpOnly cookie
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not found'
            })
        }

        // Verify refresh token
        try {
            const decoded = jwt.verify(refreshToken, ENV.JWT_REFERSH_TOKEN)
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            })
        }

        // Find user and check if token exists in database
        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }

        // Check if refresh token is in user's active tokens
        const tokenExists = user.refreshTokens?.some(
            rt => rt.token === refreshToken && new Date(rt.expiresAt) > new Date()
        )

        if (!tokenExists) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is invalid or expired'
            })
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user._id, user.email, user.role)

        // Send new access token
        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })

    } catch (error) {
        console.error('Token refresh error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token'
        })
    }
}

