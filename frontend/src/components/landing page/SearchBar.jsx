import { Search } from "lucide-react";

export default function SearchBar({
    placeholder = "Search by Doctor, Speciality or location...",
    value,
    onChange,
    onSearch,
}) {
    return (
        <div className="w-full max-w-3xl mx-auto my-10">
            <div className="flex items-center bg-white rounded-3xl border-4 border-teal-800 shadow-[0_10px_25px_rgba(0,0,0,0.15)] px-4 py-3">

                {/* Input */}
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 text-sm md:text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />

                {/* Button */}
                <button
                    onClick={onSearch}
                    className="ml-3 flex items-center gap-2 
                    bg-gradient-to-br from-[#003E3E] to-[#00A4A3] 
                     text-white text-sm 
                     font-medium px-5 py-2 
                     rounded-full 
                     transition transition-all
                      duration-300 ease-out
                      hover:scale-110
                       active:scale-90"
                >
                    <Search size={16} />
                    Search
                </button>
            </div>
        </div>
    );
}
