// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SignUp from './pages/user/auth/SignUp';
import VerifyEmail from './pages/user/auth/VerifyEmail';
import Login from './pages/user/auth/Login';
import PatientDashboard from './pages/user/patient/PatientDashboard';
import DoctorDashboard from './pages/user/doctor/DoctorDashboard';
import CreateNewPassword from './pages/user/auth/CreateNewPassword';
import ForgotPassword from './pages/user/auth/ForgotPassword';
import AdminLogin from './pages/admin/auth/AdminLogin';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import PatientOnboardingForm from './pages/user/patient/PatientOnboardingForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoutes';
import { PublicRoute } from './components/PublicRoutes';
import HomePage from './pages/landing pages/HomePage';
import EditPatientProfilePage from './pages/user/patient/EditPatientProfilePage';
import DoctorBasicOnboardingForm from './pages/user/doctor/onboarding/DoctorBasicOnboardingForm';
import DoctorProfessionalOnboarding from './pages/user/doctor/onboarding/DoctorProfessionalOnboarding';
import EditDoctorProfilePage from './pages/user/doctor/EditDoctorProflePage';
import AdminEditDoctorPage from './pages/admin/dashboard/AdminEditDoctorPage';
import AdminPatientDetailsPage from './pages/admin/dashboard/AdminPatientDetailsPage';
import AdminEditPatientPage from './pages/admin/dashboard/AdminEditPatientPage';
import { NotificationProvider } from './context/NotificationContex';

const AppInner = () => {
  const { user } = useAuth(); // from AuthContext

  return (
    <NotificationProvider user={user}>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/" element={<Navigate to="/homePage" replace />} />

        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/homePage" element={<HomePage />} />
        </Route>

        <Route path="/verify/email/link" element={<VerifyEmail />} />
        <Route path="/create-newPassword/link" element={<CreateNewPassword />} />

        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/onboarding" element={<PatientOnboardingForm />} />
          <Route path="/patient/edit-profile" element={<EditPatientProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/basic-onboarding" element={<DoctorBasicOnboardingForm />} />
          <Route path="/doctor/proffesional-onboarding" element={<DoctorProfessionalOnboarding />} />
          <Route path="/doctor/edit-profile" element={<EditDoctorProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors/:doctorId/edit" element={<AdminEditDoctorPage />} />
          <Route path="/admin/patients/:patientId" element={<AdminPatientDetailsPage />} />
          <Route path="/admin/patient/:patientId/edit" element={<AdminEditPatientPage />} />
        </Route>
      </Routes>
    </NotificationProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
