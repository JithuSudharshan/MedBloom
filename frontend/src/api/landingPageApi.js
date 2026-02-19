import api from "./axiosInstance";

export const fetchDoctorsData = async () => {
    try {
        const response = api.get("/user/doctorsData")
        return response
    } catch (error) {
        console.log("Error while fetching Dr data for Find doctor page", error)
        throw error
    }
}