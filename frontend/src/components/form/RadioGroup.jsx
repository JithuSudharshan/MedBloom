export default function RadioGroup({ label, name, options, register, error }) {
    return (
        <div className="mb-6">
            <label className="text-sm text-teal-700 mb-3 font-medium block">{label}</label>
            <div className=" gap-4">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-4 cursor-pointer">
                        <input
                            {...register(name)}
                            type="radio"
                            value={option.value}
                            className="w-4 h-4 text-teal-500 border-gray-300  focus:ring-teal-400"
                        />
                        <span className="text-sm text-gray-600">{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
