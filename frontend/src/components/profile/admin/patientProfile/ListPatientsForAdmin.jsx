import React from 'react'
import DataTable from '../TableData';
import { Pagination } from '../../../ui/Pagination';

const ListPatientsForAdmin = ({ patients, page, setPage, totalPages, onViewPatient }) => {
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
        <section className='flex flex-col'>
            <DataTable columns={patientColumns} rows={patients} />
        </section>
    )
}

export default ListPatientsForAdmin