export default function Input({ label, name, register, error, placeholder, type = 'text' }) {
    return (
        <div className="mb-3">
            {label && <label className="text-xs text-gray-500 mb-1 font-medium block">{label}</label>}
            <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className={`w-full px-3 py-2 text-gray-500 rounded-md border focus:outline-none focus:ring-1 focus:ring-teal-400
          ${error ? 'border-red-400' : 'border-gray-200'} text-sm bg-white`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
