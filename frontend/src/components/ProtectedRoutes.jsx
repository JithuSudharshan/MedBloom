import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loading';

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth()

    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div>
                <Loader />
            </div>
        )
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check role-based access if allowedRoles specified
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    // Authenticated and authorized - render child routes
    return <Outlet />;
};
