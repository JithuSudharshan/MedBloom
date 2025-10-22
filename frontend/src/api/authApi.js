import api from '../api/axiosInstance'

export const signupUser = async (payload) => {
    const response = await api.post("/user/signup", payload);
    return response;
}

export const verifyLink = async (email) => {
    const response = await api.post("/user/verify/email/link", email)
    return response;
}