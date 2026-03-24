import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";

export default function DashboardMetrics({ isDoctor, metrics }) {
    // [
    //         { label: "Total Appointments", value: 125 },
    //         { label: "Total Consultations", value: 79 }
    //     ]


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15">
            {metrics?.map((metric, index) => (
                <MetricCard
                    key={index}
                    label={metric.label}
                    value={metric.value}
                />
            ))}
        </div>
    );
}