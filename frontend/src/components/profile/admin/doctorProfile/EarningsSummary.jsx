const EarningsSummary = ({ monthlyEarnings = 23352, totalEarnings = 323352 }) => {
    return (
        <section className="border border-slate-200 rounded-xl px-6 py-4 flex items-center justify-between mb-4">
            <div>
                <p className="text-xs text-[#008989] uppercase tracking-wide">
                    Monthly Earnings
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                    ₹ {monthlyEarnings.toLocaleString("en-IN")}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-[#008989] uppercase tracking-wide">
                    Total Earnings
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                    ₹ {totalEarnings.toLocaleString("en-IN")}
                </p>
            </div>
        </section>
    );
};

export default EarningsSummary;
