import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loading';

export const PublicRoute = () => {
    const { user, loading, isAuthenticated, isPatient, isDoctor } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div>
                <Loader />
            </div>
        )
    }

    // If authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
        if (isPatient) {
            return <Navigate to="/patient/dashboard" replace />
        }
        if (isDoctor) {
            return <Navigate to="/doctor/dashboard" replace />
        }
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />
        }
        // Fallback
        return <Navigate to="/" replace />
    }

    // Not authenticated - allow access to public routes
    return <Outlet />
};
