export default function MetricCard({ label, value, theme = 'admin' }) {
    const isDoctor = theme === 'doctor';
    
    return (
        <div className={`${
            isDoctor ? "bg-[#B08B8C]" : "bg-teal-500"
        } text-white rounded-md h-[110px] w-[160px] flex flex-col items-center justify-center shadow-sm`}>
            <p className="text-sm font-medium opacity-90">{label}</p>
            <p className="text-4xl font-extrabold mt-1">{value}</p>
        </div>
    );
}