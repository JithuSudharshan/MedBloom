

const Button = ({ children, loading, className = "", ...props }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className={`bg-gradient-to-br from-[#00737A] to-[#00C8C7] text-white rounded-md py-2 hover:bg-teal-600 transition font-medium
            ${loading ? "opacity-60 cursor-not-allowed" : "opacity-100"} 
            ${className}`}
    >
        {children}
    </button>
);

export default Button;