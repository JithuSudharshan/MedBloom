import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        }, role: {
            type: String,
            required: true,
            default: 'admin',
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // Don't return password by default in queries
        },
        refreshTokens: [{
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            expiresAt: { type: Date, required: true },
            userAgent: String,
            ipAddress: String
        }]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Admin", adminSchema);
