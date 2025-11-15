import User from "../../../model/userModel.js";
import bcrypt from "bcrypt"
import { generateAndStoreToken } from "../../../utils/tokenService.js";
import { sendVerificationEmail } from "../../../utils/sendEmail.js"
import { ENV } from "../../../config/env.js"

export const signUp = async (req, res) => {

    try {

        //destructuring form data
        const { name, email, password, confirmPassword, role, phone } = req.body;

        //chechking whether the email id already exsist
        const exsistingUser = await User.findOne({ email })
        if (exsistingUser)
            return res.status(409).json({ success: false, message: "User with this Email already exsist!" })

        //checking whether password and confirmed  password are same
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password do not match" })
        }

        //Hashing the password before storing in DB
        const passwordHash = await bcrypt.hash(password, ENV.SALTROUND)

        //creating new USER 
        const newUser = new User({
            role,
            name,
            email,
            phone,
            passwordHash,
            isVerified: false
        });
        const response = await newUser.save();

        //generating token with crypto
        const token = await generateAndStoreToken(response._id);

        //basic skeleton of the verification link send to user
        const verificationLink = `http://localhost:5000/api/user/verify-email/${response._id.toString()}/${token}`;

        //sending verification Email to user
        await sendVerificationEmail(email, verificationLink);
        res.status(201).json({ success: true, message: "Signup successful.! verify email to continue" });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server error while signing Up"
        });
    }
}

