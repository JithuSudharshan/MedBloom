import api from '../api/axiosInstance'

export const signupUser = async (payload) => {
    const response = await api.post("/user/signup", payload);
    return response;
}