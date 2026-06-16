export default function TextArea({ label, name, register, error, placeholder, rows = 4, role = "patient", maxWords, watch }) {
    const value = watch ? watch(name) || '' : '';
    const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
    const isOverLimit = maxWords && wordCount > maxWords;
    const isDoctor = role?.toLowerCase() === 'doctor';
    
    return (
        <div className="mb-6">
            <label className={`text-sm mb-2 font-medium block transition-colors ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>
                {label}
            </label>
            <textarea
                {...register(name)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 text-gray-600 rounded-lg border focus:outline-none focus:ring-2 transition-shadow
                    ${isDoctor ? "focus:ring-[#B08B8C]" : "focus:ring-teal-400"}
                    ${error || isOverLimit ? 'border-red-400 bg-red-50/30' : 'border-gray-200 bg-white'} text-sm resize-none`}
            />
            {maxWords && (
                <div className={`flex justify-between items-center mt-1.5 text-xs ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                    <span>{error?.message || (isOverLimit ? `Exceeds ${maxWords}-word limit` : '')}</span>
                    <span className={`font-mono font-semibold ${isOverLimit ? 'text-red-500' : wordCount > maxWords * 0.8 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {wordCount} / {maxWords}
                    </span>
                </div>
            )}
            {!maxWords && error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
