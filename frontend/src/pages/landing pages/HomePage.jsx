import Navbar from '../../components/landing page/Navbar';
import HeroSection from '../../components/landing page/HeroSection';
import WhyChooseSection from '../../components/landing page/WhyChooseUs';
import HomePage_image from '../../assets/images/DrImage_homePage.png'
import ServicesSection from '../../components/landing page/ServiceSection';
import VdoCallPromoSection from '../../components/landing page/VdoCallPromoSection';
import PatientReviewPromo from '../../components/landing page/PatientReviewPromo';
import FAQSection from '../../components/landing page/FAQSection';
import Footer from '../../components/landing page/Footer';
import { motion } from 'framer-motion';

const PAGE_TRANSITION = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' }
};

const HomePage = () => {
    return (
        <motion.div 
            className="min-h-screen bg-gray-50"
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            transition={PAGE_TRANSITION.transition}
        >
            <Navbar current={"home"} />
            <HeroSection
                imgSrc={HomePage_image}
                ratingCard={true}
                title={"MEDBLOOM"}
                para={"Smart, patient-first healthcare services that remove waiting, confusion, and inefficiency — connecting you with top doctors through secure consultations, easy scheduling, and digital care tools."}
            />
            <WhyChooseSection />
            <ServicesSection />
            <VdoCallPromoSection />
            <PatientReviewPromo />
            <FAQSection />
            <Footer />
        </motion.div>
    );
};

export default HomePage;
