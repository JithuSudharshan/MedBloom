const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-teal-600 text-white hover:bg-teal-700';
            case 'secondary':
                return 'bg-teal-50 text-teal-700 hover:bg-teal-100';
            case 'outline':
                return 'border border-teal-600 text-teal-600 hover:bg-teal-50';
            default:
                return 'bg-teal-600 text-white hover:bg-teal-700';
        }
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-4 py-1.5 text-sm';
            case 'md':
                return 'px-6 py-2.5 text-base';
            case 'lg':
                return 'px-8 py-3 text-lg';
            default:
                return 'px-6 py-2.5 text-base';
        }
    }
    return (
        <button
            type={type}
            onClick={onClick}
            className={`font-medium rounded-full transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
