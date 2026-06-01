import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ current = 1, total = 1, onChange = () => { }, userRole = "patient" }) => {
    const isDoctor = userRole === 'doctor';
    
    // Theme colors matching the app's standard
    const activeColor = isDoctor ? "bg-[#6B3B3D] text-white shadow-md border-[#6B3B3D]" : "bg-[#00A4A3] text-white shadow-md border-[#00A4A3]";
    const inactiveColor = "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-gray-200";

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

    const handlePrev = () => {
        if (current > 1) onChange(current - 1);
    };

    const handleNext = () => {
        if (current < total) onChange(current + 1);
    };

    if (total <= 1) return null;

    return (
        <div className="flex flex-col items-center gap-3 mt-6 mb-2">
            <div className="text-sm font-medium text-gray-500">
                Page <span className={isDoctor ? "text-[#6B3B3D] font-bold" : "text-[#00A4A3] font-bold"}>{current}</span> of <span className="font-bold text-gray-700">{total}</span>
            </div>
            <div className="flex justify-center items-center gap-1.5">
                <button
                    type="button"
                    disabled={current === 1}
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onChange(page)}
                            aria-current={page === current ? "page" : undefined}
                            className={`min-w-[36px] h-[36px] px-2 rounded-lg text-sm font-semibold border transition-all duration-200 flex items-center justify-center ${
                                page === current ? activeColor : inactiveColor
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    disabled={current === total}
                    onClick={handleNext}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};