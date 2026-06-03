import api from "./axiosInstance";

export const fetchDoctorsData = async (params = {}) => {
    try {
        const response = await api.get("/user/doctorsData", { params })
        return response
    } catch (error) {
        console.log("Error while fetching Dr data for Find doctor page", error)
        throw error
    }
}

export const fetchDepartmentsList = async () => {
    try {
        const response = await api.get("/user/departments");
        return response;
    } catch (error) {
        console.error("Error fetching departments list:", error);
        throw error;
    }
};

export const fetchPublicDoctorProfile = async (id) => {
    try {
        const response = await api.get(`/doctors/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching public doctor profile:", error);
        throw error;
    }
};

export const fetchAvailableSlots = async (id, date) => {
    try {
        const response = await api.get(`/doctors/${id}/available-slots?date=${date}`);
        return response;
    } catch (error) {
        console.error("Error fetching available slots:", error);
        throw error;
    }
};

export const fetchDoctorReviewsApi = async (id) => {
    try {
        const response = await api.get(`/doctors/${id}/reviews`);
        return response;
    } catch (error) {
        console.error("Error fetching doctor reviews:", error);
        throw error;
    }
};