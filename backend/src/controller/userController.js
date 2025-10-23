import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { deleteToken, generateAndStoreToken, searchAndFindToken } from "../utils/tokenService.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { safeCompare } from "../utils/compareToken.js";


export const signUp = async (req, res) => {

    try {
        //destructuring form data
        const { name, email, password, confirmPassword, role, phone } = req.body;

        //chechking whether the email id already exsist
        const exsistingUser = await User.findOne({ email })
        if (exsistingUser) return res.status(409).json({ success: false, message: "User with this Email already exsist!" })

        //checking whether password and confirmed  password are same
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password do not match" })
        }

        //Hashing the password before storing in DB
        const passwordHash = await bcrypt.hash(password, 10)

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
        const token = await generateAndStoreToken(response._id)

        //basic skeleton of the verification link send to user
        const verificationLink = `http://localhost:5000/api/user/verify-email/${response._id.toString()}/${token}`;

        //sending verification Email to user
        await sendVerificationEmail(email, verificationLink);

        res.status(201).json({ success: true, message: "Signup successful.! verify email to continue" })

    } catch (error) {

        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server error while signing Up" })
    }
}

export const verifyToken = async (req, res) => {

    try {
        const { id, token } = req.params

        //cheking whether the req actually has id and token
        if (!token || !id)
            return res.status(400).redirect("http://localhost:5173/verify/email/link?status=failed")

        //Retrieving previously stored token in redis
        const storedToken = await searchAndFindToken(id)

        if (!storedToken)
            return res.status(400).redirect("http://localhost:5173/verify/email/link?status=failed")

        //Comparing both the hashedtoken 
        const isMatch = await safeCompare(storedToken, token)
        if (!isMatch)
            return res.status(400).redirect("http://localhost:5173/verify/email/link?status=failed")

        //Updating the user verified status
        await User.updateOne({ _id: id }, { isVerified: true });

        //deleting the token in redis
        deleteToken(id)

        res.status(200).redirect("http://localhost:5173/verify/email/link?status=success")

    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" })
    }


}