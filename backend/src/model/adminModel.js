import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ENV } from "../config/env.js";

const adminSchema = new mongoose.Schema(
    {

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // Don't return password by default in queries
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Admin", adminSchema);
