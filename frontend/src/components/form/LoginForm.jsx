import Input from './Input'
import PasswordInput from './PasswordInput'
import Button from '../ui/Button'
import useSignup from '../../hooks/UseSignup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const LoginForm = ({ selected }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // React Hook Form setup from custom hook
    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useSignup()

    const switchToSignup = () => {
        navigate('/signup')
    }

    return (
        <div>
            <form onSubmit={handleSubmit((data) => onSubmit(data, selected, setLoading))} className="flex flex-col gap-3">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors?.email}
                    placeholder="Enter your email"
                />
                <PasswordInput
                    label="Password"
                    name="password"
                    register={register}
                    error={errors?.password}
                    placeholder="Create a password"
                />

                <Button loading={loading} type="submit">{loading ? "Signing in..." : `Sign In as ${selected}`}</Button>
                <p className="text-sm font-medium md-3 text-right hover:underline text-teal-600 cursor-pointer " >forgot password</p>
            </form>
            {/* Link to login page */}
            <p className="text-sm text-center mt-5 text-gray-600 mt-4">
                Not registered yet? Join now{" "}
                <a href="/signup" onClick={switchToSignup} className="text-teal-500 font-medium hover:underline">
                    Register
                </a>
            </p>

        </div>
    )
}

export default LoginForm