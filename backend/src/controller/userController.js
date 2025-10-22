import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


export const signUp = async (req, res) => {

    try {
        const { name, email, password, confirmPassword, role, phone } = req.body;

        //chechking whether the email id already exsist
        const exsistingUser = await User.findOne({ email })
        if (exsistingUser) return res.status(409).json({ success: false, message: "User with this Email already exsist!" })

        //checking whether password and confirmed  password are same
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password do not match" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            role,
            name,
            email,
            phone,
            passwordHash,
            isVerified: false
        });

        const response = await newUser.save();
        console.log(response)
        res.status(201).json({ success: true, message: "Signup successful! verify email to continue" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server error while signing Up" })
    }
}

export const sendVerificationLink = async (req, res) => {


}