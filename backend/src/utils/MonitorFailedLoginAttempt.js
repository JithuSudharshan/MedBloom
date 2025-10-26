import User from "../model/userModel.js";

export const logFailedLoginAttempt = async (userId, ipAddress) => {
    try {
        await User.findByIdAndUpdate(userId,
            {
                $push: {
                    failedLoginAttempts: {
                        ipAddress,
                        timestamp: Date.now()
                    }
                }
            })
    } catch (error) {
        console.error('Error logging failed login attempt:', error);
    }
}


export const checkLoginAttempts = async (email, ipAddress) => {
    try {
        const user = await User.findOne({ email });

        if (!user || !user.failedLoginAttempts || user.failedLoginAttempts.length === 0) {
            return {
                isLocked: false,
                remainingAttempts: 5,
                attemptsCount: 0
            };
        }
        // 1 hour ago
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Count recent failed attempts from the same IP within last 1 hour
        const recentAttempts = user.failedLoginAttempts.filter(attempt =>
            attempt.timestamp >= oneHourAgo &&
            attempt.ipAddress === ipAddress
        );

        const attemptCount = recentAttempts.length;
        const MAX_ATTEMPTS = 5;

        return {
            isLocked: attemptCount >= MAX_ATTEMPTS,
            remainingAttempts: Math.max(0, MAX_ATTEMPTS - attemptCount),
            attemptsCount: attemptCount
        };

    } catch (error) {
        console.error('Error checking login attempts:', error);
        return {
            isLocked: false,
            remainingAttempts: 5,
            attemptsCount: 0
        };
    }
}


// Clear failed attempts after successful login
export const clearFailedLoginAttempts = async (email, ipAddress) => {
    try {
        const user = await User.findOne({ email });

        if (!user) return

        // Remove attempts from specific IP address
        if (user.failedLoginAttempts && user.failedLoginAttempts.length > 0) {
            user.failedLoginAttempts = user.failedLoginAttempts.filter(
                attempt => attempt.ipAddress !== ipAddress
            );
            await user.save();
        }

    } catch (error) {
        console.error('Error clearing failed login attempts:', error);
    }
}

