import { ENV } from "../../../config/env.js";
import User from "../../../model/userModel.js";
import bcrypt from 'bcrypt'

export const ChangePatientPassword = async (req, res) => {
    try {
        const { confirmPassword, currentPassword, newPassword } = req.body

        const userId = req.user._id;

        if (!confirmPassword || !currentPassword || !newPassword)
            return res.status(400).json({ success: false, message: "All fileds are mandatory" })

        if (currentPassword === newPassword)
            return res.status(400).json({
                success: false, message: "New password must be different from current password"
            });

        if (newPassword !== confirmPassword)
            return res.status(400).json({ success: false, message: "Passwords do not match. Please try again." })

        const isExist = await User.findOne({ _id: userId }).select('+passwordHash')

        if (!isExist)
            return res.status(400).json({ succes: false, message: "Credentials doesn't match" })

        const isPasswordValid = await bcrypt.compare(currentPassword, isExist.passwordHash);

        if (!isPasswordValid)
            return res.status(400).json({ success: false, message: "Enter a valid Current password" })

        const hashedPassord = await bcrypt.hash(newPassword, ENV.SALTROUND)

        isExist.passwordHash = hashedPassord

        await isExist.save()

        res.status(200).json({ success: true, message: "Password change successful" })

    } catch (error) {
        console.log("error in change password", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}