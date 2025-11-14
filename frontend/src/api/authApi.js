import api from '../api/axiosInstance'

export const signupUser = async (payload) => {

    try {

        const response = await api.post("/user/signup", payload);
        return response;

    } catch (error) {
        console.log("something went wrong", error)
        throw error
    }
}

export const resendEmail = async (email) => {

    try {
        const response = await api.post("/user/verify/resend-email", { email })
        return response
    } catch (error) {
        console.log("something went wrong:", error)
        throw error
    }
}

export const loginUser = async (payload) => {

    try {

        const response = await api.post("/user/login", payload);

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken)
        }
        return response
    } catch (error) {
        console.log("something went wrong", error)
        throw error
    }

}

export const logoutUser = async () => {
    try {
        const response = await api.post("/user/logout")
        localStorage.removeItem('accessToken')
        return response;

    } catch (error) {
        localStorage.removeItem('accessToken')
        console.log("something went wrong while logout", error)
        throw error

    }
}

export const forgotPasswordEmailVerification = async (email) => {
    try {

        const response = await api.post("/user/forgotPassword/send-verificationEmail", email);
        return response

    } catch (error) {

    }
}

export const updateNewPassword = async (payload) => {
    try {

        const response = await api.post("user/update-password", payload)
        return response

    } catch (error) {
        console.log('Something went wrong', error)
        throw error
    }
}



