import React, { useEffect } from 'react'
import Navbar from '../../components/landing page/Navbar'
import HeroSection from '../../components/landing page/HeroSection'
import Footer from '../../components/landing page/Footer'
import findDoctorsImg from "../../assets/images/findDoctors.png"
import SearchBar from '../../components/landing page/SearchBar'
import { useState } from "react";
import { Pagination } from '../../components/ui/Pagination'
import DoctorsGrid from '../../components/landing page/DoctorGrid'
import { fetchDoctorsData } from '../../api/landingPageApi'
import Loader from '../../components/ui/Loading'
import AISymptomChecker from '../../components/landing page/AISymptomChecker'



const FindDoctorsPage = () => {

    const [query, setQuery] = useState("");
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        const fetchDoctorsDetails = async () => {
            try {
                const response = await fetchDoctorsData()
                console.log("response", response)
                setDoctors(response?.data?.data)
            } catch (error) {
                console.error("Failed to fetch doctors:", error)
            }
        }

        fetchDoctorsDetails()
    }, [])

    if (doctors.length === 0) return <Loader />

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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSearch={() => console.log("Searching for:", query)}
            />
            <section className="max-w-7xl mx-auto px-6 py-12">
                <DoctorsGrid doctors={doctors} />
                <Pagination />
            </section>

            <AISymptomChecker />

            <Footer />

        </div>
    )
}

export default FindDoctorsPage