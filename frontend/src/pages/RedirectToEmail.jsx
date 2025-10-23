import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LeftHero from '../components/layout/LeftHero';
import RightRedirectVerifyEmail from '../components/layout/RightRedirectVerifyEmail';
import heroImg from "../assets/hero-illustration.png";
import verifyIcon from "../assets/animations/Fingerprint Verification.json";
import rejectedIcon from "../assets/animations/Rejected.json";

const RedirectToEmail = () => {
    const location = useLocation();
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const result = query.get("status");

        if (result === "success") setStatus("success");
        else if (result === "failed") setStatus("failed");
        else setStatus("checking");
    }, [location]);

    const statusMap = {
        checking: "Verify your Email",
        success: "Verification successfull",
        failed: "Verification failed"
    };

    return (
        <div className="flex h-screen">
            <LeftHero imgSrc={heroImg} sentence={"Create an account to book appointments, access medical records, and connect with healthcare professionals."} />
            <RightRedirectVerifyEmail
                statusText={statusMap[status]}
                statusIcon={status === "success" ? verifyIcon : rejectedIcon}
            />
        </div>
    );
};

export default RedirectToEmail;
