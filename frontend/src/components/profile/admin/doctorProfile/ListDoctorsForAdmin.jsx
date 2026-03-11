import { useState } from "react";
import Button from "../../../ui/Button";
import Button2 from "../../../landing page/Button";
import { Pagination } from "../../../ui/Pagination";
import { DoctorRow } from "../../DoctorRow";


const StatCard = ({ label, value, actionLabel, onAction }) => {


    return (
        <div className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-8 py-5 border border-slate-100">
            <div>
                <p className="text-sm text-teal-600 font-medium">{label}</p>
                <p className="mt-1 text-3xl font-semibold text-slate-800">{value}</p>
            </div>
            {actionLabel && (
                <Button2
                    size="sm"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button2>
            )}
        </div>
    );
}

const ListDoctorsForAdmin = ({
    handleOpenApproval,
    viewDetails,
    onOpenBlock,
    onOpenUnblock,
    page,
    setPage,
    doctors,
    totalPages,
    doctorsCount,
    pendingCount
}) => {
    const [search, setSearch] = useState("");

    const filteredDoctors = doctors.filter((doc) =>
        doc.displayName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Doctors</h1>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard label="Approved Doctors" value={doctorsCount} />
                <StatCard label="To approve" value={pendingCount} actionLabel="View" onAction={handleOpenApproval} />
            </div>

            {/* Search / filter / add */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mt-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search Doctors by name...."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <span>Filter</span>
                </button>

                <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium">
                    Add Doctor
                </Button>
            </div>

            {/* Doctor list */}
            <div className="mt-4">
                {filteredDoctors.map((doctor) => (
                    <DoctorRow
                        key={doctor._id}
                        doctor={doctor}
                        onOpenBlock={onOpenBlock}
                        onOpenUnblock={onOpenUnblock}
                        viewDetails={viewDetails}
                    />
                ))}
            </div>
            <div>
                <Pagination current={page} total={totalPages} onChange={setPage} />
            </div>

        </div>
    );
};

export default ListDoctorsForAdmin;
