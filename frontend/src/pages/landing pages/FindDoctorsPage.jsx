import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../../components/landing page/Navbar'
import HeroSection from '../../components/landing page/HeroSection'
import Footer from '../../components/landing page/Footer'
import findDoctorsImg from "../../assets/images/findDoctors.png"
import SearchBar from '../../components/landing page/SearchBar'
import SpecialityPills from '../../components/landing page/SpecialityPills'
import { Pagination } from '../../components/ui/Pagination'
import DoctorsGrid from '../../components/landing page/DoctorGrid'
import { fetchDoctorsData, fetchDepartmentsList } from '../../api/landingPageApi'
import Loader from '../../components/ui/Loading'
import AISymptomChecker from '../../components/landing page/AISymptomChecker'
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion';

const PAGE_TRANSITION = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' }
};

const FindDoctorsPage = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [doctors, setDoctors] = useState([])
    const [departments, setDepartments] = useState([]);
    
    // Pagination & Meta
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Advanced Filters
    const [filters, setFilters] = useState({
        speciality: 'All',
        mode: 'both',
        minFee: '',
        maxFee: '',
        sortBy: 'rating'
    });

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch Departments for Dropdown
    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await fetchDepartmentsList();
                if (res.data?.success) {
                    setDepartments(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        getDepartments();
    }, []);

    // Fetch Doctors with Filters
    const fetchDoctorsDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                search: debouncedSearchTerm,
                speciality: filters.speciality,
                mode: filters.mode,
                sortBy: filters.sortBy,
                page,
                limit: 8
            };
            if (filters.minFee) params.minFee = filters.minFee;
            if (filters.maxFee) params.maxFee = filters.maxFee;

            const response = await fetchDoctorsData(params);
            
            // Note: Our updated backend returns { data: { doctors, page, totalPages, totalCount } }
            if (response?.data?.data?.doctors) {
                setDoctors(response.data.data.doctors);
                setTotalPages(response.data.data.totalPages || 1);
            } else if (Array.isArray(response?.data?.data)) {
                // Fallback for old backend response
                setDoctors(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch doctors:", error)
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, filters, page]);

    useEffect(() => {
        fetchDoctorsDetails();
    }, [fetchDoctorsDetails]);

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1); // Reset to page 1 on new search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleImmediateSearch = () => {
        setDebouncedSearchTerm(searchTerm);
        setPage(1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset page on filter change
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
        setFilters({
            speciality: 'All',
            mode: 'both',
            minFee: '',
            maxFee: '',
            sortBy: 'rating'
        });
        setPage(1);
    };

    return (
        <motion.div 
            className="min-h-screen bg-white"
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            transition={PAGE_TRANSITION.transition}
        >
            <Navbar current={"findDoctors"} />

            <HeroSection
                imgSrc={findDoctorsImg}
                title={"S P E C I A L I S T S"}
                para={"Find the right doctor with ease, connect instantly, and get the care you need anytime, anywhere."}
            />

            {/* ================= Main Heading ================= */}
            <h1 className="text-center text-3xl md:text-4xl font-medium leading-snug  text-gray-400 max-w-4xl mx-auto">
                Choose doctors by location, expertise, or time.{" "}
                <br />
                <span className="text-teal-600 font-semibold">
                    Your health journey starts here
                </span>{" "}
            </h1>

            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleImmediateSearch}
            />

            <SpecialityPills 
                departments={departments}
                selected={filters.speciality}
                onChange={(val) => handleFilterChange({ target: { name: 'speciality', value: val } })}
            />
            
            <section className="max-w-7xl mx-auto px-6 py-6 min-h-[400px]">
                
                {/* Advanced Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
                    <div className="flex items-center justify-between lg:hidden mb-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Filters
                        </h3>
                        <button 
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="p-2 bg-gray-100 rounded-lg text-gray-600"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className={`flex-col lg:flex-row gap-4 ${showMobileFilters ? 'flex' : 'hidden lg:flex'}`}>
                        {/* Mode */}
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Consultation Mode</label>
                            <select 
                                name="mode" 
                                value={filters.mode} 
                                onChange={handleFilterChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00A4A3]/20 outline-none"
                            >
                                <option value="both">Any Mode</option>
                                <option value="online">Online / Video</option>
                                <option value="offline">In-Clinic</option>
                            </select>
                        </div>

                        {/* Fee Range */}
                        <div className="flex-[1.5]">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Fee Range (₹)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    name="minFee"
                                    value={filters.minFee}
                                    onChange={handleFilterChange}
                                    placeholder="Min" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00A4A3]/20 outline-none"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    name="maxFee"
                                    value={filters.maxFee}
                                    onChange={handleFilterChange}
                                    placeholder="Max" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00A4A3]/20 outline-none"
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                            <select 
                                name="sortBy" 
                                value={filters.sortBy} 
                                onChange={handleFilterChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00A4A3]/20 outline-none"
                            >
                                <option value="rating">Highest Rated</option>
                                <option value="experience">Most Experienced</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-[#00A4A3] animate-spin" /></div>
                ) : doctors.length > 0 ? (
                    <>
                        <DoctorsGrid doctors={doctors} />
                        <Pagination current={page} total={totalPages} onChange={(p) => setPage(p)} userRole="patient" />
                    </>
                ) : (
                    /* No Results UI with Kerala-authentic earth tone palette */
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="bg-[#eaf6f6] rounded-full p-8 mb-6 shadow-sm border border-[#d0ecec]">
                            <Search className="w-12 h-12 text-[#006666] opacity-70" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-semibold text-[#004d4d] mb-3">
                            No doctors found matching your search
                        </h3>
                        <p className="text-[#5a7a7a] max-w-md text-[15px] leading-relaxed">
                            We couldn't find any specialists matching "{debouncedSearchTerm}". Try adjusting your keywords, checking for typos, or searching a broader location.
                        </p>
                        <button 
                            onClick={clearFilters}
                            className="mt-8 px-8 py-2.5 bg-gradient-to-r from-[#006666] to-[#008080] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 active:scale-95"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </section>

            <AISymptomChecker />

            <Footer />

        </motion.div>
    )
}

export default FindDoctorsPage