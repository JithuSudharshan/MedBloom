import React from 'react'
import DataTable from '../TableData';
import { Pagination } from '../../../ui/Pagination';
import { PatientStats } from './PatientStats';
import { Search } from "lucide-react";

const ListPatientsForAdmin = ({ patients, page, setPage, totalPages, onViewPatient, onBlockPatient, patientCount, newPatients, activeVisit, searchTerm, setSearchTerm }) => {
    const patientColumns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "gender", header: "Gender", render: (val) => <span className="capitalize">{val}</span> },
        {
            key: "totalVisits",
            header: "Total Visits",
            render: (_, patient) => (
                <span className="text-slate-700 font-medium">{patient.totalVisits || 0}</span>
            )
        },
        {
            key: "actions",
            header: "Actions",
            render: (_, patient) => (
                <div className="flex gap-3 text-xs font-medium">
                    <button
                        className="text-teal-600 hover:underline hover:text-teal-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewPatient(patient);
                        }}
                    >
                        View Profile
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        className="text-rose-500 hover:underline hover:text-rose-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBlockPatient(patient);
                        }}
                    >
                        {patient.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                </div>
            ),
        },
    ]
    return (
        <div className="p-4 md:p-10 bg-white min-h-[85vh] rounded-[32px] shadow-sm border border-slate-100 flex flex-col min-w-0 w-full shrink-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patients Directory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and monitor all registered patients.</p>
                </div>
            </div>

            {/* Metrics Section */}
            <PatientStats patientCount={patientCount} newPatients={newPatients} activeVisit={activeVisit} />
            
            {/* Search Row */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patients by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset page on search
                        }}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm transition-all"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col min-w-0 w-full overflow-hidden shrink-0">
                <div className="overflow-x-auto min-w-0 w-full">
                    <DataTable columns={patientColumns} rows={patients} />
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <Pagination current={page} total={totalPages} onChange={setPage} />
                </div>
            </div>
        </div>
    )
}

export default ListPatientsForAdmin