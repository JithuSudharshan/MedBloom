import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = () => {
    const { user, loading, isAuthenticated, isPatient, isDoctor } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
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
