import api from "./axiosInstance";

export const patientOnboarding = async (formData) => {
    try {
        const response = await api.post("/patient/onboarding", formData)
        return response
    } catch (error) {
        console.log("Error in sending patient onboarding", error)
        throw error
    }
}


