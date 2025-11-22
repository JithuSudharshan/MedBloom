import Navbar from '../../components/landing page/Navbar';
import HeroSection from '../../components/landing page/HeroSection';
import WhyChooseSection from '../../components/landing page/WhyChooseUs';
import HomePage_image from '../../assets/images/DrImage_homePage.png'
import ServicesSection from '../../components/landing page/ServiceSection';
import VdoCallPromoSection from '../../components/landing page/VdoCallPromoSection';
import PatientReviewPromo from '../../components/landing page/PatientReviewPromo';
import Footer from '../../components/landing page/Footer';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <HeroSection imgSrc={HomePage_image} />
            <WhyChooseSection />
            <ServicesSection />
            <VdoCallPromoSection />
            <PatientReviewPromo />
            <Footer />
        </div>
    );
};

export default HomePage;
