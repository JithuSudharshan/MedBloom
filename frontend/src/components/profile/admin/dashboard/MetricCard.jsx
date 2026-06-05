export default function MetricCard({ label, value, theme = 'admin' }) {
    const isDoctor = theme === 'doctor';
    
    // Pick an icon based on label (simple heuristic)
    const getIcon = () => {
        if (label.toLowerCase().includes('patient')) return "👤";
        if (label.toLowerCase().includes('doctor')) return "🩺";
        if (label.toLowerCase().includes('appointment')) return "📅";
        if (label.toLowerCase().includes('consultation')) return "💬";
        return "📊";
    };
    
    return (
        <div className={`bg-white rounded-3xl h-[130px] w-full p-6 flex flex-col justify-between shadow-sm hover:shadow-md border border-white hover:-translate-y-1 transition-all duration-300 ${isDoctor ? "hover:border-rose-100" : "hover:border-teal-100"}`}>
            <div className="flex justify-between items-start">
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${isDoctor ? "bg-rose-50 text-rose-500" : "bg-teal-50 text-teal-600"}`}>
                    {getIcon()}
                </div>
            </div>
            <p className={`text-4xl font-extrabold tracking-tight ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>
                {value}
            </p>
        </div>
    );
}