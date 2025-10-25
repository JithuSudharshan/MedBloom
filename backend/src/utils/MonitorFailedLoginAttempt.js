import { FailedLogin } from "../model/FailedLoginModel.js";

export async function logFailedLoginAttempt(userId, ipAddress) {
    try {
        await FailedLogin.create({
            userId,
            ipAddress,
            attemptedAt: new Date()
        });
    } catch (error) {
        console.error('Error logging failed login attempt:', error);
    }
}

// Optional: Function to check if user/IP is locked out
export async function checkLoginAttempts(userId, ipAddress) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const attemptCount = await FailedLogin.countDocuments({
        userId,
        ipAddress,
        attemptedAt: { $gte: oneHourAgo }
    });

    const MAX_ATTEMPTS = 5;
    return {
        isLocked: attemptCount >= MAX_ATTEMPTS,
        remainingAttempts: Math.max(0, MAX_ATTEMPTS - attemptCount)
    };
}

// Clear failed attempts after successful login
export async function clearFailedLoginAttempts(userId, ipAddress) {
    await FailedLogin.deleteMany({ userId, ipAddress });
}
