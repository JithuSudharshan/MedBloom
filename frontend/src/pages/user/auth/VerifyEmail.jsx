import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LeftHero from '../../../components/layout/LeftHero';
import RightCard from '../../../components/layout/RightCard';
import heroImg from "../../../assets/hero-illustration.png";
import verifyIcon from "../../../assets/animations/Success.json";
import rejectedIcon from "../../../assets/animations/Rejected.json";

const VerifyEmail = () => {
    const location = useLocation();
    const [status, setStatus] = useState("checking");
    const [email, setEmail] = useState("");

    useEffect(() => {

        const query = new URLSearchParams(location.search);
        const result = query.get("status");
        const queryEmail = query.get("email");

        if (queryEmail) setEmail(queryEmail)

        if (result === "success") setStatus("success");
        else if (result === "failed") setStatus("failed");
        else setStatus("checking");
    }, [location.search]);

    const statusMap = {
        checking: "Verify your Email",
        success: "Verification successful",
        failed: "Verification failed"
    };

    return (
        <div className="flex h-screen">
            <LeftHero imgSrc={heroImg} sentence={"Create an account to book appointments, access medical records, and connect with healthcare professionals."} />
            <RightCard
                statusText={statusMap[status]}
                statusIcon={status === "success" ? verifyIcon : rejectedIcon}
                EmailParam={email}
            />
        </div>
    );
};

export default VerifyEmail;
