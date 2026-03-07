const DataTable = ({ columns, rows, onRowClick }) => {

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden h-full">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">

                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-6 text-center text-sm text-slate-500"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, rowIndex) => (
                                <tr
                                    key={row.id || row._id || rowIndex}
                                    className="border-t border-slate-100 hover:bg-slate-50"
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-6 py-3 text-slate-700 text-sm"
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : row[col.key] ?? "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default DataTable;
