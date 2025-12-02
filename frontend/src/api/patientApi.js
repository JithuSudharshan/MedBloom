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

export const patientChangePassword = async (payload) => {
    try {
        const response = await api.post("/patient/change-password", payload)
        return response
    } catch (error) {
        console.log("Error while changing password:", error)
        throw error
    }
}

export const loadPatientData = async () => {

    try {
        const response = await api.get("/patient/profile");
        return response
    } catch (error) {
        console.log("Error while fetching patient data:", error)
        throw error
    }
}

export const updateProfilePicture = async (formData) => {
    try {
        const response = await api.post("/patient/profile-picture/update", formData)
        return response
    } catch (error) {
        console.log("Error while updating profile pic:", error)
        throw error
    }
}

export const editPatientProfile = async (formData) => {

    try {
        const response = await api.patch("/patient/edit-profile", formData)
        return response
    } catch (error) {
        console.log("Error while editing patien profile :", error)
        throw error
    }
}


