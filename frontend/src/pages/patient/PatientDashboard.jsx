import React from 'react'
import Button from '../../components/ui/Button'
import { useState } from 'react'
import { logoutUser } from '../../api/authApi'
import { showToast } from '../../components/ui/Toast'
import { useNavigate } from 'react-router-dom'

const PatientDashboard = () => {
    const [isloggingOut, setIsLoggingOut] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {

        setIsLoggingOut(!isloggingOut)
        try {

            const res = await logoutUser()
            if (!res?.data?.success) {
                showToast.error(res.data.message)
            }
            navigate("/login")
            showToast.success(res.data.message)
            setIsLoggingOut(!isloggingOut)

        } catch (error) {
            setIsLoggingOut(!isloggingOut)
            console.log("something went wrong", error)
        }
    }
    return (
        <div>
            <Button onClick={handleLogout}  >{isloggingOut ? "logging out.." : "logout"}</Button>
            <p>welcome to PatientDashboard</p>
        </div>

    )
}

export default PatientDashboard