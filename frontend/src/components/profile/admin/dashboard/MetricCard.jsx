export default function MetricCard({ label, value, theme = 'admin' }) {
    const isDoctor = theme === 'doctor';
    
    // Pick an icon based on label (simple heuristic)
    const getIcon = () => {
        if (label.toLowerCase().includes('patient')) return "👤";
        if (label.toLowerCase().includes('doctor')) return "🩺";
        if (label.toLowerCase().includes('appointment')) return "📅";
        return "📊";
    };
    
    return (
        <div className="bg-white rounded-2xl h-[120px] w-full p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,109,111,0.06)] border border-white hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start">
                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isDoctor ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-600"}`}>
                    {getIcon()}
                </div>
            </div>
            <p className={`text-4xl font-extrabold tracking-tight ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>
                {value}
            </p>
        </div>
    );
}