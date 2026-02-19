import React from 'react'


const ServicesCards = ({ icon: Icon, title, description, buttonText }) => {
    return (
        <div className="bg-white rounded-4xl shadow-md p-6 relative overflow-hidden">
            {/* Left Accent Border */}
            <div className="absolute left-0 top-8 bottom-6 w-1.5 bg-teal-500 rounded-full" />

            {/* Icon */}
            <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <Icon size={20} />
            </div>

            {/* Title */}
            <h3 className="text-teal-700 font-semibold mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {description}
            </p>

            {/* Button */}
            <button className="bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                {buttonText}
            </button>
        </div>
    );
}

export default ServicesCards