import { useState, useEffect } from 'react';
import Button from './Button';

const Navbar = ({ current, userRole = 'patient', onBookNow }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const isDoctor = userRole === 'doctor';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', href: '/homePage', active: current === "home" && true },
        { label: 'About Us', href: '/aboutUs', active: current === "aboutUs" && true },
        { label: 'Services', href: '/services', active: current === "services" && true },
        { label: 'Find Doctors', href: '/doctors', active: current === "findDoctors" && true },
        { label: 'Login', href: '/login', active: current === "login" && true },
        { label: 'Admin', href: '/admin/login', active: current === "adminLogin" && true },
        { label: 'Articles', href: '/articles', active: current === "articles" && true }
    ];

    return (
        <nav 
            className={`sticky top-0 z-50 transition-all duration-300 ease-in-out px-8 ${
                isScrolled 
                    ? `bg-white/30 backdrop-blur-xl py-3 border-b border-white/60 ${isDoctor ? "shadow-[0_8px_30px_rgba(176,139,140,0.12)]" : "shadow-[0_8px_30px_rgba(0,109,111,0.08)]"}` 
                    : "bg-transparent py-4 border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className={`text-2xl font-extrabold tracking-tight ${isDoctor ? "text-[#6B3B3D]" : "text-gray-900"}`}>
                    MEDBLOOM
                </div>

                {/* Navigation Links */}
                <div className={`flex items-center py-1.5 px-3 rounded-full gap-2 transition-all duration-300 ${
                    isDoctor 
                        ? "bg-white/60 backdrop-blur-md border border-[#B08B8C]/15 shadow-[0_4px_20px_rgba(176,139,140,0.08)]" 
                        : "bg-[#DBFFFF] shadow-sm"
                }`}>
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className={`text-[13px] tracking-wide font-semibold transition-all ${
                                link.active
                                    ? `text-white px-5 py-2 rounded-full shadow-md ${isDoctor ? "bg-gradient-to-r from-[#B08B8C] to-[#9D7778]" : "bg-teal-600"}`
                                    : link.label === 'Login'
                                        ? `px-5 py-2 rounded-full shadow-sm ml-2 ${isDoctor ? "bg-white text-[#6B3B3D] border border-rose-100 hover:bg-[#F8E9EA]" : "bg-teal-50 text-teal-700 hover:bg-teal-100"}`
                                        : `text-gray-600 px-4 py-2 rounded-full ${isDoctor ? "hover:text-[#6B3B3D] hover:bg-rose-50/50" : "hover:text-teal-600 hover:bg-white/50"}`
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                {!isDoctor && (
                    <button 
                        onClick={() => {
                            if (onBookNow) {
                                onBookNow();
                            } else {
                                window.location.href = '/doctors';
                            }
                        }}
                        className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg"
                    >
                        Book Now
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
