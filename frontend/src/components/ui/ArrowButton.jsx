import React from 'react';

const ArrowButton = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-300 hover:-translate-y-0.5 shadow-md";

    const variants = {
        primary: "bg-[#0e7c7b] text-white hover:bg-[#0a5f5e]",
        secondary: "bg-[#00bfa6] text-white hover:bg-[#00a892]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path d="M10 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
};

export default ArrowButton;
