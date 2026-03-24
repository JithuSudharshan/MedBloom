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
        const response = await api.post('/doctor/onboarding/proffesional', formData)
        return response
    } catch (error) {
        console.log("Error while Dr proffesional onboarding", error)
        throw error
    }
}

export const updateDoctorAvatar = async (formData) => {
    try {
        const response = await api.post("/doctor/avatar/update", formData)
        return response
    } catch (error) {
        console.log("Error while updating Dr Avatar", error)
        throw error
    }
}

export const doctorChangePassword = async (payload) => {
    try {
        const response = await api.post("/doctor/change-password", payload)
    } catch (error) {
        console.log("Error while updating password", error)
        throw error
    }
}

export const editDoctorProfile = async (formData) => {
    try {
        const response = await api.patch("/doctor/edit-profile", formData)
        return response
    } catch (error) {
        console.log("Error while updating Dr profile", error)
        throw error
    }
}

export const fetchAppointmentsForDoctor = async (config) => {
    try {
        const response = api.get("/doctor/appointments", config)
        return response
    } catch (error) {
        console.log("Error while fetching appointments", error)
        throw error
    }
}

