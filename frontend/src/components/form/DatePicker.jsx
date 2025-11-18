export default function DatePicker({ label, name, register, error }) {
    return (
        <div className="mb-6">
            <label className="text-sm text-teal-700 mb-2 font-medium block">{label}</label>
            <div className="grid grid-cols-3 gap-3">
                <select
                    {...register(`${name}.month`)}
                    className="px-4 py-3 text-gray-600 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm bg-white"
                >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('en', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <select
                    {...register(`${name}.day`)}
                    className="px-4 py-3 text-gray-600 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm bg-white"
                >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
                <select
                    {...register(`${name}.year`)}
                    className="px-4 py-3 text-gray-600 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm bg-white"
                >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        );
                    })}
                </select>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
