import axios from "axios"

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

// Response interceptor - handle token refresh automatically
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If access token expired and we haven't retried yet
        if (
            error.response?.status === 401 &&
            error.response?.data?.requiresRefresh &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                // Try to refresh the access token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-Token`,
                    {},
                    { withCredentials: true }
                );

                return api(originalRequest);

            } catch (refreshError) {

                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)


export default api;