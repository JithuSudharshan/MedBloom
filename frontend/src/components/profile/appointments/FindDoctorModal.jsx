import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import SearchBar from "../../landing page/SearchBar";
import DoctorsGrid from "../../landing page/DoctorGrid";
import { fetchDoctorsData, fetchDepartmentsList } from "../../../api/landingPageApi";
import Loader from "../../ui/Loading";

export default function FindDoctorModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Fetch initial data
    useEffect(() => {
        const fetchDoctorsDetails = async () => {
            if (!isOpen) return; // Only fetch if modal is open to save unnecessary calls

            try {
                setIsLoading(true);
                const [doctorsRes, departmentsRes] = await Promise.all([
                    fetchDoctorsData(),
                    fetchDepartmentsList()
                ]);
                setDoctors(doctorsRes?.data?.data || []);
                setDepartments(departmentsRes?.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctorsDetails();
    }, [isOpen]);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleImmediateSearch = () => {
        setDebouncedSearchTerm(searchTerm);
    };

    // Filtering Logic
    const filteredDoctors = doctors.filter((doctor) => {
        // 1. Department Filter
        if (selectedDepartment !== "All" && doctor.primarySpecialization !== selectedDepartment) {
            return false;
        }

        // 2. Search Filter
        if (!debouncedSearchTerm) return true;

        const term = debouncedSearchTerm.toLowerCase();

        // Safely extract searchable fields
        const name = (doctor.displayName || "").toLowerCase();
        const specialty = (doctor.primarySpecialization || "").toLowerCase();

        // Location might be nested or named differently based on API structure, checking common variations
        const location = (
            doctor.location ||
            doctor.city ||
            doctor.state ||
            doctor.clinicAddress?.city ||
            doctor.clinicAddress?.state ||
            ""
        ).toLowerCase();

        return name.includes(term) || specialty.includes(term) || location.includes(term);
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#f8fafc] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-2xl font-semibold text-[#006D6F]">
                            Find a Specialist
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Search and book appointments with top doctors
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 scrollbar-hide">
                    {/* Search Section */}
                    <div className="mb-6">
                        <SearchBar
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onSearch={handleImmediateSearch}
                        />
                    </div>

                    {/* Department Filter Pills */}
                    {!isLoading && departments.length > 0 && (
                        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedDepartment("All")}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedDepartment === "All"
                                    ? "bg-[#008C89] text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:text-[#008C89] hover:border-teal-200"
                                    }`}
                            >
                                All Departments
                            </button>
                            {departments.map((dept) => (
                                <button
                                    key={dept._id}
                                    onClick={() => setSelectedDepartment(dept.departmentName)}
                                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedDepartment === dept.departmentName
                                        ? "bg-[#008C89] text-white shadow-md"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:text-[#008C89] hover:border-teal-200"
                                        }`}
                                >
                                    {dept.departmentName}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Results Section */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader />
                        </div>
                    ) : filteredDoctors.length > 0 ? (
                        <div className="pb-8">
                            <DoctorsGrid doctors={filteredDoctors} />
                        </div>
                    ) : (
                        /* No Results UI */
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                            <div className="bg-[#eaf6f6] rounded-full p-8 mb-6 shadow-sm border border-[#d0ecec]">
                                <Search className="w-12 h-12 text-[#006666] opacity-70" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-[#004d4d] mb-2">
                                No doctors found matching your search
                            </h3>
                            <p className="text-[#5a7a7a] max-w-md text-[14px] leading-relaxed">
                                We couldn't find any specialists matching "{debouncedSearchTerm}". Try adjusting your keywords or searching a broader location.
                            </p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-6 px-6 py-2 bg-gradient-to-r from-[#006666] to-[#008080] text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-300 active:scale-95"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
