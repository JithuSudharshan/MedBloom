export default function TextArea({ label, name, register, error, placeholder, rows = 4, role = "patient" }) {
    const isDoctor = role?.toLowerCase() === 'doctor';
    return (
        <div className="mb-6">
            <label className={`text-sm mb-2 font-medium block transition-colors ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>{label}</label>
            <textarea
                {...register(name)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 text-gray-600 rounded-lg border focus:outline-none focus:ring-2 transition-shadow
                    ${isDoctor ? "focus:ring-[#B08B8C]" : "focus:ring-teal-400"}
                    ${error ? 'border-red-400' : 'border-gray-200'} text-sm bg-white resize-none`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
