import MetricCard from "./MetricCard";



export default function DashboardMetrics({ isDoctor }) {
    const metrics = isDoctor ?

        [
            { label: "Total Appointments", value: 125 },
            { label: "Total Consultations", value: 79 }
        ]

        : [
            { label: "Total Patients", value: 345 },
            { label: "Active Doctors", value: 56 },
            { label: "Today's Appointments", value: 125 },
            { label: "Monthly Appointments", value: 725 },
        ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15">
            {metrics.map((metric, index) => (
                <MetricCard
                    key={index}
                    label={metric.label}
                    value={metric.value}
                />
            ))}
        </div>
    );
}