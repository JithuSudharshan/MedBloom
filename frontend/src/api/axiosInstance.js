import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true
});

// Variable to store logout function
let logoutFn = null;

// Setter method to store logout function from AuthContext
api.setLogout = (fn) => {
    logoutFn = fn
};

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
                if (logoutFn) logoutFn();
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error);
    }
);

export default api;
