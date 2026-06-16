import React from 'react'
import Navbar from '../../components/landing page/Navbar'
import HeroSection from '../../components/landing page/HeroSection'
import Footer from '../../components/landing page/Footer'
import whyWeCareImg from "../../assets/images/whyWeCare.png"
import MissionSection from '../../components/landing page/Mission.AboutUs'
import HowItWorks from '../../components/landing page/HowItWorks.AboutUS'
import TrustSafety from '../../components/landing page/TrustSafety.AboutUs'
import { motion } from 'framer-motion';

const PAGE_TRANSITION = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' }
};

const AboutUsPage = () => {
    return (
        <motion.div 
            className="min-h-screen bg-gray-50"
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            transition={PAGE_TRANSITION.transition}
        >
            <Navbar current={"aboutUs"} />
            <HeroSection
                imgSrc={whyWeCareImg}
                title={"WHY WE CARE"}
                para={"To empower patients with easy access to healthcare while helping doctors reach and care for more people - anytime, anywhere."}
            />
            <MissionSection />
            <HowItWorks />
            <TrustSafety />
            <Footer />
        </motion.div>
    )
}

export default AboutUsPage