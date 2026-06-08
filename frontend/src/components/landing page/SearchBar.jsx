import { Search } from "lucide-react";

export default function SearchBar({
    placeholder = "Search by Doctor, Speciality or location...",
    value,
    onChange,
    onSearch,
}) {

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto mt-6"
        >
            <div className="flex items-center bg-white rounded-full border-2 border-teal-600 shadow-inner p-1.5 sm:p-2 w-full">

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 text-[13px] md:text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent px-3 sm:px-4 font-sans truncate"
                />

                <button
                    type="submit"
                    className="ml-2 sm:ml-3 flex items-center justify-center gap-2
                    bg-teal-700
                    text-white text-sm font-medium
                    px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                    transition-all duration-300
                    hover:bg-teal-800 active:scale-95 shrink-0"
                >
                    <Search size={16} />
                    <span className="hidden sm:inline">Search</span>
                </button>

            </div>
        </form>
    );
}