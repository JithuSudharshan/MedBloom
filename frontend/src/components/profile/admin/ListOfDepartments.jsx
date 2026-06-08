import { Search, Plus, Activity, CheckCircle, XCircle } from "lucide-react"
import { Pagination } from '../../ui/Pagination'
import DataTable from './TableData'
import { getColumns } from '../../../config/departmentTable'

const ListOfDepartments = ({ 
    openModalForAdding, 
    data, 
    openModalForEditing,
    page,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    metrics
}) => {

    const handleEdit = (department) => {
        openModalForEditing(department)
    }

    const handleDelete = (department) => {
        if (window.confirm(`Delete ${department.name}?`)) {
            console.log("Deleting:", department.id);
        }
    }

    const tableColumns = getColumns(handleEdit, handleDelete);

    return (
        <div className="p-4 md:p-10 bg-white min-h-[85vh] rounded-[32px] shadow-sm border border-slate-100 flex flex-col min-w-0 w-full shrink-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Departments</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage clinical departments and services</p>
                </div>
                <button 
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
                    onClick={() => openModalForAdding()}
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Department
                </button>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Departments</p>
                        <h3 className="text-2xl font-bold text-slate-800">{metrics?.total || 0}</h3>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active</p>
                        <h3 className="text-2xl font-bold text-slate-800">{metrics?.active || 0}</h3>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Inactive</p>
                        <h3 className="text-2xl font-bold text-slate-800">{metrics?.inactive || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Search and Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search department name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm transition-all"
                    />
                </div>
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                    {['all', 'active', 'inactive'].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setFilter(status);
                                setPage(1);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                                filter === status 
                                ? 'bg-white text-teal-700 shadow-sm border border-slate-200/50' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col min-w-0 w-full overflow-hidden shrink-0">
                <div className="overflow-x-auto min-w-0 w-full">
                    <DataTable columns={tableColumns} rows={data} />
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <Pagination 
                        current={page} 
                        total={totalPages} 
                        onChange={(p) => setPage(p)} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ListOfDepartments;
