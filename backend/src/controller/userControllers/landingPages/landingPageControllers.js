import Doctor from "../../../model/doctorModel.js"

export const fetchDoctorData = async (req, res) => {
    try {

        const data = await Doctor.find({}).select('profilePicture displayName yearOfExperience primarySpecialization');
        console.log(data)

        if (!data)
            return res.status(400).json({ success: false, message: "something went wrong while fetching data" })

        res.status(200).json({
            success: true,
            message: "data fetched succesfully",
            data
        })

    } catch (error) {
        console.log("Error while fetcing data for landing page ", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}