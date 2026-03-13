import { useMemo } from "react";

export const Pagination = ({ current = 1, total = 1, onChange = () => { } }) => {

    const visiblePages = useMemo(() => {
        const windowSize = 5;

        let start = Math.max(1, current - Math.floor(windowSize / 2));
        let end = start + windowSize - 1;

        if (end > total) {
            end = total;
            start = Math.max(1, end - windowSize + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [current, total]);

    if (total <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-6">

            {/* Previous */}
            <button
                disabled={current === 1}
                onClick={() => onChange(current - 1)}
                className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
            >
                Prev
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onChange(page)}
                    className={`h-8 w-8 rounded-full text-sm font-medium ${page === current
                        ? "bg-teal-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next */}
            <button
                disabled={current === total}
                onClick={() => onChange(current + 1)}
                className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
};