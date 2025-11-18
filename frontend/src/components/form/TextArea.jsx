export default function TextArea({ label, name, register, error, placeholder, rows = 4 }) {
    return (
        <div className="mb-6">
            <label className="text-sm text-teal-700 mb-2 font-medium block">{label}</label>
            <textarea
                {...register(name)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 text-gray-600 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400
                    ${error ? 'border-red-400' : 'border-gray-200'} text-sm bg-white resize-none`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
