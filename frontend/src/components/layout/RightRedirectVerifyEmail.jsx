import React from 'react';
import { useLocation } from 'react-router-dom';
import Lottie from "lottie-react"
import { useState } from 'react';
import { useEffect } from 'react';


const RightRedirectVerifyEmail = ({ statusIcon, statusText }) => {


    const location = useLocation();
    const Email = location?.state?.email || "unknown@email.com";
    const [status, setStatus] = useState("verify your Email");
    const [email, setEmail] = useState(Email);

    const primaryColor = 'text-[#00AAA3]';
    const primaryBg = 'bg-[#00AAA3]';


    useEffect(() => {
        setStatus(statusText)
        setEmail(Email)
    }, [statusText])

    return (

        <>
            <div className="flex justify-center flex-col items-center w-full md:w-1/2 bg-[#EBFFFF] p-8 md:p-16 text-center">
                <div className='w-2xs pb-25' >
                    {status === "Verification successfull" ? <Lottie animationData={statusIcon} speed={0.1} loop={true} autoPlay={true} /> : <></>}
                </div>

                <div className="mb-10 text-4xl font-bold">
                    <span className="text-gray-900">MED</span>
                    <span className={primaryColor}>BLOOM</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">{status}</h1>


                {status !== "Verification successfull" && status !== "Verification failed" ? <> <div className="max-md ">
                    <p className="text-gray-600 mt-2  text-lg mb-2 leading-relaxed">
                        We sent an email to <strong className="text-gray-900">{email}</strong> to verify your email address.
                    </p>
                    <p className="text-gray-600 text-lg mb-8 mt leading-relaxed font-semibold">
                        Please click on the <strong className={primaryColor}>“Verify email”</strong> button in the mail to continue.
                    </p>
                </div>

                    <div className="mt-4">
                        <h4 className="text-gray-700 text-md font-semibold mb-2">
                            Not seeing the email?
                        </h4>
                        <p className="text-gray-500 text-sm">
                            Please check your <strong className="text-gray-700">spam folder</strong> or
                            <button
                                className={`inline-flex items-center space-x-1 ml-1 text-md font-semibold ${primaryColor} hover:text-[#009289] transition duration-200`}

                            >
                                <span className="text-lg">↻</span>
                                <span>resend email.</span>
                            </button>
                        </p>
                    </div></> : <></>}
            </div >
        </>
    );

};

export default RightRedirectVerifyEmail;