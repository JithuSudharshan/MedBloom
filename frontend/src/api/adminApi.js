import api from "./axiosInstance";

export const fetchDoctorsList = async (config) => {
    try {
        const response = await api.get("/admin/doctors/pending", config);
        return response
    } catch (error) {
        console.log("Error while fetching pending Dr's list", error)
        throw error
    }
}

export const acceptDoctor = async (id) => {

    try {
        const response = await api.patch(`/admin/doctors/${id}/approve`);
        return response
    } catch (error) {
        console.log("Error while Approving Dr profile", error)
        throw error
    }

}

export const rejectDoctor = async (id) => {

    try {
        const response = await api.patch(`/admin/doctors/${id}/reject`);
        return response
    } catch (error) {
        console.log("Error while rejecting Dr profile", error);
        throw error
    }

}

export const fetchApprovedList = async (config) => {
    try {
        const response = api.get('/admin/doctors/approved', config)
        return response
    } catch (error) {
        console.log("Error while fetching approved Dr's", error);
        throw error
    }

}

export const loadLocalDoctor = async (id) => {
    try {
        const response = await api.get(`/admin/doctors/approved/${id}/details`)
        return response
    } catch (error) {
        console.log("Error while fetching Dr profile", error);
        throw error
    }
}

export const loadDoctorDataForAdmin = async (id) => {
    try {
        const response = await api.get(`/admin/doctor/${id}/to-edit`)
        return response
    } catch (error) {
        console.log("Error while fetching doctor details", error)
        throw error
    }
}

export const adminEditsDoctorProfile = async (formData, id) => {
    try {
        const response = await api.patch(`/admin/doctors/${id}/edit-profile`, formData)
        return response
    } catch (error) {
        console.log("Error while updating Dr profile", error)
        throw error
    }
}

export const blockDoctor = async (id) => {
    try {
        const response = await api.patch(`/admin/doctor/block/${id}`)
        return response
    } catch (error) {
        console.log("Error while blocking Dr profile", error)
        throw error
    }
}

export const unblockDoctor = async (id) => {
    try {
        const response = await api.patch(`/admin/doctor/unblock/${id}`)
        return response
    } catch (error) {
        console.log("Error while unblocking Dr profile", error)
        throw error
    }
}

export const fetchPatientsList = async (config) => {
    try {
        const response = api.get('/admin/patients', config)
        return response
    } catch (error) {
        console.log("Error while fetching patients", error);
        throw error
    }

}

export const loadPatientForAdmin = async (id) => {
    try {
        const response = await api.get(`/admin/patient/${id}/profile`)
        return response
    } catch (error) {
        console.log("Error while fetching patient profile", error)
        throw error
    }
}

export const loadPatientDataForAdmin = async (id) => {
    try {
        const response = await api.get(`/admin/patient/${id}/edit`)
        return response
    } catch (error) {
        console.log("Error while fetching patient data to edit", error)
        throw error
    }
}

export const admineditsPatientProfile = async (formData, id) => {
    try {
        const response = await api.patch(`/admin/patient/${id}/edit-profile`, formData)
        return response
    } catch (error) {
        console.log("Error while updating patient profile", error)
        throw error
    }
}