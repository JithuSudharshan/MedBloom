import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import { Toaster } from 'sonner'
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/email/link" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
