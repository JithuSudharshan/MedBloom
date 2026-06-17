import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import { ENV } from '../config/env.js';
import Admin from '../model/adminModel.js';

// Middleware that works with BOTH Passport session AND JWT
export const authenticateToken =
    ({ sendRequiresRefresh } = { sendRequiresRefresh: true }) =>
        async (req, res, next) => {
            try {
                //1: Check for JWT in cookies (your OAuth sets this)
                const accessToken = req.cookies.accessToken

                const refreshToken = req.cookies.refreshToken

                if (accessToken) {
                    try {
                        const decoded = jwt.verify(accessToken, ENV.JWT_ACCESS_SECRET);

                        if (decoded.userRole === 'admin') {
                            const admin = await Admin.findById(decoded.userId)
                            if (!admin) {
                                return res.status(401).json({
                                    success: false,
                                    message: 'admin not found',
                                    requiresRefresh: true
                                });
                            }

                            req.user = admin;
                            return next();
                        }

                        // Get user from database
                        const user = await User.findById(decoded.userId)

                        if (!user) {
                            return res.status(401).json({
                                success: false,
                                message: 'User not found',
                                requiresRefresh: true
                            })
                        }

                        req.user = user;
                        return next();
                    } catch (jwtError) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.error('JWT verification failed:', jwtError.name);
                        }
                        // Fall through to check Passport session
                        if (jwtError.name === 'TokenExpiredError' && sendRequiresRefresh) {
                            return res.status(401).json({
                                success: false,
                                message: 'Access token expired',
                                requiresRefresh: true
                            });
                        }
                    }
                }

                // Strategy 2: Check Passport session (fallback)
                if (req.isAuthenticated && req.isAuthenticated() && req.user) {
                    return next();
                }

                // Neither JWT nor session found
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                })

            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Authentication failed'
                })
            }
        }

// Optional: Role-based middleware
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next()
    }
}


