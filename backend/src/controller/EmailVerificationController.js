import User from "../model/userModel.js";
import { deleteToken, generateAndStoreToken, searchAndFindToken, safeCompare } from "../utils/tokenService.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const verifyUser = async (req, res) => {

    try {
        const { id, token } = req.params
        const user = await User.findById({ _id: id });

        //cheking whether the req actually has id and token
        if (!token || !id)
            return res.status(400).redirect(`http://localhost:5173/verify/email/link?status=&email=${encodeURIComponent(user.email)}`)

        //Retrieving previously stored token in redis
        const storedToken = await searchAndFindToken(id)

        if (!storedToken)
            return res.status(400).redirect(`http://localhost:5173/verify/email/link?status=failed&email=${encodeURIComponent(user.email)}`)

        //Comparing both the hashedtoken 
        const isMatch = await safeCompare(storedToken, token)
        if (!isMatch)
            return res.status(400).redirect(`http://localhost:5173/verify/email/link?status=failed&email=${encodeURIComponent(user.email)}`)

        //Updating the user verified status
        await User.updateOne({ _id: id }, { isVerified: true });

        //deleting the token in redis
        await deleteToken(id)

        res.status(200).redirect(`http://localhost:5173/verify/email/link?status=success&email=${encodeURIComponent(user.email)}`)

    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" })
    }
}

export const resendVerificationMail = async (req, res) => {

    try {

        const { email } = req.body

        if (!email)
            return res.status(400).json({ success: false, message: "Email not found! " })

        const isExisting = await User.findOne({ email })

        if (!isExisting)
            return res.status(400).json({ success: false, message: "Email is Invalid!" })

        const id = isExisting._id.toString()

        //Delete existing token
        await deleteToken(id)

        //Generate and store token
        const token = await generateAndStoreToken(id)

        //Basic skeleton of the verification link send to user
        const verificationLink = `http://localhost:5000/api/user/verify-email/${id}/${token}`

        await sendVerificationEmail(email, verificationLink)
        return res.status(200).json({ success: true, message: "verification email send!" })

    } catch (error) {

        console.log("Error while resending email", error)
        res.status(500).json({ success: false, message: "Error while resending email" })
    }
}

export const verifyEmailForForgotPassword = async (req, res) => {
    try {
        const { id, token } = req.params
        const user = await User.findById({ _id: id });

        //cheking whether the req actually has id and token
        if (!token || !id)
            return res.status(400).redirect(`http://localhost:5173/verify/email/link?status=&email=${encodeURIComponent(user.email)}`)

        //Retrieving previously stored token in redis
        const storedToken = await searchAndFindToken(id)

        if (!storedToken)
            return res.status(400).redirect(`http://localhost:5173/verify/email/link?status=failed&email=${encodeURIComponent(user.email)}`)

        //Comparing both the hashedtoken 
        const isMatch = await safeCompare(storedToken, token)
        if (!isMatch)
            return res.status(400).redirect(`http://localhost:5173/verify/email/link?status=failed&email=${encodeURIComponent(user.email)}`)

        //deleting the token in redis
        await deleteToken(id)

        res.status(200).redirect(`http://localhost:5173/create-newPassword/link?status=success&email=${encodeURIComponent(user.email)}`)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }
}