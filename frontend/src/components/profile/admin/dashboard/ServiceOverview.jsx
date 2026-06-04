import ConsultationBySpecialityChart from "../charts/ConsultationBySpecialityChart";
import DashboardMetrics from "./DashboardMetrics";
import RevenueHighlight from "./RevenueHighlight";
import TopDoctorsList from "./TopDoctorsList";

export default function ServiceOverview({ metrics, MonthlyEarnings, revenueGrowth, TopRatedDoctors, graphData }) {

    return (
        <div className="bg-slate-50/50 rounded-3xl p-8 border border-gray-100">
            {/* Title */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-gray-800 text-3xl font-bold tracking-tight">
                        Dashboard Overview
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Top Row: Revenue Highlight (1 col) and Metrics (2 cols) */}
                <div className="lg:col-span-1 h-full">
                    <RevenueHighlight amount={MonthlyEarnings} growth={revenueGrowth} />
                </div>
                <div className="lg:col-span-2">
                    <DashboardMetrics metrics={metrics} />
                </div>

                {/* Bottom Row: Charts and Lists */}
                <div className="lg:col-span-2">
                    <ConsultationBySpecialityChart graphData={graphData} />
                </div>
                
                <div className="lg:col-span-1">
                    <TopDoctorsList doctors={TopRatedDoctors} />
                </div>
            </div>
        </div>
    );
}