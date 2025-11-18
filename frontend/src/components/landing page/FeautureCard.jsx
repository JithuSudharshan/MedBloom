const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-teal-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-teal-100">
            {/* Icon */}
            <div className="bg-teal-500 w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-md">
                <span className="text-white text-2xl">{icon}</span>
            </div>

            {/* Title */}
            <h3 className="text-teal-900 font-bold text-xl mb-3">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    )
}

export default FeatureCard;
