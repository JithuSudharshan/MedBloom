import React, { useState } from "react";

const PasswordInput = ({ label, register, name, error, placeholder }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1 mb-3 relative">
            <label className="text-gray-500 text-xs font-medium">{label}</label>
            <input
                type={show ? "text" : "password"}
                {...register(name, { required: `${label} is required` })}
                placeholder={placeholder}
                className="border border-gray-300 text-gray-500  bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <span
                className="absolute right-3 top-8 text-sm text-gray-500 cursor-pointer"
                onClick={() => setShow(!show)}
            >
                {show ? "Hide" : "Show"}
            </span>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default PasswordInput;
