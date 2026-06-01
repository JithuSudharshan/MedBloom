import React, { useState } from "react";

const PasswordInput = ({ label, register, name, error, placeholder, role = "patient" }) => {
    const isDoctor = role?.toLowerCase() === 'doctor';
    const [show, setShow] = useState(false);

    return (
        <div className="mb-6 relative">
            {label && (
                <label className={`text-sm mb-2 font-medium block transition-colors ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>
                    {label}
                </label>
            )}
            <input
                type={show ? "text" : "password"}
                {...register(name)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 text-gray-600 rounded-lg border focus:outline-none focus:ring-2 transition-shadow
          ${isDoctor ? "focus:ring-[#B08B8C]" : "focus:ring-teal-400"}
          ${error ? "border-red-400" : "border-gray-200"} text-sm bg-white`}
            />
            <span
                className="absolute right-3 top-11 text-sm text-gray-500 cursor-pointer"
                onClick={() => setShow(!show)}
            >
                {show ? "Hide" : "Show"}
            </span>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default PasswordInput;
