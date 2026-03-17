import { useState, useMemo } from "react";
import AppointmentCard from "./AppointmentCard";
import { Pagination } from "../../ui/Pagination";

const TABS = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsSection({
    appointments = [],
    page,
    totalPages,
    setPage,
}) {

    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAppointments = useMemo(() => {

        return appointments.filter((app) => {

            const matchesTab =
                activeTab === "All" || app.status === activeTab;

            const matchesSearch =
                app.doctorName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                app.speciality
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return matchesTab && matchesSearch;

        });

    }, [appointments, activeTab, searchTerm]);

    return (
        <section className="bg-white rounded-3xl shadow-[0_32px_80px_rgba(16,24,40,0.12)] px-8 py-8 w-full">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#006D6F]">
                    My Appointments
                </h2>

                <button className="rounded-full bg-[#008C89] px-6 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#006e6b] transition">
                    Book New Appointment
                </button>
            </div>

            {/* Search */}


            {/* Tabs */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                    {TABS.map((tab) => {

                        const isActive = tab === activeTab;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-md border px-4 py-2 text-[13px] font-medium transition ${isActive
                                    ? "border-[#008C89] bg-[#008C89] text-white"
                                    : "border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-[#F3F4F6]"
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Appointment List */}
            <div className="flex flex-col gap-5">

                {filteredAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-10">
                        No appointments found
                    </p>
                ) : (
                    filteredAppointments.map((app) => (
                        <AppointmentCard
                            key={app.id}
                            primaryTitle={app.doctorName}
                            secondaryText={app.speciality}
                            dateTimeLabel={app.dateTimeLabel}
                            status={app.status}
                            showFeedback={app.status === "Completed"}
                            onFeedback={() => { }}
                            onViewPrescription={() => { }}
                            onReschedule={() => { }}
                            onCancel={() => { }}
                            onViewDetails={() => { }}
                        />
                    ))
                )}

            </div>

            {/* Pagination */}
            <div className="mt-8">
                <Pagination
                    current={page}
                    total={totalPages}
                    onChange={setPage}
                />
            </div>

        </section>
    );
}