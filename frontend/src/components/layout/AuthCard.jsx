import React, { useEffect, useState } from "react";
import OAuthButton from "../form/OAuthButton";
import ToggleButtons from "../ui/ToggleButton";
import SignupForm from "../form/SignupForm";
import LoginForm from "../form/LoginForm";


const AuthCard = ({ oneLine, onChange, authState, isAdmin }) => {
    const [selected, setSelected] = useState("Patient"); // Track selected role (Patient/Doctor)

    useEffect(() => {
        sendRole();
    }, [selected])

    const sendRole = () => {
        return onChange(selected)
    }

    return (
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#EBFFFF] py-10">
            <div className="p-8 w-80 sm:w-96">
                {/* Logo */}
                <h1 className="text-6xl font-bold mb-1 text-center">
                    <span className="text-gray-800">MED</span>
                    <span className="text-[#00A4A3]">BLOOM</span>
                </h1>
                <p className="text-gray-500 text-sm text-center mb-4">
                    {oneLine}
                </p>



                {/* Role selector - Patient or Doctor or Admin */}
                {isAdmin ? <div className="flex justify-center gap-2 mb-4 bg-white p-1 rounded-full w-max mx-auto">
                    <button className="px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 bg-linear-to-br from-[#00737A] to-[#00C8C7] text-white">Admin</button>
                </div> :
                    <ToggleButtons
                        options={["Patient", "Doctor"]}
                        value={selected}
                        onChange={setSelected}
                    />}



                {/* OAuth login options */}
                {isAdmin ? <></> : <>
                    <OAuthButton />
                    <div className="flex items-center my-3">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-2 text-gray-400 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                </>}


                {/* Registration form */}
                {authState === "login" ? <LoginForm isAdmin={isAdmin} selected={selected} /> : <SignupForm selected={selected} />}



            </div>
        </div >
    );
};
export default AuthCard;