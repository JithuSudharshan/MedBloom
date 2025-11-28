import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patientProfileConfig from "../../../config/patientProfileConfig";
import PatientProfileLayout from "../../../components/profile/PatientProfileLayout";
import Navbar from "../../../components/landing page/Navbar";
import Footer from "../../../components/landing page/Footer";
import Button from "../../../components/ui/Button";
import { logoutUser } from "../../../api/authApi";
import { showToast } from "../../../components/ui/Toast";
import ProfileBanner from '../../../components/profile/ProfileBanner';

const dummyPatient = {
    fullName: "Akshay Shankar",
    email: "akshayshankar@gmail.com",
    phone: "+91 9656182621",
    dob: "1990-05-25",
    gender: "Male",
    address: "123 Main Street, Apt 4B, Ernakulam, EKM 10001",
    bloodType: "O+ve",
    cholesterol: "120/80 mmHg",
    height: "180 cm",
    weight: "65Kg",
    bloodPressure: "120/80 mmHg",
    glucoseLevel: "120/80 mmHg",
    allergies: "Penicillin, Peanuts",
    medicalCondition: "Asthma, Hypertension",
};

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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const res = await logoutUser();
            if (!res?.data?.success) {
                showToast.error(res.data.message);
            }
            navigate("/login");
            showToast.success(res.data.message);
        } catch (error) {
            showToast.error("Something went wrong");
            console.log(error);
        } finally {
            setIsLoggingOut(false);
        }
    };




    return (
        <>
            <Navbar />
            <ProfileBanner profileOwner={"Patient Profile"} profileDescription={"Manage your personal information and health records"} />
            <PatientProfileLayout
                avatar={patientProfileConfig.avatar}
                sidebarMenu={patientProfileConfig.sidebarMenu}
                sections={patientProfileConfig.sections}
                actions={patientProfileConfig.actions}
                patient={dummyPatient}
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
            </PatientProfileLayout>
            <Footer />
        </>
    );
}
