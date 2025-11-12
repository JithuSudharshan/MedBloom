import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux'

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {

    const accessToken = localStorage.getItem('accessToken')
    const { user } = useSelector((state) => state.auth.user)

    if (!accessToken) {
        return <Navigate to={'/login'} replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={'/unauthorized'} replace />
    }
    return children
}

export default ProtectedRoutes