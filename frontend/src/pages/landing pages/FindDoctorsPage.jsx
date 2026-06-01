import React, { useEffect, useState } from 'react'
import Navbar from '../../components/landing page/Navbar'
import HeroSection from '../../components/landing page/HeroSection'
import Footer from '../../components/landing page/Footer'
import findDoctorsImg from "../../assets/images/findDoctors.png"
import SearchBar from '../../components/landing page/SearchBar'
import { Pagination } from '../../components/ui/Pagination'
import DoctorsGrid from '../../components/landing page/DoctorGrid'
import { fetchDoctorsData } from '../../api/landingPageApi'
import Loader from '../../components/ui/Loading'
import AISymptomChecker from '../../components/landing page/AISymptomChecker'
import { Search } from 'lucide-react'

const FindDoctorsPage = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [doctors, setDoctors] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        const fetchDoctorsDetails = async () => {
            try {
                const response = await fetchDoctorsData()
                setDoctors(response?.data?.data || [])
            } catch (error) {
                console.error("Failed to fetch doctors:", error)
            } finally {
                setIsLoading(false);
            }
        }

        fetchDoctorsDetails()
    }, [])

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

    if (isLoading) return <Loader />

    return (
        <div className="min-h-screen bg-white">
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
            
            <section className="max-w-7xl mx-auto px-6 py-12 min-h-[400px]">
                {filteredDoctors.length > 0 ? (
                    <>
                        <DoctorsGrid doctors={filteredDoctors} />
                        {/* Only show pagination if there are results */}
                        <Pagination />
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
                            onClick={() => setSearchTerm("")}
                            className="mt-8 px-8 py-2.5 bg-gradient-to-r from-[#006666] to-[#008080] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 active:scale-95"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </section>

            <AISymptomChecker />

            <Footer />

        </div>
    )
}

export default FindDoctorsPage