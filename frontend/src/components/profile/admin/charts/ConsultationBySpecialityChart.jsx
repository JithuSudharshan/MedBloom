import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { useEffect, useState } from "react";

export default function ConsultationBySpecialityChart({ graphData }) {

    const [data, setData] = useState(graphData || []);

    useEffect(() => {
        setData(graphData || []);
    }, [graphData]);

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="h-full min-h-[360px] bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,109,111,0.04)] animate-pulse" />
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,109,111,0.06)] p-6 h-full min-h-[360px] border border-white">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-800 font-bold text-lg">
                    Consultations by Speciality
                </h3>
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                    📈
                </div>
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.9} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="4 4" />
                        <XAxis 
                            dataKey="name" 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            dy={10}
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar
                            dataKey="value"
                            fill="url(#colorTeal)"
                            radius={[8, 8, 8, 8]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}