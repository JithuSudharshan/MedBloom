export default function RevenueHighlight({ amount }) {
    return (
        <div className="h-[110px] flex items-center justify-end pr-2">
            <div className="text-right">
                <p className="text-4xl font-bold text-gray-600">
                    ₹ {amount?.toLocaleString("en-IN")}
                </p>
                <p className="text-gray-400 text-5xl">
                    Monthly Earnings
                </p>
            </div>
        </div>
    );
}