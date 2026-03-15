import { useMemo } from "react";

export const Pagination = ({ current = 1, total = 1, onChange = () => { } }) => {

    const windowSize = 5;

    const visiblePages = useMemo(() => {
        let start = Math.max(1, current - Math.floor(windowSize / 2));
        let end = start + windowSize - 1;

        if (end > total) {
            end = total;
            start = Math.max(1, end - windowSize + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [current, total]);

    // Prevent invalid page changes
    const handlePrev = () => {
        if (current > 1) onChange(current - 1);
    };

    const handleNext = () => {
        if (current < total) onChange(current + 1);
    };

    if (total <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-6">

            {/* Previous Button */}
            <button
                type="button"
                disabled={current === 1}
                onClick={handlePrev}
                className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Prev
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onChange(page)}
                    aria-current={page === current ? "page" : undefined}
                    className={`h-8 w-8 rounded-full text-sm font-medium ${page === current
                        ? "bg-teal-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                type="button"
                disabled={current === total}
                onClick={handleNext}
                className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next
            </button>

        </div>
    );
};  