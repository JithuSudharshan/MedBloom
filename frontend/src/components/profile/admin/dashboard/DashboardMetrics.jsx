import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";

export default function DashboardMetrics({ metrics, theme = 'admin' }) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15">
            {metrics?.map((metric, index) => (
                <MetricCard
                    key={index}
                    label={metric.label}
                    value={metric.value || 0}
                    theme={theme}
                />
            ))}
        </div>
    );
}