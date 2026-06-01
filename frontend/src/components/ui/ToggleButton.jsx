import { useState } from "react";

export default function ToggleButtons({ options = [], value, onChange }) {
    return (
        <div className="flex justify-center gap-2 mb-4 bg-white p-1 rounded-full w-max mx-auto shadow-sm">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onChange(option)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300
            ${value === option
                            ? (option === "Doctor" ? "bg-gradient-to-br from-[#6B3B3D] to-[#8C5D5E] text-white" : "bg-gradient-to-br from-[#00737A] to-[#00C8C7] text-white")
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
