import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/form/Input';
import mapImg from '../../assets/images/mapImage2.png';
import markerImg from '../../assets/icons/Frame.svg';
import instaIcon from '../../assets/icons/instagram.png';
import telegramIcon from '../../assets/icons/telegram.png';
import facebookIcon from '../../assets/icons/facebook.png';
import useEnquiryForm from '../../hooks/UseEnquiryForm';

const Footer = () => {
    const [loading, setLoading] = useState();

    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useEnquiryForm();

    return (
        <section className="relative pt-15 bg-white w-full">
            {/* Main full-width background wrapper */}
            <div className="rounded-t-[40px] bg-[#03373B] w-full flex flex-col items-center relative overflow-hidden">
                
                {/* Top Section: Map & Form */}
                <div className="relative w-full flex flex-col items-center">
                    {/* Solid Background (Map Removed) */}
                    <div className="absolute top-0 left-0 w-full h-[300px] sm:h-[400px] bg-white rounded-t-[40px] sm:rounded-b-[40px]">
                        {/* Subtle decorative pattern/gradient can go here if needed, keeping it clean for now */}
                    </div>

                    {/* Constrained Wrapper for Content */}
                    <div className="w-full max-w-7xl mx-auto relative pt-[300px] sm:pt-0 sm:h-[400px] flex sm:block justify-center">
                        {/* Content Area */}

                        {/* Form Card */}
                        <div className="sm:absolute sm:right-6 lg:right-4 sm:top-12 md:top-20 bg-gradient-to-br from-[#006868] to-[#00D8D7] rounded-[32px] shadow-xl 
                        w-[90%] sm:w-[380px] md:w-[400px] px-6 sm:px-8 py-6 flex flex-col gap-5 border border-[#0fc9bd] -mt-12 sm:mt-0 relative z-20">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Still have questions?</h2>
                                <p className="text-white/90 text-[13px] mb-3">We are available and will respond within a day.</p>
                            </div>
                            <form onSubmit={handleSubmit((data) => onSubmit(data, setLoading))} className="flex flex-col gap-3">
                                <Input
                                    name="name"
                                    register={register}
                                    error={errors?.name}
                                    placeholder="Enter your full name"
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    register={register}
                                    error={errors?.email}
                                    placeholder="Enter your email"
                                />
                                <Input
                                    name="phone"
                                    type="tel"
                                    register={register}
                                    error={errors?.phone}
                                    placeholder="Enter your phone number"
                                />
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`${loading ? "opacity-70 cursor-not-allowed" : ""} w-full py-3 rounded-xl mt-2
                                    text-white bg-[#03373B] hover:bg-[#095f64] transition-colors font-medium`}
                                >
                                    {loading ? "Submitting..." : "Submit Inquiry"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Nav and Socials */}
                <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-4 mt-16 sm:mt-36 md:mt-40 lg:mt-32 relative z-10 gap-10 md:gap-0">
                    
                    {/* NAV */}
                    <div className="w-full md:w-auto overflow-x-auto pb-4 md:pb-0 hide-scrollbar flex justify-center md:justify-start">
                        <ul className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/10 md:bg-[#FFFFFF] p-1.5 shadow-sm font-medium text-white md:text-[#04585E] text-[14px] sm:text-[15px] md:text-[17px] min-w-max backdrop-blur-sm md:backdrop-blur-none">
                            <Link to="/homePage"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">Home</li></Link>
                            <Link to="/aboutUs"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">About Us</li></Link>
                            <Link to="/services"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">Services</li></Link>
                            <Link to="/doctors"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">Find Doctors</li></Link>
                            <Link to="/login"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">Login</li></Link>
                            <Link to="/admin/login"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">Admin</li></Link>
                            <Link to="/articles"><li className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-white/20 md:hover:bg-gray-100 transition-colors">Articles</li></Link>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-white font-medium mb-1 tracking-wide text-sm">Follow Us:</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:scale-110 transition-transform"><img src={instaIcon} alt="Instagram" className="w-8 h-8 sm:w-9 sm:h-9" /></a>
                            <a href="#" className="hover:scale-110 transition-transform"><img src={telegramIcon} alt="Telegram" className="w-8 h-8 sm:w-9 sm:h-9" /></a>
                            <a href="#" className="hover:scale-110 transition-transform"><img src={facebookIcon} alt="Facebook" className="w-8 h-8 sm:w-9 sm:h-9" /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Big MEDBLOOM */}
                <div className="w-full flex justify-center mt-12 sm:mt-16 md:mt-20 mb-0 pb-4 select-none pointer-events-none overflow-hidden leading-none z-0">
                    <span className="text-[15vw] sm:text-[120px] md:text-[180px] lg:text-[200px] font-bold tracking-[0.1em] sm:tracking-[0.15em] text-white/5 sm:text-white/10 md:text-white whitespace-nowrap bg-clip-text">
                        MEDBLOOM
                    </span>
                </div>
                
                {/* Copyright Line */}
                <div className="w-full text-center pb-6">
                    <p className="text-white/60 text-sm font-medium">© 2026 MedBloom. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
};

export default Footer;
