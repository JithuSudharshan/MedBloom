import React from 'react'
import DataTable from '../TableData';
import { Pagination } from '../../../ui/Pagination';
import { PatientStats } from './PatientStats';

const ListPatientsForAdmin = ({ patients, page, setPage, totalPages, onViewPatient, patientCount, newPatients = 780, activeVisit = 210 }) => {
    const patientColumns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "gender", header: "Gender" },
        { key: "totalVisits", header: "Total Visits" },
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
            <DataTable columns={patientColumns} rows={patients} />
            <div>
                <Pagination current={page} total={totalPages} onChange={setPage} />
            </div>
        </section>
    )
}

export default ListPatientsForAdmin