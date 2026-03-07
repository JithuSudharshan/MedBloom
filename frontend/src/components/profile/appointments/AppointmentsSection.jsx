// components/appointments/AppointmentsSection.jsx
import { useState } from "react";
import AppointmentCard from "./AppointmentCard";

const TABS = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsSection({ appointments }) {
    const [activeTab, setActiveTab] = useState("All");

    const filtered = appointments.filter((app) => {
        if (activeTab === "All") return true;
        return app.status === activeTab;
    })

    return (
        <section className="bg-white rounded-3xl shadow-[0_32px_80px_rgba(16,24,40,0.12)] px-10 py-8 w-full">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#006D6F]">
                    My Appointments
                </h2>
                <button className="rounded-full bg-[#008C89] px-6 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#006e6b] transition">
                    Book New Appointment
                </button>
            </div>

            {/* Tabs + sort */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex gap-2">
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

                <button
                    className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-[13px] text-[#9CA3AF]"
                    disabled
                >
                    <span>sort</span>
                </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-5">
                {filtered.map((app) => (
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
                ))}
            </div>

            {/* Pagination (static look) */}
            <div className="mt-8 flex justify-center gap-3 text-[13px]">
                <button className="h-7 w-7 rounded-full bg-[#00B2C9] text-white shadow">
                    1
                </button>
                {[2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        className="h-7 w-7 rounded-full text-[#00B2C9] hover:bg-[#E0F9FF] transition"
                    >
                        {n}
                    </button>
                ))}
            </div>
        </section>
    );
}
