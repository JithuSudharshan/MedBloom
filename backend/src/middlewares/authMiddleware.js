// middleware/auth.js
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const authenticate = async (req, res, next) => {
    try {

        const token = req.cookies.accessToken;

        let decoded;

        try {
            decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Access token expired',
                    requiresRefresh: true //Sending Signal frontend to refresh
                })
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid access token'
            })
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        }
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        })
    }
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - No user info'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${allowedRoles.join(', ')} can access this resource.`
            });
        }

        next();
    };
};
