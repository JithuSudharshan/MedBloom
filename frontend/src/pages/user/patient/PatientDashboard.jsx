import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patientProfileConfig from "../../../config/patientProfileConfig";
import ProfileLayout from "../../../components/profile/ProfileLayout";
import Navbar from "../../../components/landing page/Navbar";
import Footer from "../../../components/landing page/Footer";
import Button from "../../../components/ui/Button";
import { showToast } from "../../../components/ui/Toast";
import ProfileBanner from '../../../components/profile/ProfileBanner';
import { useAuth } from '../../../context/AuthContext';
import { loadPatientData } from '../../../api/patientApi';
import Loader from '../../../components/ui/Loading';

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
    {
        id: 5,
        doctorName: "Dr. Arjun Menon",
        speciality: "Cardiology",
        dateTimeLabel: "2023-11-10 at 10:00 AM",
        status: "Completed",
    },
    {
        id: 6,
        doctorName: "Dr. Arjun Menon",
        speciality: "Cardiology",
        dateTimeLabel: "2023-11-10 at 10:00 AM",
        status: "Cancelled",
    },
];

export default function PatientProfilePage() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [patientDetails, setPatientDetails] = useState({});
    const [loading, setloading] = useState(true)


    useEffect(() => {
        fetchPatientDetails()
    }, [])


    const fetchPatientDetails = async () => {
        try {
            setloading(true)

            //custome delay for show
            await new Promise((resolve) => setTimeout(resolve, 1700))

            const response = await loadPatientData()
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
    return (
        <>
            <Navbar />
            <ProfileBanner profileOwner={"Patient Profile"} profileDescription={"Manage your personal information and health records"} />
            <ProfileLayout
                sidebarMenu={patientProfileConfig.sidebarMenu}
                sections={patientProfileConfig.sections}
                actions={patientProfileConfig.actions}
                profileData={patientDetails}
                appointments={dummyAppointments}
                onLogout={handleLogout} // Prop for sidebar/logout button
                isLoggingOut={isLoggingOut}
            >
                {/* Slot: Pass dashboard-specific content for greeting/etc */}
                <div className="mb-6">
                    <Button onClick={handleLogout} variant="danger" size="sm">
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </ProfileLayout>
            <Footer />
            {loading && <Loader />}

        </>
    );
}
