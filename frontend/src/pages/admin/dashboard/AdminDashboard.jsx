import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminProfileConfig from "../../../config/adminProfileConfig";
import Navbar from "../../../components/landing page/Navbar";
import Button from "../../../components/ui/Button";
import { showToast } from "../../../components/ui/Toast";
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/ui/Loading';
import AdminProfileLayout from '../../../components/profile/admin/AdminProfileLayout';

export default function PatientProfilePage() {

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setloading] = useState(false)


  const handleLogout = async () => {
    setloading(true)
    setIsLoggingOut(true);
    try {
      const res = await logout();
      console.log(res)
      if (!res?.data?.success) {
        showToast.error(res.data.message);
      }
      navigate("/login");
      showToast.success(res.data.message);
    } catch (error) {
      showToast.error("Something went wrong here");
      console.log(error);
    } finally {
      setIsLoggingOut(false);
      setloading(false)
    }
  };



  return (
    <>
      <Navbar current={"adminLogin"} />
      <AdminProfileLayout
        sidebarMenu={adminProfileConfig.sidebarMenu}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      >

        <div className="mb-6">
          <Button onClick={handleLogout} variant="danger" size="sm">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </AdminProfileLayout>
      {loading && <Loader />}
    </>
  );
}
