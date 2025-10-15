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
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'] //E.164 formaat
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required']
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

// hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
