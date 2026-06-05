import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ConsultationModeChart({ consultationModeRatio }) {
    const data = [
        { name: "Online", value: consultationModeRatio?.online || 0, color: "#14b8a6" },
        { name: "In-Clinic", value: consultationModeRatio?.offline || 0, color: "#f43f5e" },
    ];

    const hasData = data.some(d => d.value > 0);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(176,139,140,0.06)] border border-rose-50 flex flex-col h-full min-h-[360px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-800 font-bold text-lg">Consultation Modes</h3>
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                    📊
                </div>
            </div>

            {!hasData ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    No consultation data available.
                </div>
            ) : (
                <div className="flex-1 relative flex flex-col items-center justify-center">
                    <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-4">
                        {data.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                                <span className="text-sm font-bold text-gray-800 ml-1">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
