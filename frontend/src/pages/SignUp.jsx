import LeftHero from "../components/layout/LeftHero";
import AuthCard from "../components/layout/AuthCard";
import heroImg from "../assets/hero-illustration.png";
import { useState } from "react";

const SignUp = () => {
    const [role, setRole] = useState("patient")
    return (
        <div className="flex h-screen">
            <LeftHero imgSrc={heroImg} headLine={"Join MEDBLOOM Today"} sentence={"Create an account to book appointments, access medical records, and connect with healthcare professionals."} />
            <AuthCard oneLine={"Join us! Sign up as a Doctor or Patient."} authState={"signup"} onChange={setRole} />
        </div>
    );
};

export default SignUp;
