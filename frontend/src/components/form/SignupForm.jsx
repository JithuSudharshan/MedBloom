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

    const switchToSignin = (e) => {
        e.preventDefault();
        navigate('/login', { state: { role: selected } })
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
                    role={selected}
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors?.email}
                    placeholder="Enter your email"
                    role={selected}
                />
                <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    register={register}
                    error={errors?.phone}
                    placeholder="Enter your phone number"
                    role={selected}
                />
                <PasswordInput
                    label="Password"
                    name="password"
                    register={register}
                    error={errors?.password}
                    placeholder="Create a password"
                    role={selected}
                />
                <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    register={register}
                    error={errors?.confirmPassword}
                    placeholder="Confirm your password"
                    role={selected}
                />

                <Button loading={loading} type="submit" role={selected}>{loading ? "Registering..." : `Register as ${selected}`}</Button>
            </form>
            {/* Link to login page */}
            <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <a href="/login" onClick={switchToSignin} className={`font-medium hover:underline transition-colors ${selected === "Doctor" ? "text-[#B08B8C]" : "text-teal-500"}`}>
                    Login
                </a>
            </p>

        </div>
    )
}

export default SignupForm