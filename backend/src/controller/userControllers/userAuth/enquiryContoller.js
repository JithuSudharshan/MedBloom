import Enquiry from "../../../model/enquirySchema.js";


export const saveEnquiry = async (req, res) => {

    try {
        const { name, email, phone } = req.body

        if (!name || !email || !phone)
            return res.status(400).json({ success: false, message: "Please do fill all fields" })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ success: false, message: "Invalid email format" })

        const newEnquiry = new Enquiry({
            name,
            email,
            phone
        })

        const response = await newEnquiry.save()

        if (response)
            return res.status(200).json({ success: true, message: "Enquiry submit successful" })


    } catch (error) {
        console.log(error)
    }

}