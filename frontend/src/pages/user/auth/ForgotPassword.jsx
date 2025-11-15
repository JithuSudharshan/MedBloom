import React, { useState, useEffect } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/form/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { forgotPasswordEmailVerification } from '../../../api/authApi'
import { showToast } from '../../../components/ui/Toast'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [resendStatus, setResendStatus] = useState('idle')

    const schema = yup.object({
        email: yup.string().email('Invalid email').required('Email is required')
    }).required()

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: ''
        }
    })

    // Get initial countdown from localStorage
    const getInitialCountdown = () => {
        const stored = localStorage.getItem('forgot_password_resend_countdown')
        if (stored) {
            const { countdown, timestamp } = JSON.parse(stored)
            const elapsed = Math.floor((Date.now() - timestamp) / 1000)
            const remaining = countdown - elapsed
            return remaining > 0 ? remaining : 0
        }
        return 0
    }

    // Get last submitted email from localStorage
    const getLastSubmittedEmail = () => {
        return localStorage.getItem('forgot_password_last_email') || ''
    }

    const [countdown, setCountdown] = useState(getInitialCountdown)
    const [lastSubmittedEmail, setLastSubmittedEmail] = useState(getLastSubmittedEmail)

    // Save countdown to localStorage whenever it changes
    useEffect(() => {
        if (countdown > 0) {
            localStorage.setItem('forgot_password_resend_countdown', JSON.stringify({
                countdown,
                timestamp: Date.now()
            }))
        } else {
            localStorage.removeItem('forgot_password_resend_countdown')
        }
    }, [countdown])

    // Save email to localStorage whenever it changes
    useEffect(() => {
        if (lastSubmittedEmail) {
            localStorage.setItem('forgot_password_last_email', lastSubmittedEmail)
        } else {
            localStorage.removeItem('forgot_password_last_email')
        }
    }, [lastSubmittedEmail])

    // Countdown timer - decrements every second
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            setLastSubmittedEmail(data.email)

            const response = await forgotPasswordEmailVerification(data)

            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Invalid Email Id')
                return
            }

            showToast.success('Email sent. Verify to continue')
            setCountdown(60) // Start countdown after first send
            reset()

        } catch (error) {
            console.log("Something went wrong while sending verification email", error)
            showToast.error('Failed to send email. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleResendEmail = async () => {
        if (!lastSubmittedEmail) {
            showToast.error('Please submit the form first')
            return
        }

        setIsResending(true)
        setResendStatus('idle')

        try {
            const response = await forgotPasswordEmailVerification({ email: lastSubmittedEmail })

            if (response?.data?.success) {
                showToast.success('Email resent successfully')
                setResendStatus('sent')
                setCountdown(60) // Start 60 second countdown
            } else {
                showToast.error(response?.data?.message || 'Failed to resend')
                setResendStatus('failed')
            }
        } catch (error) {
            console.error('Resend error:', error)
            showToast.error(error.response?.data?.message || 'Failed to resend email')
            setResendStatus('failed')
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#EBFFFF] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold">
                        <span className="text-black">MED</span>
                        <span className="text-teal-500">BLOOM</span>
                    </h1>
                </div>

                <h2 className="text-2xl font-semibold text-black text-center mb-6">
                    Reset Your Password
                </h2>
                <p className="text-gray-400 text-center text-m mb-6">
                    Enter your email to receive verification link.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
                    <div>
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            register={register}
                            error={errors?.email}
                            placeholder="Enter your email"
                        />
                    </div>

                    <Button loading={loading} type="submit" className='w-full mb-10 mt-4'>
                        {loading ? "Sending verification link.." : "Send verification link"}
                    </Button>
                </form>

                {/* Show resend section only after first submission */}
                {lastSubmittedEmail && (
                    <>
                        <p className="text-gray-500 text-center text-sm">
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
                        {/* Resend status messages */}
                        {resendStatus === 'sent' && (
                            <p className="text-green-600 text-center  text-sm mt-2">✓ Email sent successfully!</p>
                        )}
                        {resendStatus === 'failed' && (
                            <p className="text-red-600 text-sm mt-2">Failed to send. Please try again.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
