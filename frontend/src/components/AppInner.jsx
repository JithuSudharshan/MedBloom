import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoutes';
import { PublicRoute } from './PublicRoutes';
import HomePage from '../pages/landing pages/HomePage';
import AboutUsPage from '../pages/landing pages/AboutUsPage';
import ServicesPage from '../pages/landing pages/ServicesPage';
import FindDoctorsPage from '../pages/landing pages/FindDoctorsPage';
import PublicDoctorProfile from '../pages/patient/PublicDoctorProfile';
import EditPatientProfilePage from '../pages/user/patient/EditPatientProfilePage';
import DoctorBasicOnboardingForm from '../pages/user/doctor/onboarding/DoctorBasicOnboardingForm';
import DoctorProfessionalOnboarding from '../pages/user/doctor/onboarding/DoctorProfessionalOnboarding';
import EditDoctorProfilePage from '../pages/user/doctor/EditDoctorProflePage';
import AdminEditDoctorPage from '../pages/admin/dashboard/AdminEditDoctorPage';
import AdminPatientDetailsPage from '../pages/admin/dashboard/AdminPatientDetailsPage';
import AdminEditPatientPage from '../pages/admin/dashboard/AdminEditPatientPage';
import { NotificationProvider } from '../context/NotificationContex';
import { Toaster } from 'sonner';
import SignUp from '../pages/user/auth/SignUp';
import VerifyEmail from '../pages/user/auth/VerifyEmail';
import Login from '../pages/user/auth/Login';
import PatientDashboard from '../pages/user/patient/PatientDashboard';
import DoctorDashboard from '../pages/user/doctor/DoctorDashboard';
import CreateNewPassword from '../pages/user/auth/CreateNewPassword';
import ForgotPassword from '../pages/user/auth/ForgotPassword';
import AdminLogin from '../pages/admin/auth/AdminLogin';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import PatientOnboardingForm from '../pages/user/patient/PatientOnboardingForm';
import VideoConsultationRoom from '../pages/consultation/VideoConsultationRoom';
import DoctorWelcomeCelebration from '../pages/user/doctor/DoctorWelcomeCelebration';
import ApplicationReviewPage from '../pages/admin/dashboard/ApplicationReviewPage';
import NavigationProgress from './ui/NavigationProgress';
import Unauthorized from '../pages/error/Unauthorized';

export const AppInner = () => {
    const { user } = useAuth();

    return (
        <NotificationProvider user={user}>
            <Toaster position="top-right" richColors />
            <NavigationProgress />

            <Routes>
                <Route path="/" element={<Navigate to="/homePage" replace />} />

                <Route element={<PublicRoute />}>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/homePage" element={<HomePage />} />
                    <Route path="/aboutUs" element={<AboutUsPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/doctors" element={<FindDoctorsPage />} />
                </Route>

                <Route path="/verify/email/link" element={<VerifyEmail />} />
                <Route path="/create-newPassword/link" element={<CreateNewPassword />} />
                <Route path="/doctor/:id" element={<PublicDoctorProfile />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                    <Route path="/patient">
                        <Route index element={<Navigate to="personal" replace />} />
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="personal" element={<PatientDashboard />} />
                        <Route path="appointments" element={<PatientDashboard />} />
                        <Route path="appointments/:id" element={<PatientDashboard />} />
                        <Route path="triage" element={<PatientDashboard />} />
                        <Route path="records" element={<PatientDashboard />} />
                        <Route path="notifications" element={<PatientDashboard />} />
                        <Route path="transactions" element={<PatientDashboard />} />
                        <Route path="wallet" element={<PatientDashboard />} />
                        <Route path="settings" element={<PatientDashboard />} />
                        <Route path="onboarding" element={<PatientOnboardingForm />} />
                        <Route path="edit-profile" element={<EditPatientProfilePage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                    <Route path="/doctor">
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="welcome" element={<DoctorWelcomeCelebration />} />
                        <Route path="dashboard" element={<DoctorDashboard />} />
                        <Route path="personal" element={<DoctorDashboard />} />
                        <Route path="patients" element={<DoctorDashboard />} />
                        <Route path="availability" element={<DoctorDashboard />} />
                        <Route path="appointments" element={<DoctorDashboard />} />
                        <Route path="appointments/:id" element={<DoctorDashboard />} />
                        <Route path="publications" element={<DoctorDashboard />} />
                        <Route path="notifications" element={<DoctorDashboard />} />
                        <Route path="transactions" element={<DoctorDashboard />} />
                        <Route path="wallet" element={<DoctorDashboard />} />
                        <Route path="settings" element={<DoctorDashboard />} />
                        <Route path="basic-onboarding" element={<DoctorBasicOnboardingForm />} />
                        <Route path="proffesional-onboarding" element={<DoctorProfessionalOnboarding />} />
                        <Route path="edit-profile" element={<EditDoctorProfilePage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin">
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="doctors" element={<AdminDashboard />} />
                        <Route path="patients" element={<AdminDashboard />} />
                        <Route path="appointments" element={<AdminDashboard />} />
                        <Route path="departments" element={<AdminDashboard />} />
                        <Route path="notifications" element={<AdminDashboard />} />
                        <Route path="wallet" element={<AdminDashboard />} />
                        <Route path="doctor/review/:doctorId" element={<ApplicationReviewPage />} />
                        <Route path="doctors/:doctorId/edit" element={<AdminEditDoctorPage />} />
                        <Route path="patients/:patientId" element={<AdminPatientDetailsPage />} />
                        <Route path="patient/:patientId/edit" element={<AdminEditPatientPage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor']} />}>
                    <Route path="/consultation/:id" element={<VideoConsultationRoom />} />
                </Route>
            </Routes>
        </NotificationProvider>
    );
};

export default AppInner
