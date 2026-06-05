import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['patient', 'doctor', 'admin'],
            required: true,
            default: 'patient',
            index: true
        },
        name: {
            type: String,
            required: [true, 'Fullname is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        profile_url: {
            type: String,
            default: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" // Profile picture storage URL or path
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'] //E.164 formaat
        },
        passwordHash: {
            type: String,
            select: false
        },
        isAuthenticated: {
            type: Boolean,
            default: false
        },
        isOnboarded: {
            type: Boolean,
            default: false
        },
        authMethod: {
            type: String,
            enum: ['local', 'google', 'both'],
            default: 'local'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['active', 'suspended', 'banned'],
            default: 'active'
        },
        refreshTokens: [{
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            expiresAt: { type: Date, required: true },
            userAgent: String,
            ipAddress: String
        }],
        failedLoginAttempts: [{
            timestamp: Date,
            ipAddress: String
        }],
        lastLogin: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        timestamps: true
    }
);

// Instance method to check password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;
