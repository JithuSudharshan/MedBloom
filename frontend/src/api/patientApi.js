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

export const createOrderForAppointment = async (bookingData) => {
    try {
        const response = await api.post("/patient/appointments/create-order", bookingData);
        return response;
    } catch (error) {
        console.log("Error creating payment order", error);
        throw error;
    }
}

export const bookAppointmentWithWalletApi = async (bookingData) => {
    try {
        const response = await api.post("/patient/appointments/book-wallet", bookingData);
        return response;
    } catch (error) {
        console.log("Error booking with wallet", error);
        throw error;
    }
}

export const verifyPaymentForAppointment = async (paymentData) => {
    try {
        const response = await api.post("/patient/appointments/verify-payment", paymentData);
        return response;
    } catch (error) {
        console.error("Error verifying payment", error);
        throw error;
    }
}

export const cancelPatientAppointment = async (appointmentId, reason) => {
    try {
        const response = await api.put(`/patient/appointments/${appointmentId}/cancel`, { reason });
        return response;
    } catch (error) {
        console.error("Error cancelling appointment", error);
        throw error;
    }
}

export const reschedulePatientAppointment = async (appointmentId, newDate, newSlot, mode) => {
    try {
        const response = await api.put(`/patient/appointments/${appointmentId}/reschedule`, { newDate, newSlot, mode });
        return response;
    } catch (error) {
        console.error("Error rescheduling appointment", error);
        throw error;
    }
}

// Medical Records APIs
export const uploadMedicalRecord = async (formData) => {
    try {
        const response = await api.post("/patient/records", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        console.error("Error uploading medical record", error);
        throw error;
    }
}

export const fetchMedicalRecords = async (params) => {
    try {
        const response = await api.get("/patient/records", { params });
        return response;
    } catch (error) {
        console.error("Error fetching medical records", error);
        throw error;
    }
}

export const deleteMedicalRecord = async (id) => {
    try {
        const response = await api.delete(`/patient/records/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting medical record", error);
        throw error;
    }
}

export const updateMedicalRecord = async (id, data) => {
    try {
        const response = await api.put(`/patient/records/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error updating medical record", error);
        throw error;
    }
}

// Wallet APIs
export const fetchPatientWallet = async () => {
    try {
        const response = await api.get("/patient/wallet/transactions");
        return response;
    } catch (error) {
        console.error("Error fetching patient wallet", error);
        throw error;
    }
}

export const initiatePatientTopUp = async (amount) => {
    try {
        const response = await api.post("/patient/wallet/topup/initiate", { amount });
        return response;
    } catch (error) {
        console.error("Error initiating patient top up", error);
        throw error;
    }
}

export const verifyPatientTopUp = async (paymentData) => {
    try {
        const response = await api.post("/patient/wallet/topup/verify", paymentData);
        return response;
    } catch (error) {
        console.error("Error verifying patient top up", error);
        throw error;
    }
}

// Review APIs
export const submitReviewApi = async (reviewData) => {
    try {
        const response = await api.post("/patient/reviews", reviewData);
        return response;
    } catch (error) {
        console.error("Error submitting review", error);
        throw error;
    }
}
