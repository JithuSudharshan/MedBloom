import { useState, useEffect } from 'react';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ current, userRole = 'patient', onBookNow }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const isDoctor = userRole === 'doctor';
    const isAdmin = userRole === 'admin' || window.location.pathname.startsWith('/admin');
    const navigate = useNavigate();

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
        { label: 'Admin', href: '/admin/login', active: current === "adminLogin" && true }
    ];

    return (
        <nav 
            className={`sticky top-0 z-50 transition-all duration-300 ease-in-out px-8 ${
                isAdmin ? 'hidden lg:block' : ''
            } ${
                isScrolled 
                    ? `bg-white/90 backdrop-blur-xl py-3 border-b border-white/60 ${isDoctor ? "shadow-[0_8px_30px_rgba(176,139,140,0.12)]" : "shadow-[0_8px_30px_rgba(0,109,111,0.08)]"}` 
                    : "bg-transparent py-4 border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className={`text-2xl font-extrabold tracking-tight ${isDoctor ? "text-[#6B3B3D]" : "text-gray-900"}`}>
                    MEDBLOOM
                </div>

                {/* Navigation Links */}
                <div className={`hidden lg:flex items-center py-1.5 px-3 rounded-full gap-2 transition-all duration-300 ${
                    isDoctor 
                        ? "bg-white/60 backdrop-blur-md border border-[#B08B8C]/15 shadow-[0_4px_20px_rgba(176,139,140,0.08)]" 
                        : "bg-[#DBFFFF] shadow-sm"
                }`}>
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.href}
                            className={`text-[13px] tracking-wide font-semibold transition-all ${
                                link.active
                                    ? `text-white px-5 py-2 rounded-full shadow-md ${isDoctor ? "bg-gradient-to-r from-[#B08B8C] to-[#9D7778]" : "bg-teal-600"}`
                                    : `text-gray-600 px-4 py-2 rounded-full ${isDoctor ? "hover:text-[#6B3B3D] hover:bg-rose-50/50" : "hover:text-teal-600 hover:bg-white/50"}`
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                {!isDoctor && !isAdmin && (
                    <button 
                        onClick={() => {
                            if (onBookNow) {
                                onBookNow();
                            } else {
                                navigate('/doctors');
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
