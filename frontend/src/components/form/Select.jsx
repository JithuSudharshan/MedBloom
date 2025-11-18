export default function Select({ label, name, register, error, placeholder, options }) {
    return (
        <div className="mb-6">
            <label className="text-sm text-teal-700 mb-2 font-medium block">{label}</label>
            <select
                {...register(name)}
                className={`w-full px-4 py-3 text-gray-600 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400
                    ${error ? 'border-red-400' : 'border-gray-200'} text-sm bg-white appearance-none`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
