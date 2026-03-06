export default function MetricCard({ label, value }) {
    return (
        <div className="bg-teal-500 text-white rounded-md h-[110px] w-[160px] flex flex-col items-center justify-center shadow-sm">
            <p className="text-sm font-medium opacity-90">{label}</p>
            <p className="text-4xl font-extrabold mt-1">{value}</p>
        </div>
    );
}