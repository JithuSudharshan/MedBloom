import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

// Response interceptor - handle token refresh automatically
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only trigger refresh if 401, custom flag, and not already retried
        if (
            error.response?.status === 401 &&
            error.response?.data?.requiresRefresh &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Use same axios instance for refresh request
                await api.get("/user/auth/refresh-Token")
                // Retry the original request
                return api(originalRequest)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error);
    }
);

export default api;
