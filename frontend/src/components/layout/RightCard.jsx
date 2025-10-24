import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import paperPlane from "../../assets/animations/Pending confirmation.json"
import { resendEmail } from '../../api/authApi';
import { showToast } from '../ui/Toast';

const RightCard = ({ statusText, statusIcon, EmailParam }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const Email = location?.state?.email || EmailParam;
    const primaryColor = 'text-[#00AAA3]';
    const status = statusText;
    const [email, setEmail] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState('idle');
    const [countdown, setCountdown] = useState(getInitialCountdown);

    //Initialize countdown from localStorage
    const getInitialCountdown = () => {
        const stored = localStorage.getItem(`resend_countdown_${Email}`);
        if (stored) {
            const { countdown, timestamp } = JSON.parse(stored);
            const elapsed = Math.floor((Date.now() - timestamp) / 1000);
            const remaining = countdown - elapsed;
            return remaining > 0 ? remaining : 0;
        }
        return 0;
    };

    useEffect(() => {
        setEmail(Email);
    }, [Email]);

    //Save countdown to localStorage whenever it changes
    useEffect(() => {
        if (countdown > 0) {
            localStorage.setItem(`resend_countdown_${Email}`, JSON.stringify({
                countdown,
                timestamp: Date.now()
            }));
        } else {
            localStorage.removeItem(`resend_countdown_${Email}`);
        }
    }, [countdown, Email]);

    //Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const isSuccess = status === "Verification successful";
    const isFailed = status === "Verification failed";
    const showButton = isSuccess || isFailed;
    const buttonText = isSuccess ? "Go to Login" : "Go to Signup";

    const buttonHandler = () => {
        if (isSuccess) navigate('/login');
        else navigate('/signup');
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        setResendStatus('idle');

        try {
            const res = await resendEmail(email);

            if (res?.data?.success) {
                showToast.success(res.data.message);
                setResendStatus('sent');
                setCountdown(60);
            } else {
                showToast.error(res.data.message);
                setResendStatus('failed');
            }
        } catch (error) {
            console.error('Resend error:', error);
            showToast.error(error.response?.data?.message || 'Failed to resend email');
            setResendStatus('failed');
        } finally {
            setIsResending(false);
        }
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
                        Please click on the <strong className={primaryColor}>"Verify email"</strong> button in the mail to continue.
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
                    <h4 className="text-gray-700 text-md font-semibold mb-2">
                        Not seeing the email?
                    </h4>
                    <p className="text-gray-500 text-sm">
                        Please check your <strong className="text-gray-700">spam folder</strong> or{' '}
                        <button
                            onClick={handleResendEmail}
                            disabled={countdown > 0 || isResending}
                            className={`inline-flex items-center space-x-1 ml-1 text-md font-semibold ${countdown > 0 || isResending
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-[#00AAA3] hover:text-[#009289]'
                                } transition duration-200`}
                        >
                            {isResending ? (
                                <span>Sending...</span>
                            ) : countdown > 0 ? (
                                <span>Resend in {countdown}s</span>
                            ) : (
                                <>
                                    <span className="text-lg">↻</span>
                                    <span>resend email.</span>
                                </>
                            )}
                        </button>
                    </p>
                    {resendStatus === 'sent' && (
                        <p className="text-green-600 text-sm mt-2">✓ Email sent successfully!</p>
                    )}
                    {resendStatus === 'failed' && (
                        <p className="text-red-600 text-sm mt-2">Failed to send. Please try again.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default RightCard;
