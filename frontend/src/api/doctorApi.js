import api from "./axiosInstance";

export const loadDoctorData = async () => {
    try {
        const response = await api.get("/docotor/profile")
        return response
    } catch (error) {
        console.log("Error while fetching doctor details", error)
        throw error
    }
}

