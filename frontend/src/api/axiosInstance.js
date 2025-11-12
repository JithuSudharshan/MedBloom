import axios from "axios"

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
})

// Response interceptor - handle setting accesstoken while every Api-call
api.interceptors.request.use(
    (config) => {

        //Mounts the AccessToken with every api request to backend
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

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
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken

                // Save new access token
                localStorage.setItem('accessToken', newAccessToken)

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest);

            } catch (refreshError) {

                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)


export default api;