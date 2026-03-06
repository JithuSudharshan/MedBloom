import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from "../../../components/profile/ProfileLayout";
import Navbar from "../../../components/landing page/Navbar";
import Button from "../../../components/ui/Button";
import { showToast } from "../../../components/ui/Toast";
import ProfileBanner from '../../../components/profile/ProfileBanner';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/ui/Loading';
import doctorProfileConfig from '../../../config/doctorProfileConfig';
import { loadDoctorData } from '../../../api/doctorApi';
import IsonboardedWarning from '../../../components/profile/IsonboardedWarning';

const dummyAppointments = [
    {
        id: 1,
        doctorName: "Dr. Arjun Menon",
        speciality: "Cardiology",
        dateTimeLabel: "2023-11-10 at 10:00 AM",
        status: "Upcoming",
    },
    {
        id: 2,
        doctorName: "Dr. Arjun Menon",
        speciality: "Cardiology",
        dateTimeLabel: "2023-11-10 at 10:00 AM",
        status: "Upcoming",
    },
    {
        id: 3,
        doctorName: "Dr. Arjun Menon",
        speciality: "Cardiology",
        dateTimeLabel: "2023-11-10 at 10:00 AM",
        status: "Completed",
    },
    {
        id: 4,
        doctorName: "Dr. Arjun Menon",
        speciality: "Cardiology",
        dateTimeLabel: "2023-11-10 at 10:00 AM",
        status: "Cancelled",
    },

];

export default function DcotorProfilePage() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [doctorDetails, setDoctorDetails] = useState({});
    const [loading, setloading] = useState(true)


    useEffect(() => {
        fetchDoctorDetails()
    }, [])


    const fetchDoctorDetails = async () => {
        try {
            setloading(true)

            const response = await loadDoctorData()
            if (response) {
                setDoctorDetails(response?.data?.details)
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

    const handleNavigate = () => {
        navigate("/doctor/basic-onboarding")
    }
    return (
        <>
            <Navbar current={"login"} />
            <ProfileBanner profileOwner={"Doctor Profile"} profileDescription={"Manage your personal information and bussiness records"} />
            {!doctorDetails.isOnboarded && < IsonboardedWarning onClick={handleNavigate} />}
            <ProfileLayout
                user={"doctor"}
                isActive={"dashboard"}
                sidebarMenu={doctorProfileConfig.sidebarMenu}
                sections={doctorProfileConfig.sections}
                actions={doctorProfileConfig.actions}
                profileData={doctorDetails}
                appointments={dummyAppointments}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
            >
                {/* Slot: Pass dashboard-specific content for greeting/etc */}
                <div className="mb-6">
                    <Button onClick={handleLogout} variant="danger" size="sm">
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </ProfileLayout>
            {loading && <Loader />}

        </>
    );
}
