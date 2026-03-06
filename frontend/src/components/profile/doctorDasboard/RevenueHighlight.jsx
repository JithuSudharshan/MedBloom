
export default function RevenueHighlight({ amount }) {
    return (
        <div className="text-right">
            <p className="text-3xl font-bold text-gray-700">
                ₹ {amount.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xl">
                Total Earnings
            </p>
        </div>
    );
}