import User from "../../../model/userModel.js"
import { ENV } from "../../../config/env.js"

export const logout = async (req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        const userId = req?.user?._id; // Use _id from MongoDB user object

        // Remove refresh token from database (for JWT local auth)
        if (refreshToken && userId) {
            await User.findByIdAndUpdate(userId, {
                $pull: { refreshTokens: { token: refreshToken } }
            });
        }

        // Passport logout (for both OAuth and local session-based auth)
        req.logout((err) => {
            if (err) {
                console.error('Passport logout error:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Logout failed'
                });
            }

            // Destroy session completely
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                }

                // Clear all auth-related cookies
                res.clearCookie('connect.sid', {
                    path: '/',
                    httpOnly: true,
                    secure: ENV.NODE_ENV === 'production',
                    sameSite: 'lax'
                });

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
            });
        });

    } catch (error) {
        console.error('Logout error:', error);

        // Fallback: clear cookies even if error occurs
        res.clearCookie('connect.sid');
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};
