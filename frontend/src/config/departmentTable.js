export const getColumns = (onEdit, onDelete) => [

    { header: "Department", key: "departmentName" },
    {
        header: "No of Doctor's",
        key: "doctorCount",
        render: (val) => <span className="text-slate-500">{val} Doctors</span>
    },
    {
        header: "Current Status",
        key: "status",
        render: (status) => (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                }`}>
                {status}
            </span>
        )
    },
    {
        header: "Actions",
        key: "actions",
        render: (_, row) => (
            <div className="flex gap-2 text-xs font-medium">
                <button
                    className="text-teal-600 hover:underline"
                    onClick={() => onEdit(row)}
                >
                    edit
                </button>

                <span className="text-slate-300">/</span>

                <button
                    className="text-red-500 hover:underline"
                    onClick={() => onDelete(row)}
                >
                    delete
                </button>
            </div>
        )
    },
];