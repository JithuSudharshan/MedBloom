import Input from './Input'
import PasswordInput from './PasswordInput'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useLogin from '../../hooks/UseLogin'



const LoginForm = ({ selected, isAdmin }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // React Hook Form setup from custom hook
    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useLogin()

    const switchToSignup = (e) => {
        e.preventDefault();
        navigate('/signup', { state: { role: selected } })
    }
    const naviagteToForgotPassword = () => {
        navigate('/forgot-password')
    }

    return (
        <div>
            <form onSubmit={handleSubmit((data) => onSubmit(data, selected, setLoading, isAdmin))} className="flex flex-col gap-3">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors?.email}
                    placeholder="Enter your email"
                    role={selected}
                />
                <PasswordInput
                    label="Password"
                    name="password"
                    register={register}
                    error={errors?.password}
                    placeholder="Enter your password"
                    role={selected}
                />

                {isAdmin ? <></> : <p className={`text-xs font-medium md-3 text-right hover:underline cursor-pointer transition-colors ${selected === "Doctor" ? "text-[#B08B8C]" : "text-teal-600"}`} onClick={naviagteToForgotPassword} >forgot password</p>}


                {isAdmin ? <Button loading={loading} type="submit" role="admin" >{loading ? "Signing in..." : "Sign In as Admin"}</Button>
                    :
                    <Button loading={loading} type="submit" role={selected}>{loading ? "Signing in..." : `Sign In as ${selected}`}</Button>}

            </form>
            {/* Link to login page */}
            {isAdmin ? <></> : <p className="text-sm text-left mt-5 text-gray-600 mt-4">
                Not registered yet? Join now{" "}
                <a href="/signup" onClick={switchToSignup} className={`font-medium hover:underline transition-colors ${selected === "Doctor" ? "text-[#B08B8C]" : "text-teal-500"}`}>
                    Register
                </a>
            </p>}
        </div>
    )
}

export default LoginForm