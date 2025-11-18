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
        return response
    } catch (error) {
        console.log("something went wrong", error)
        throw error
    }

}

export const logoutUser = async () => {
    try {
        const response = await api.post("/user/logout", {}, {
            withCredentials: true
        })
        return response;

    } catch (error) {
        console.log("something went wrong while logout", error)
        throw error

    }
}

export const loginAdmin = async (payload) => {
    try {

        const response = await api.post("admin/login", payload)
        if (response.data.token) {
            localStorage.setItem('token', response.data.accessToken)
        }
        return response

    } catch (error) {
        console.log("something went wrong while Admin login", error)
        throw error
    }
}

export const logoutAdmin = async () => {
    try {
        const response = await api.post("/admin/logout")
        localStorage.removeItem('token')
        return response;

    } catch (error) {
        localStorage.removeItem('token')
        console.log("something went wrong while admin logout", error)
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




