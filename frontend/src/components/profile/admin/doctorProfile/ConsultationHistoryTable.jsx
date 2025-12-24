const ConsultationHistoryTable = ({ rows = [] }) => {
    const data =
        rows.length > 0
            ? rows
            : [
                { id: 1, name: "Anoop Cherian", age: "56 years", date: "25-10-2025", mode: "Online" },
                { id: 2, name: "Anoop Cherian", age: "54 years", date: "25-10-2025", mode: "Online" },
                { id: 3, name: "Anoop Cherian", age: "58 years", date: "25-10-2025", mode: "Online" },
                { id: 4, name: "Anoop Cherian", age: "56 years", date: "25-10-2025", mode: "Online" },
            ];

    return (
        <section className="border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="px-6 py-3 border-b border-slate-200">
                <p className="text-xs text-[#008989] uppercase tracking-wide">
                    Consultation History
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                    <thead className="bg-slate-50">
                        <tr className="text-slate-400">
                            <th className="text-left font-medium px-6 py-2">Name</th>
                            <th className="text-left font-medium px-4 py-2">Age</th>
                            <th className="text-left font-medium px-4 py-2">
                                Date of Consultation
                            </th>
                            <th className="text-left font-medium px-4 py-2">Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr
                                key={row.id || idx}
                                className={idx % 2 === 1 ? "bg-slate-50/60" : "bg-white"}
                            >
                                <td className="px-6 py-2 text-slate-800">{row.name}</td>
                                <td className="px-4 py-2 text-slate-700">{row.age}</td>
                                <td className="px-4 py-2 text-slate-700">{row.date}</td>
                                <td className="px-4 py-2 text-slate-700">{row.mode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ConsultationHistoryTable;
