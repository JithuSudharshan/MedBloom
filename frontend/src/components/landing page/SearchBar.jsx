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
            <div className="flex items-center bg-white rounded-full border-2 border-teal-600 shadow-inner px-2 py-2">

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 text-sm md:text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent px-4 font-sans"
                />

                <button
                    type="submit"
                    className="ml-3 flex items-center gap-2
                    bg-teal-700
                    text-white text-sm font-medium
                    px-6 py-2.5 rounded-full
                    transition-all duration-300
                    hover:bg-teal-800 active:scale-95"
                >
                    <Search size={16} />
                    Search
                </button>

            </div>
        </form>
    );
}