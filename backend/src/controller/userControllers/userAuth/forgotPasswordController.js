import User from "../../../model/userModel.js";
import { sendVerificationEmail } from "../../../utils/sendEmail.js";
import { generateAndStoreToken } from "../../../utils/tokenService.js";

export const sendEmailForForgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email)
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })

        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid email Id"
            });

        const token = await generateAndStoreToken(user._id)

        const verificationLink = `http://localhost:5000/api/user/verify-email-forgotPassword/${user._id.toString()}/${token}`;

        await sendVerificationEmail(email, verificationLink);

        res.status(201).json({ success: true, message: "Check your email to continue" });


    } catch (error) {
        console.log("something went wrong while sending fPass email", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}