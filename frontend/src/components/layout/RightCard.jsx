import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import paperPlane from "../../assets/animations/Pending confirmation.json"

const RightCard = ({ statusText, statusIcon, EmailParam }) => {

    const location = useLocation();
    const navigate = useNavigate();

    const Email = location?.state?.email || EmailParam;
    const [status, setStatus] = useState("Verify your Email");
    const [email, setEmail] = useState("");
    const primaryColor = 'text-[#00AAA3]';

    useEffect(() => {
        setStatus(statusText);
        setEmail(Email)
    }, [statusText, Email]);

    const isSuccess = status === "Verification successful";
    const isFailed = status === "Verification failed";
    const showButton = isSuccess || isFailed;
    const buttonText = isSuccess ? "Go to Login" : "Go to Signup";

    const buttonHandler = () => {
        if (isSuccess) navigate('/login');
        else navigate('/signup');
    };

    return (
        <div className="flex justify-center flex-col items-center w-full md:w-1/2 bg-[#EBFFFF] p-8 md:p-16 text-center">
            <div className="mb-10 text-4xl font-bold">
                <span className="text-gray-900">MED</span>
                <span className={primaryColor}>BLOOM</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">{status}</h1>

            {(isSuccess || isFailed) && (
                <div className='w-2xs pb-8'>
                    <Lottie animationData={statusIcon} loop={false} />
                </div>
            )}

            <p className="text-gray-700 text-lg mb-6">
                {isSuccess && <>Your email <strong>{email}</strong> has been successfully verified.</>}
                {isFailed && <>Verification failed for <strong>{email}</strong>. <p className={`mt-2 ${primaryColor}`}>Please try again with a different email.</p></>}
                {!isSuccess && !isFailed && (
                    <>
                        We sent an email to <strong>{Email}</strong> to verify your email address.<br />
                        Please click on the <strong className={primaryColor}>“Verify email”</strong> button in the mail to continue.
                    </>
                )}
            </p>

            {showButton && (
                <button
                    onClick={buttonHandler}
                    className={`px-6 py-3 ${primaryColor} border border-[#00AAA3] rounded-md font-semibold hover:bg-[#00AAA3] hover:text-white transition`}
                >
                    {buttonText}
                </button>
            )}

            {!isSuccess && !isFailed && (
                <>
                    <Lottie animationData={paperPlane} />
                    <h4 className="text-gray-700 text-md font-semibold mb-">
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
                </>
            )}
        </div>
    );
};

export default RightCard;
