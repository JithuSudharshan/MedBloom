export const Pagination = ({ current = 1, total = 5, onChange }) => {
    const pages = Array.from({ length: total }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onChange?.(page)}
                    className={`h-8 w-8 rounded-full text-sm font-medium ${page === current
                        ? "bg-teal-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};