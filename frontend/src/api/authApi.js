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

export const loginAdmin = async (payload) => {
    try {

        const response = await api.post("admin/login", payload)
        return response

    } catch (error) {
        console.log("something went wronf while Admin login", error)
        throw error
    }
}

export const forgotPasswordEmailVerification = async (email) => {
    try {

        const response = await api.post("/user/forgot-Password/send-verificationEmail", email);
        return response

    } catch (error) {
        console.log("Something went wrong", error)
        throw error
    }
}

export const updateNewPassword = async (payload) => {
    try {

        const response = await api.post("/user/create-new-password", payload)
        console.log(response)
        return response

    } catch (error) {
        console.log('Something went wrong', error)
        throw error
    }
}



