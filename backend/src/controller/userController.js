import User from "../model/userModel.js";
import bcrypt from "bcrypt"


export const signUp = async (req, res) => {

    try {
        const { name, email, newPassword, confirmPassword, role, phone } = req.body;

        //chechking whther the email id already exsist
        const exsistingUser = await User.findOne({ email })
        if (exsistingUser) return res.status(401).json({ message: "User with this Email already exsist!" })

        //checking whether password and confirmed  password are same
        if (newPassword !== confirmPassword) {
            res.status(400), json({ message: "Password do not match" })
        }

        const password = newPassword;

        const newUser = new User({
            role,
            name,
            email,
            phone,
            passwordHash: password,
        });

        await newUser.save();
        res.status(201).json({ message: "New user registered succesfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server error whie signing Up" })
    }

}