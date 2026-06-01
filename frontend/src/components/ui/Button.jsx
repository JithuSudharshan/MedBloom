

const Button = ({ children, loading, className = "", role = "patient", ...props }) => {
    const isDoctor = role?.toLowerCase() === 'doctor';

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`relative overflow-hidden rounded-md py-2 font-medium transition-all duration-500 hover:shadow-md ${className} ${loading ? "opacity-60 cursor-not-allowed" : "opacity-100"}`}
        >
            {/* Patient Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#00737A] to-[#00C8C7] transition-opacity duration-500 hover:opacity-90 ${isDoctor ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Doctor Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#6B3B3D] to-[#8C5D5E] transition-opacity duration-500 hover:opacity-90 ${isDoctor ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Button Content */}
            <span className="relative z-10 text-white transition-all duration-300">
                {children}
            </span>
        </button>
    );
};

export default Button;