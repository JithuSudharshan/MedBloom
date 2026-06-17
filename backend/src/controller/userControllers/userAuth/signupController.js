import User from "../../../model/userModel.js";
import bcrypt from "bcrypt"
import { generateAndStoreToken } from "../../../utils/tokenService.js";
import { sendVerificationEmail } from "../../../utils/sendEmail.js"
import { ENV } from "../../../config/env.js"
import { sendNotification } from "../../../utils/notificationHelper.js";

export const signUp = async (req, res) => {

    try {

        //destructuring form data
        const { name, email, password, confirmPassword, role, phone } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword || !role)
            return res.status(200).json({ success: false, message: "Fill all the fields" })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ success: false, message: "Invalid email format" })

        //chechking whether the email id already exsist
        const exsistingUser = await User.findOne({ email })
        if (exsistingUser)
            return res.status(409).json({ success: false, message: "User with this Email already exsist!" })

        //checking whether password and confirmed  password are same
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password do not match" })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and include uppercase, lowercase, and a number"
            });
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
            isVerified: false,
            authMethod: 'local'
        })
        const response = await newUser.save()

        if (role === 'doctor') {
            await sendNotification({
                receiverId: response._id,
                message: `Welcome to MedBloom, ${name}! Complete your professional profile to start receiving patients.`,
                type: 'system_alert',
                link: '/doctor/basic-onboarding'
            });
        } else if (role === 'patient') {
            await sendNotification({
                receiverId: response._id,
                message: `Welcome to MedBloom, ${name}! Complete your health profile to unlock appointment booking.`,
                type: 'system_alert',
                link: '/patient/onboarding'
            });
        }

        //generating token with crypto
        const token = await generateAndStoreToken(response._id)

        //basic skeleton of the verification link send to user
        const verificationLink = `${ENV.BACKEND_URL}/api/user/verify-email/${response._id.toString()}/${token}`

        //sending verification Email to user
        await sendVerificationEmail(email, verificationLink);
        res.status(201).json({ success: true, message: "Signup successful.! verify email to continue" })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server error while signing Up"
        })
    }
}

