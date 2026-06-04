import React from 'react';
import DataTable from '../../admin/TableData'; // Reusing your beautiful TableData
import { Pagination } from '../../../ui/Pagination';
import { PatientStats } from './PatientStats';

const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const DoctorPatientsList = ({ 
    patients, 
    page, 
    setPage, 
    totalPages, 
    patientCount, 
    newPatients, 
    activeVisit, 
    searchTerm, 
    setSearchTerm 
}) => {
    
    const patientColumns = [
        { 
            key: "profileUrl", 
            header: "Patient", 
            render: (_, patient) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={patient.profileUrl || "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg="} 
                        alt={patient.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{patient.name}</span>
                        <span className="text-xs text-gray-500">{patient.email}</span>
                    </div>
                </div>
            )
        },
        { 
            key: "gender", 
            header: "Gender / Blood",
            render: (_, patient) => (
                <div className="flex flex-col">
                    <span className="text-gray-700 capitalize">{patient.gender || "N/A"}</span>
                    <span className="text-xs font-medium text-rose-500">{patient.bloodGroup || "N/A"}</span>
                </div>
            )
        },
        {
            key: "totalVisits",
            header: "Total Visits",
            render: (_, patient) => (
                <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-100">
                    {patient.totalVisits || 0} Visits
                </span>
            )
        },
        {
            key: "lastVisit",
            header: "Last Visit",
            render: (_, patient) => (
                <span className="text-gray-600 text-sm">
                    {patient.lastVisit ? formatDateShort(patient.lastVisit) : "N/A"}
                </span>
            )
        },
        {
            key: "actions",
            header: "Actions",
            render: (_, patient) => (
                <div className="flex gap-3 text-xs">
                    <button
                        className="px-4 py-2 bg-white text-teal-600 hover:bg-teal-50 border border-teal-200 rounded-lg font-medium transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Future scope: Open a drawer with Patient Medical History
                            console.log("View patient records for", patient.name);
                        }}
                    >
                        View History
                    </button>
                </div>
            ),
        },
    ];

    return (
        <section className='max-w-7xl mx-auto px-2 md:px-6 w-full animate-fade-in'>
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Patients</h2>
                <p className="text-gray-500">Manage and view your patient roster and their medical history.</p>
            </div>

            <PatientStats 
                patientCount={patientCount} 
                newPatients={newPatients} 
                activeVisit={activeVisit} 
            />
            
            {/* Search / Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mt-8 mb-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search Patients by name or email...."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset page on search
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                    />
                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable columns={patientColumns} rows={patients} />
            </div>
            
            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination current={page} total={totalPages} onChange={setPage} />
                </div>
            )}
        </section>
    );
};

export default DoctorPatientsList;
