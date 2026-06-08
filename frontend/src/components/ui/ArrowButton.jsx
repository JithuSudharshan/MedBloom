import React from 'react';
import { ArrowRight } from 'lucide-react';

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
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center ml-1">
                <ArrowRight className="w-4 h-4 text-[#0e7c7b]" strokeWidth={2.5} />
            </div>
        </button>
    );
};

export default ArrowButton;
