import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import { Toaster } from 'sonner'
import RedirectToEmail from "./pages/RedirectToEmail";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/email/link" element={<RedirectToEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
