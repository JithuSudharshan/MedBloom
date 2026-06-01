export default function RadioGroup({ label, name, options, register, error, role = "patient" }) {
    const isDoctor = role?.toLowerCase() === 'doctor';
    return (
        <div className="mb-6">
            <label className={`text-sm mb-3 font-medium block transition-colors ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>{label}</label>
            <div className=" gap-4">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-4 cursor-pointer">
                        <input
                            {...register(name)}
                            type="radio"
                            value={option.value}
                            className={`w-4 h-4 border-gray-300 transition-colors focus:ring-2 ${isDoctor ? "text-[#B08B8C] focus:ring-[#B08B8C]" : "text-teal-500 focus:ring-teal-400"}`}
                        />
                        <span className="text-sm text-gray-600">{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
