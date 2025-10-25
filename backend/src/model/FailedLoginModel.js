import mongoose from "mongoose";

const failedLoginSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000)
    }
});

// Create index for automatic deletion of old records
failedLoginSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const FailedLogin = mongoose.model('FailedLogin', failedLoginSchema);
