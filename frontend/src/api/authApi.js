import api from '../api/axiosInstance'

export const signupUser = async (payload) => {
    const response = await api.post("/user/signup", payload);
    return response;
}

export const resendEmail = async (email) => {
    const response = await api.post("/user/verify/resend-email", { email })
    return response
}