import React from 'react'
import Button from '../../../components/ui/Button'
import { useState } from 'react'
import { logoutAdmin } from '../../../api/authApi'
import { showToast } from '../../../components/ui/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const AdminDashboard = () => {
  const [isloggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { adminLogout } = useAuth()

  const handleLogout = async () => {

    setIsLoggingOut(!isloggingOut)
    try {

      const res = await adminLogout()
      if (!res?.data?.success) {
        showToast.error(res.data.message)
      }
      navigate("/admin/login")
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
      <p>welcome to AdminDashboard</p>
    </div>

  )
}

export default AdminDashboard