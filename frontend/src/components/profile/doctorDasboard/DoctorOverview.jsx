import RevenueHighlight from "./RevenueHighlight";
import ReviewsList from "./ReviewsList";
import DashboardMetrics from "../admin/dashboard/DashboardMetrics";
import TodayAppointments from "./TodayAppointments";
import UpNextBanner from "./UpNextBanner";
import ConsultationModeChart from "./ConsultationModeChart";
import QuickActionHub from "./QuickActionHub";

export default function DoctorOverview({
    doctorName,
    metrics,
    TotalEarnigs,
    monthlyEarnings,
    revenueGrowth,
    TodaysAppointments,
    nextAppointment,
    consultationModeRatio,
    topReviews,
    ratingStats
}) {
    return (
        <div className="min-h-full flex flex-col w-full gap-8">

            {/* Header & UpNext */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-[#6B3B3D] tracking-tight">
                            Service Overview
                        </h2>

                    </div>
                    <UpNextBanner appointment={nextAppointment} />
                </div>

                <div className="xl:col-span-1 flex flex-col items-stretch h-full w-full">
                    <RevenueHighlight amount={monthlyEarnings} growth={revenueGrowth} />
                </div>
            </div>

            {/* Metrics */}
            <div>
                <DashboardMetrics metrics={metrics} theme="doctor" />
            </div>

            {/* Middle Section: Chart & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 min-h-[300px]">
                    <ConsultationModeChart consultationModeRatio={consultationModeRatio} />
                </div>
                <div className="lg:col-span-2 min-h-[300px]">
                    <QuickActionHub />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(176,139,140,0.06)] border border-rose-50 h-full flex flex-col">
                    <h3 className="text-gray-800 font-bold text-lg mb-4">Today's Appointments</h3>
                    <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8D3D4] hover:[&::-webkit-scrollbar-thumb]:bg-[#D4B8B9]">
                        <TodayAppointments appointments={TodaysAppointments} />
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(176,139,140,0.06)] border border-rose-50 h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8D3D4] hover:[&::-webkit-scrollbar-thumb]:bg-[#D4B8B9]">
                        <ReviewsList reviews={topReviews} ratingStats={ratingStats} variant="dashboard" />
                    </div>
                </div>
            </div>

        </div>
    );
}