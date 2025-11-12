import Input from './Input'
import PasswordInput from './PasswordInput'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useLogin from '../../hooks/UseLogin'

const LoginForm = ({ selected }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // React Hook Form setup from custom hook
    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useLogin()

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
                    placeholder="Enter your password"
                />

                <p className="text-xs font-medium md-3 text-right hover:underline text-teal-600 cursor-pointer " >forgot password</p>

                <Button loading={loading} type="submit">{loading ? "Signing in..." : `Sign In as ${selected}`}</Button>

            </form>
            {/* Link to login page */}
            <p className="text-sm text-left mt-5 text-gray-600 mt-4">
                Not registered yet? Join now{" "}
                <a href="/signup" onClick={switchToSignup} className="text-teal-500 font-medium hover:underline">
                    Register
                </a>
            </p>
        </div>
    )
}

export default LoginForm