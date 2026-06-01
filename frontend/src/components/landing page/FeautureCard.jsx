const FeatureCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="group bg-white rounded-3xl p-8 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 border border-gray-100 hover:border-teal-100 relative overflow-hidden flex flex-col h-full">
            {/* Subtle background glow on hover */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            {/* Icon Container */}
            <div className="bg-teal-50/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10">
                <Icon className="text-teal-600 group-hover:text-white w-8 h-8 transition-colors duration-300" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="text-gray-900 font-bold text-xl mb-3 relative z-10 group-hover:text-teal-700 transition-colors duration-300">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-base leading-relaxed relative z-10 flex-grow">
                {description}
            </p>
        </div>
    )
}

export default FeatureCard;
