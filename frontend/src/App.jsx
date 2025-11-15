import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/user/auth/SignUp";
import { Toaster } from 'sonner'
import VerifyEmail from "./pages/user/auth/VerifyEmail";
import Login from "./pages/user/auth/Login";
import PatientDashboard from "./pages/user/patient/PatientDashboard";
import DoctorDashboard from "./pages/user/doctor/DoctorDashboard";
import CreateNewPassword from "./pages/user/auth/CreateNewPassword";
import ForgotPassword from "./pages/user/auth//ForgotPassword";
import AdminLogin from "./pages/admin/auth/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/email/link" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-newPassword/link" element={<CreateNewPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
