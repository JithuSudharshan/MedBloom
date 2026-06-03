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
        const response = await api.get("/doctor/appointments", config)
        return response
    } catch (error) {
        console.log("Error while fetching appointments", error)
        throw error
    }
}

export const fetchMetricsForDoctor = async () => {
    try {
        const response = await api.get("/doctor/Dashboard-Metrics")
        return response
    } catch (error) {
        console.log("Error while fetchings appoinments", error)
        throw error
    }
}

export const fetchDoctorAvailability = async () => {
    try {
        const response = await api.get("/doctor/availability")
        return response
    } catch (error) {
        console.log("Error while fetching doctor availability", error)
        throw error
    }
}

export const saveDoctorAvailability = async (payload) => {
    try {
        const response = await api.put("/doctor/availability", payload)
        return response
    } catch (error) {
        console.log("Error while saving doctor availability", error)
        throw error
    }
}

// Wallet APIs
export const fetchDoctorWallet = async () => {
    try {
        const response = await api.get("/doctor/wallet/transactions");
        return response;
    } catch (error) {
        console.error("Error fetching doctor wallet", error);
        throw error;
    }
}

export const initiateDoctorTopUp = async (amount) => {
    try {
        const response = await api.post("/doctor/wallet/topup/initiate", { amount });
        return response;
    } catch (error) {
        console.error("Error initiating doctor top up", error);
        throw error;
    }
}

export const verifyDoctorTopUp = async (paymentData) => {
    try {
        const response = await api.post("/doctor/wallet/topup/verify", paymentData);
        return response;
    } catch (error) {
        console.error("Error verifying doctor top up", error);
        throw error;
    }
}

export const savePrescriptionApi = async (appointmentId, payload) => {
    try {
        const response = await api.put(`/doctor/appointments/${appointmentId}/prescription`, payload);
        return response;
    } catch (error) {
        console.error("Error saving prescription", error);
        throw error;
    }
}

export const completeConsultationApi = async (appointmentId) => {
    try {
        const response = await api.put(`/doctor/appointments/${appointmentId}/complete`);
        return response;
    } catch (error) {
        console.error("Error completing consultation", error);
        throw error;
    }
}

export const fetchPatientRecordsForConsultation = async (appointmentId) => {
    try {
        const response = await api.get(`/doctor/appointments/${appointmentId}/patient-records`);
        return response;
    } catch (error) {
        console.error("Error fetching patient records", error);
        throw error;
    }
}
