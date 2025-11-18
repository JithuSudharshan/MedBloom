const ServiceCard = ({ title, description }) => {
    return (
        <div
            className="group relative rounded-3xl p-8 bg-teal-50 transition-all duration-500 ease-in-out hover:shadow-xl"
        >
            {/* Gradient overlay that appears on hover */}
            <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-700 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            ></div>

            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
                {/* Header with Title and Plus Icon */}
                <div className="flex items-center justify-between mb-16">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500">
                        {title}
                    </h3>

                    {/* Plus Icon Button */}
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-600 text-white group-hover:bg-white group-hover:text-teal-700 transition-all duration-500"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600 group-hover:text-white transition-colors duration-500">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ServiceCard;
