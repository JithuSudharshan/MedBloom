import ConsultationBySpecialityChart from "../charts/ConsultationBySpecialityChart";
import DashboardMetrics from "./DashboardMetrics";
import RevenueHighlight from "./RevenueHighlight";
import TopDoctorsList from "./TopDoctorsList";

export default function ServiceOverview() {
    const doctors = [
        {
            id: 1,
            name: "Dr. Arathy Krishna",
            avatar: "https://i.pravatar.cc/40",
        },
        {
            id: 2,
            name: "Dr. Jayadeep Sunil",
            avatar: "https://i.pravatar.cc/41",
        },
        {
            id: 3,
            name: "Dr. Chritina Raichel",
            avatar: "https://i.pravatar.cc/42",
        },
        {
            id: 4,
            name: "Dr. Gahana EV",
            avatar: "https://i.pravatar.cc/43",
        },
        {
            id: 5,
            name: "Dr. Jagan Laal",
            avatar: "https://i.pravatar.cc/44",
        },
    ];

    return (
        <div className="bg-cyan-50 rounded-3xl p-6 shadow-lg">
            {/* Title */}
            <h2 className="text-teal-700 text-3xl font-semibold mb-6">
                Service Overview
            </h2>

            {/* Metrics */}
            <div className="flex items-start justify-between mb-10">
                <DashboardMetrics />
            </div>

            {/* Revenue */}
            <div>
                <RevenueHighlight amount={45000} />
            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-30">
                <div>
                    <h3 className="text-gray-500 font-semibold mb-4">Top Rated Doctors</h3>
                    <TopDoctorsList doctors={doctors} />
                </div>

                <div>
                    <h3 className="text-teal-700 font-semibold mb-4">
                        Top Consulted Specialities
                    </h3>
                    <ConsultationBySpecialityChart />
                </div>
            </div>
        </div>
    );
}