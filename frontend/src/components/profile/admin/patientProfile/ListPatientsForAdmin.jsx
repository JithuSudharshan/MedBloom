import React from 'react'
import DataTable from '../TableData';
import { Pagination } from '../../../ui/Pagination';
import { PatientStats } from './PatientStats';

const ListPatientsForAdmin = ({ patients, page, setPage, totalPages, onViewPatient, onBlockPatient, patientCount, newPatients, activeVisit, searchTerm, setSearchTerm }) => {
    const patientColumns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "gender", header: "Gender" },
        {
            key: "totalVisits",
            header: "Total Visits",
            render: (_, patient) => (
                <span className="text-gray-700 font-medium">{patient.totalVisits || 0}</span>
            )
        },
        {
            key: "actions",
            header: "Actions",
            render: (_, patient) => (
                <div className="flex gap-3 text-xs">
                    <button
                        className="text-teal-600 hover:text-teal-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewPatient(patient);
                        }}
                    >
                        View Profile
                    </button>
                    <button
                        className="text-rose-500 hover:text-rose-600"
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
        <section className='max-w-7xl mx-auto px-6'>
            <PatientStats patientCount={patientCount} newPatients={newPatients} activeVisit={activeVisit} />
            
            {/* Search / Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mt-6 mb-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search Patients by name or email...."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset page on search
                        }}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>

            <DataTable columns={patientColumns} rows={patients} />
            <div>
                <Pagination current={page} total={totalPages} onChange={setPage} />
            </div>
        </section>
    )
}

export default ListPatientsForAdmin