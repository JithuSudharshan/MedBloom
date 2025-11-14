import React from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/form/Input'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { forgotPasswordEmailVerification } from '../../api/authApi'
import { showToast } from '../../components/ui/Toast'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)

    const schema = yup.object({
        email: yup.string().email('Invalid email').required('Email is required')
    }).required()

    const { register,
        handleSubmit,
        formState: { errors },
        reset } = useForm({
            resolver: yupResolver(schema),
            defaultValues: {
                email: ''
            }
        })

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await forgotPasswordEmailVerification(data)

            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Invalid Email Id');
                return;
            }
            showToast.success('Email send,Verify to continue');
            reset()

        } catch (error) {
            console.log("Something went wrong while sending verification email", error)
        } finally {
            setLoading(false)
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
                <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4" >
                    {/* Email Label */}
                    <div>
                        <Input
                            label={"Email"}
                            name={'email'}
                            type="email"
                            register={register}
                            error={errors?.email}
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className='w-full mb-10 mt-4'  > {loading ? "Sending verification link.." : "Send verification link"}</Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
