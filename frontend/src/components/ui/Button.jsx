import React from "react";

const Button = ({ children, ...props }) => (
    <button
        {...props}
        className="bg-gradient-to-br from-[#00737A] to-[#00C8C7] bg-gra text-white rounded-md py-2 hover:bg-teal-600 transition font-medium"
    >
        {children}
    </button>
);

export default Button;
