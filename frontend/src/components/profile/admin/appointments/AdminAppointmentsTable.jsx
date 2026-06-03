import React, { useState, useMemo } from 'react';
import { Pagination } from "../../../ui/Pagination";

const TABS = ["All", "confirmed", "completed", "cancelled"];

export default function AdminAppointmentsTable({
    appointments = [],
    page,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
}) {


    const statusStyles = {
        completed: "bg-emerald-100 text-emerald-700",
        upcoming: "bg-blue-100 text-blue-700",
        cancelled: "bg-red-100 text-red-700",
        confirmed: "bg-blue-100 text-blue-700",
        pending_payment: "bg-yellow-100 text-yellow-700",
        rescheduled: "bg-purple-100 text-purple-700"
    };

    return (
        <section className="bg-white rounded-[2rem] px-8 py-10 w-full flex-1 flex flex-col shadow-sm border border-slate-100">
            {/* Header & Search */}
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-[20px] font-semibold text-slate-800">
                    Appointments Log
                </h2>
                <div className="w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search by Patient, Doctor or ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset page on search
                        }}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 flex-wrap">
                {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setPage(1); // Reset page on tab change
                            }}
                            className={`rounded-md border px-4 py-2 text-[13px] font-medium transition capitalize ${
                                isActive
                                    ? "border-teal-600 bg-teal-600 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-4 rounded-tl-xl">ID</th>
                            <th className="px-4 py-4">Patient</th>
                            <th className="px-4 py-4">Doctor</th>
                            <th className="px-4 py-4">Speciality</th>
                            <th className="px-4 py-4">Date & Time</th>
                            <th className="px-4 py-4 rounded-tr-xl">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-slate-400">
                                    No appointments found.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((app) => (
                                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                    <td className="px-4 py-4 font-mono text-xs text-slate-400">
                                        {app.appointmentId || app.id.slice(-6)}
                                    </td>
                                    <td className="px-4 py-4 font-medium text-slate-800">
                                        {app.patientName}
                                    </td>
                                    <td className="px-4 py-4 text-slate-700">
                                        {app.doctorName}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                                            {app.speciality}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {app.dateTimeLabel}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[app.status] || "bg-slate-100 text-slate-700"}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
