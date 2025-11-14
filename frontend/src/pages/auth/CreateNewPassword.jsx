import React, { useEffect } from 'react'
import Button from '../../components/ui/Button'
import PasswordInput from '../../components/form/PasswordInput'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { updateNewPassword } from '../../api/authApi'
import { showToast } from '../../components/ui/Toast'
import { useLocation, useNavigate } from 'react-router-dom'

const CreateNewPassword = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const location = useLocation()
    const navigate = useNavigate(0)

    useEffect(() => {

        const query = new URLSearchParams(location.search)
        const queryEmail = query.get("email")
        if (queryEmail) setEmail(queryEmail)

    }, [location.search])

    const schema = yup.object({
        password: yup.string().min(6, 'Password must be at least 6 chars').required('Password required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm password required')
    }).required()

    const { register,
        handleSubmit,
        formState: { errors },
        reset } = useForm({
            resolver: yupResolver(schema),
            defaultValues: {
                password: '',
                confirmPassword: ''
            }
        })

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            const payload = {
                email,
                ...data
            }

            const response = await updateNewPassword(payload)

            if (!response?.data?.success) {
                showToast.error(response?.data?.message || 'Something went wrong');
                return;
            }
            reset()
            navigate("/login")
            showToast.success('Password updated,Login to continue');

        } catch (error) {
            console.log("Something went wrong while updating password", error)
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
                    Create New Password
                </h2>
                <p className="text-gray-400 text-center text-m mb-6">
                    Enter your new password below
                </p>


                {/* Form */}
                <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4" >
                    {/* Email Label */}
                    <div>
                        <PasswordInput
                            label=" New Password"
                            name="password"
                            register={register}
                            error={errors?.password}
                            placeholder="Create a password"
                        />
                        <PasswordInput
                            label="Confirm Password"
                            name="confirmPassword"
                            register={register}
                            error={errors?.confirmPassword}
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className='w-full mb-10 mt-4'  > {loading ? "loading..." : "Reset Password"}</Button>
                </form>
            </div>
        </div>
    );
};

export default CreateNewPassword;


