import Doctor from "../../../model/doctorModel.js"
import Department from "../../../model/departmentModel.js"
export const fetchDoctorData = async (req, res) => {
    try {

        const data = await Doctor.find({}).select('profilePicture displayName yearOfExperience primarySpecialization consultationMode');
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

export const fetchActiveDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ status: 'active' }).select('departmentName');

        if (!departments) {
            return res.status(400).json({ success: false, message: "Failed to fetch departments" });
        }

        res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: departments
        });

    } catch (error) {
        console.log("Error while fetching departments ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}