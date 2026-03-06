import RevenueHighlight from "./RevenueHighlight";
import ReviewsList from "./ReviewsList";
import DashboardMetrics from "../admin/dashboard/DashboardMetrics";
import TodayAppointments from "./TodayAppointments";

export default function DoctorOverview({ doctorName }) {
    return (
        <div className="bg-cyan-50 rounded-3xl p-8 shadow-lg h-full flex flex-col">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold text-teal-900">
                    Service Overview
                </h2>

                <p className="text-gray-500 mt-2 text-sm">
                    Welcome back, <span className="font-semibold text-teal-700">Dr. {doctorName}</span> 👋
                    Here's a quick overview of your past activity.
                </p>
            </div>

            {/* Metrics + Revenue */}
            <div className="flex flex-col gap-10 mb-12">
                <DashboardMetrics isDoctor={true} />
                <RevenueHighlight amount={45000} />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1">
                <TodayAppointments />
                <ReviewsList />
            </div>

        </div>
    );
}