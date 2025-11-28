import React, { useState } from "react";

const PasswordInput = ({ label, register, name, error, placeholder }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-6 relative">
            {label && (
                <label className="text-sm text-teal-700 mb-2 font-medium block">
                    {label}
                </label>
            )}
            <input
                type={show ? "text" : "password"}
                {...register(name)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 text-gray-600 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400
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
