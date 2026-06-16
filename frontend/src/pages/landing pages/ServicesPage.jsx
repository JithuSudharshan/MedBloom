import React from 'react'
import Navbar from '../../components/landing page/Navbar'
import HeroSection from '../../components/landing page/HeroSection'
import Footer from '../../components/landing page/Footer'
import ServicesImg from "../../assets/images/Services.png"
import ServicesSection from '../../components/landing page/ServicesSection.services'
import CTASection from '../../components/landing page/CTASection'
import { motion } from 'framer-motion';

const PAGE_TRANSITION = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' }
};

const ServicesPage = () => {
    return (
        <motion.div 
            className="min-h-screen bg-white"
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            transition={PAGE_TRANSITION.transition}
        >
            <Navbar current={"services"} />

            <HeroSection
                imgSrc={ServicesImg}
                title={"S E R V I C E S"}
                para={"To empower patients with easy access to healthcare while helping doctors reach and care for more people - anytime, anywhere."}
            />

            {/* ================= Main Heading ================= */}
            <h1 className="text-center text-3xl md:text-4xl font-medium leading-snug  text-gray-400 max-w-4xl mx-auto">
                Comprehensive{" "}
                <span className="text-teal-600 font-semibold">
                    healthcare
                </span>{" "}
                solutions designed
                <br />
                to make your experience seamless and
                <br />
                effective.
            </h1>

            <ServicesSection />
            <CTASection />
            <Footer />
        </motion.div>
    )
}

export default ServicesPage