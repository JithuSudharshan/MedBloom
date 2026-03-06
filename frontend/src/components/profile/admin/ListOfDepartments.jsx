import { Search, Filter, Plus } from "lucide-react"
import { Pagination } from '../../ui/Pagination'
import DataTable from './TableData'
import { getColumns } from '../../../config/departmentTable'

const ListOfDepartments = ({ openModalForAdding, data, openModalForEditing }) => {

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

        <div className="p-8 bg-white min-h-screen rounded-[32px] shadow-sm border border-slate-100">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    onClick={() => openModalForAdding()}
                >
                    <Plus size={18} />
                    Add new department
                </button>
            </div>

            {/* Search and Filter Row */}
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search department"
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-slate-400 text-sm hover:bg-slate-50 transition-colors">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden px-4 pt-4 pb-8">
                <DataTable columns={tableColumns} rows={data} />
                <Pagination />
            </div>
        </div>
    );
};

export default ListOfDepartments;
