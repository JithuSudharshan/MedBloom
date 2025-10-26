import Input from './Input'
import PasswordInput from './PasswordInput'
import Button from '../ui/Button'
import useSignup from '../../hooks/UseSignup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SignupForm = ({ selected }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // React Hook Form setup from custom hook
    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useSignup()

    const switchToSignin = () => {
        navigate('/login')
    }

    return (
        <div>
            <form onSubmit={handleSubmit((data) => onSubmit(data, selected, setLoading))} className="flex flex-col gap-3">
                <Input
                    label="Fullname"
                    name="name"
                    register={register}
                    error={errors?.name}
                    placeholder="Enter your full name"
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors?.email}
                    placeholder="Enter your email"
                />
                <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    register={register}
                    error={errors?.phone}
                    placeholder="Enter your phone number"
                />
                <PasswordInput
                    label="Password"
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

                <Button loading={loading} type="submit">{loading ? "Registering..." : `Register as ${selected}`}</Button>
            </form>
            {/* Link to login page */}
            <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <a href="#" onClick={switchToSignin} className="text-teal-500 font-medium hover:underline">
                    Login
                </a>
            </p>

        </div>
    )
}

export default SignupForm