export default function RevenueHighlight({ amount }) {
    return (
        <div className="h-full bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex justify-between items-start">
                <p className="text-white/80 font-medium tracking-wide uppercase text-sm">Monthly Earnings</p>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-lg">
                    💰
                </div>
            </div>
            
            <div className="relative z-10 mt-4">
                <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    ₹ {amount?.toLocaleString("en-IN") || "0"}
                </p>
                <p className="text-teal-100 text-sm mt-2 font-medium">
                    +12% from last month
                </p>
            </div>
        </div>
    );
}