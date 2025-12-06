import api from "./axiosInstance";

export const loadDoctorData = async () => {
    try {
        const response = await api.get("/doctor/profile")
        return response
    } catch (error) {
        console.log("Error while fetching doctor details", error)
        throw error
    }
}

export const doctorbasicOnboarding = async (formData) => {
    try {
        const response = await api.post('/doctor/onboarding/basic', formData)
        return response
    } catch (error) {
        console.log("Error while Dr basic onboarding", error)
        throw error
    }
}

export const doctorProfessionalOnboarding = async (formData) => {
    try {
        const response = await api.post('doctor/onboarding/proffesional', formData)
        return response
    } catch (error) {
        console.log("Error while Dr proffesional onboarding", error)
        throw error
    }
}

