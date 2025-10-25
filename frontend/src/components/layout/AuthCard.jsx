import React, { useState } from "react";
import Input from "../form/Input";
import PasswordInput from "../form/PasswordInput";
import Button from "../ui/Button";
import OAuthButton from "../form/OAuthButton";
import ToggleButtons from "../ui/ToggleButton";
import useSignup from "../../hooks/UseSignup";

const AuthCard = ({ oneLine }) => {
    const [selected, setSelected] = useState("Patient");
    const [loading, setLoading] = useState(false);
    const [purpose, setPurpose] = useState("sign Up")

    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useSignup()

    const switchToSignin = () => {
        setPurpose("sign In")
    }

    return (
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#EBFFFF] py-10">
            <div className="p-8 w-80 sm:w-96">
                <h1 className="text-6xl font-bold mb-1 text-center">
                    <span className="text-gray-800">MED</span>
                    <span className="text-[#00A4A3]">BLOOM</span>
                </h1>
                <p className="text-gray-500 text-sm text-center mb-4">
                    {oneLine}
                </p>

                <ToggleButtons
                    options={["Patient", "Doctor"]}
                    value={selected}
                    onChange={setSelected}
                />

                <OAuthButton />
                <div className="flex items-center my-3">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-2 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

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

                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <a href="#" onClick={switchToSignin} className="text-teal-500 font-medium hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div >
    );
};
export default AuthCard;
