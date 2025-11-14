import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import { Toaster } from 'sonner'
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import CreateNewPassword from "./pages/auth/CreateNewPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
