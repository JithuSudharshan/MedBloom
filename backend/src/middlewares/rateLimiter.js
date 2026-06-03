import rateLimit from 'express-rate-limit';

// Strict limiter for authentication routes (login, signup, forgot password)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    message: {
        success: false,
        message: "Too many authentication attempts from this IP, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for payment initiation to prevent spam
export const paymentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
    message: {
        success: false,
        message: "Too many payment requests from this IP, please try again in a minute"
    },
    standardHeaders: true,
    legacyHeaders: false,
});
