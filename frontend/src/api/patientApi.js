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

export const loadPatientData = async (purpose) => {

    try {
        const response = await api.get(`/patient/profile`, {
            params: {
                purpose: `${purpose}`
            }
        });
        return response
    } catch (error) {
        console.log("Error while fetching patient data:", error)
        throw error
    }
}

export const updatePatientAvatar = async (formData) => {
    try {
        const response = await api.post("/patient/avatar/update", formData)
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

export const fetchAppointmentsForPatient = async (config) => {
    try {
        const response = api.get("/patient/appointments", config)
        return response
    } catch (error) {
        console.log("Error while fetching appointments", error)
        throw error
    }
}


