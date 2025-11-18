import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { loginAdmin, loginUser, logoutAdmin, logoutUser } from '../api/authApi';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth()
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get("/user/context-auth-verify", {
                withCredentials: true,
            })

            // If successful, set user
            setUser(response.data.user)

        } catch (error) {
            console.error("Auth check failed:", error)
            setUser(null)

        } finally {
            setLoading(false)
        }
    }

    const login = async (payload) => {
        try {
            const res = await loginUser(payload)
            setUser(res.data.user)
            return res
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    }

    // LOGOUT
    const logout = async () => {
        try {
            await logoutUser()
        } finally {
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
        }
    }

    const adminLogin = async (payload) => {
        try {
            const res = await loginAdmin(payload)
            setUser(res.data.user)
            return res
        } catch (error) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    }

    const adminLogout = async () => {
        try {
            const res = await logoutAdmin()
            return res
        } catch (error) {
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/admin/login';
        }
    }



    const value = {
        user,
        loading,
        login,
        logout,
        adminLogin,
        adminLogout,
        isAuthenticated: !!user,
        isPatient: user?.role === 'patient',
        isDoctor: user?.role === 'doctor',
        isAdmin: user?.role === 'admin'
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context;
}
