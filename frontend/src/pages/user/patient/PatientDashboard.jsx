import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patientProfileConfig from "../../../config/patientProfileConfig";
import ProfileLayout from "../../../components/profile/ProfileLayout";
import Navbar from "../../../components/landing page/Navbar";
import Button from "../../../components/ui/Button";
import { showToast } from "../../../components/ui/Toast";
import ProfileBanner from '../../../components/profile/ProfileBanner';
import { useAuth } from '../../../context/AuthContext';
import { loadPatientData } from '../../../api/patientApi';
import Loader from '../../../components/ui/Loading';
import IsonboardedWarning from '../../../components/profile/IsonboardedWarning';
import FindDoctorModal from '../../../components/profile/appointments/FindDoctorModal';
import { Calendar, Clock, User } from 'lucide-react';

export default function PatientProfilePage() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [patientDetails, setPatientDetails] = useState({});
    const [loading, setloading] = useState(true);
    const [isNavbarModalOpen, setIsNavbarModalOpen] = useState(false);


    useEffect(() => {
        fetchPatientDetails()
    }, [])


    const fetchPatientDetails = async () => {
        try {
            setloading(true)

            //custome delay for show
            await new Promise((resolve) => setTimeout(resolve, 1700))

            const response = await loadPatientData("forDashboard")
            if (response) {
                setPatientDetails(response?.data?.details)
                console.log(patientDetails)
            }
        } catch (error) {
            console.log("error at fetch : ", error)
        } finally {
            setloading(false)
        }
    }

    const handleLogout = async () => {
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
        }
    };

    const handleCompleteOnboarding = () => {
        navigate("/patient/onboarding")
    }
    return (
        <>
            <div className="hidden lg:block">
                <Navbar current={"login"} onBookNow={() => setIsNavbarModalOpen(true)} />
            </div>
            <div className="hidden lg:block">
                <ProfileBanner 
                    userRole="patient"
                    userDetails={patientDetails} 
                    metrics={[
                        { label: "Next Appointment", value: patientDetails.nextAppointment, icon: Calendar },
                        { label: "Last Checkup", value: patientDetails.lastCheckup, icon: Clock },
                        { label: "Profile Status", value: patientDetails.profileStatus, icon: User }
                    ]}
                />
            </div>
            {!patientDetails.isOnboarded && <IsonboardedWarning onClick={handleCompleteOnboarding} />}
            <ProfileLayout
                user={"patient"}
                isActive={"personal"}
                sidebarMenu={patientProfileConfig.sidebarMenu}
                sections={patientProfileConfig.sections}
                actions={patientProfileConfig.actions}
                profileData={patientDetails}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
            />
            {loading && <Loader />}
            <FindDoctorModal 
                isOpen={isNavbarModalOpen} 
                onClose={() => setIsNavbarModalOpen(false)} 
            />
        </>
    );
}
