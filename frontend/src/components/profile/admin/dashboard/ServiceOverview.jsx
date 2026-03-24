import ConsultationBySpecialityChart from "../charts/ConsultationBySpecialityChart";
import DashboardMetrics from "./DashboardMetrics";
import RevenueHighlight from "./RevenueHighlight";
import TopDoctorsList from "./TopDoctorsList";

export default function ServiceOverview({ metrics, MonthlyEarnings, TopRatedDoctors, graphData }) {

    return (
        <div className="bg-cyan-50 rounded-3xl p-6 shadow-lg">
            {/* Title */}
            <h2 className="text-teal-700 text-3xl font-semibold mb-6">
                Service Overview
            </h2>

            {/* Metrics */}
            <div className="flex items-start justify-between mb-10">
                <DashboardMetrics metrics={metrics} />
            </div>

            {/* Revenue */}
            <div>
                <RevenueHighlight amount={MonthlyEarnings} />
            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-30">
                <div>
                    <h3 className="text-gray-500 font-semibold mb-4">Top Rated Doctors</h3>
                    <TopDoctorsList doctors={TopRatedDoctors} />
                </div>

                <div>
                    <h3 className="text-teal-700 font-semibold mb-4">
                        Top Consulted Specialities
                    </h3>
                    <ConsultationBySpecialityChart graphData={graphData} />
                </div>
            </div>
        </div>
    );
}