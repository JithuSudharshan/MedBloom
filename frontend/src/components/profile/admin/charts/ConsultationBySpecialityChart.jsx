import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export default function ConsultationBySpecialityChart() {

    const [data, setData] = useState([
        { "name": "ortho", "value": 120 },
        { "name": "cardio", "value": 110 },
        { "name": "Derma", "value": 100 },
        { "name": "Therapy", "value": 90 }
    ]);

    useEffect(() => {
        fetch("/api/consultations-by-speciality")
            .then(res => res.json())
            .then(result => setData(result));
    }, []);

    if (!data.length) {
        return (
            <div className="h-[360px] bg-white rounded-2xl p-6 animate-pulse" />
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 h-[360px]">
            <h3 className="text-gray-500 text-sm mb-4">
                Consultations by Speciality
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Bar
                        dataKey="value"
                        fill="#1db4b9"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}