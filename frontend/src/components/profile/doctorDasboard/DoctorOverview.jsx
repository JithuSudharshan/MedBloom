import RevenueHighlight from "./RevenueHighlight";
import ReviewsList from "./ReviewsList";
import DashboardMetrics from "../admin/dashboard/DashboardMetrics";
import TodayAppointments from "./TodayAppointments";

export default function DoctorOverview({ doctorName, metrics, TotalEarnigs, TodaysAppointments, topReviews }) {
    return (
        <div className="bg-[#FCF5F5] rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_60px_-15px_rgba(176,139,140,0.2)] min-h-full flex flex-col w-full">

            {/* Header */}
            <div className="mb-10 flex flex-col lg:flex-row justify-between lg:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-semibold text-[#6B3B3D]">
                        Service Overview
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Welcome back, <span className="font-semibold text-[#B08B8C]">Dr. {doctorName}</span> 👋
                        Here's a quick overview of your past activity.
                    </p>
                </div>
                <RevenueHighlight amount={TotalEarnigs} />
            </div>

            {/* Metrics */}
            <div className="mb-10">
                <DashboardMetrics metrics={metrics} theme="doctor" />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 min-h-0">
                <div className="overflow-y-auto pr-2 h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8D3D4] hover:[&::-webkit-scrollbar-thumb]:bg-[#D4B8B9]">
                    <TodayAppointments appointments={TodaysAppointments} />
                </div>
                <div className="overflow-y-auto pr-2 h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8D3D4] hover:[&::-webkit-scrollbar-thumb]:bg-[#D4B8B9]">
                    <ReviewsList reviews={topReviews} />
                </div>
            </div>

        </div>
    );
}