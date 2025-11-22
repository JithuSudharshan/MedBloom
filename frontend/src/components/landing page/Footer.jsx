import React, { useState } from 'react';
import Input from '../../components/form/Input';
import mapImg from '../../assets/images/mapImage2.png';
import markerImg from '../../assets/icons/Frame.svg';
import instaIcon from '../../assets/icons/instagram.png';
import telegramIcon from '../../assets/icons/telegram.png';
import facebookIcon from '../../assets/icons/facebook.png';
import useEnquiryForm from '../../hooks/UseEnquiryForm';

const Footer = () => {
    const [loading, setLoading] = useState()

    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = useEnquiryForm()


    return (
        <section className="relative  pt-15  bg-white">

            {/* Main content wrapper */}
            <div className=" rounded-t-4xl max-w-7xl  min-h-[950px] mx-auto bg-[#03373B] w-full">

                <div className="relative">

                    {/* Map Image */}
                    <div className="relative overflow-hidden rounded-t-3xl rounded-b-3xl h-[400px]">
                        <img
                            src={mapImg}
                            alt="Map"
                            className="w-full h-full object-center rounded-t-3xl rounded-b-3xl border border-[#e8fdff]"
                        />
                        <img
                            src={markerImg}
                            alt="location marker"
                            className="absolute left-[20%] top-[33%] w-[65px] h-[72px] z-10"
                        />
                    </div>

                    {/* Form Card */}
                    <div className="absolute right-15 top-20 bg-gradient-to-br from-[#006868] to-[#00D8D7] rounded-[32px] shadow-xl 
                    w-[400px] px-8 py-6 flex flex-col gap-5 border border-[#0fc9bd] max-md:static max-md:mx-auto max-md:my-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Still have questions?</h2>
                            <p className="text-white text-[13px] mb-3">We are available and will respond within a day.</p>
                        </div>
                        <form onSubmit={handleSubmit((data) => onSubmit(data, setLoading))} className="flex flex-col gap-3" >
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
                            <button variant="primary" className={`${loading ? "disabled" : ""}w-full py-3 rounded-xl mt-2
                             text-white bg-[#03373B] hover:bg-[#095f64]`}>
                                {loading ? "Submitting..." : "Submit an application  "}
                            </button>
                        </form>
                    </div>
                </div>

                {/* NAV */}
                <div className="flex items-end justify-between ml-6 mt-6 max-md:flex-col max-md:items-center max-md:space-y-8">
                    <ul className="flex gap-3  rounded-full bg-[#FFFFFF] py-1 px-7 pb-1 h-[35px] shadow font-medium text-[#04585E] text-[17px]">
                        <li className="cursor-pointer px-4 py-1">Home</li>
                        <li className="cursor-pointer px-4 py-1">About Us</li>
                        <li className="cursor-pointer px-4 py-1">Services</li>
                        <li className="cursor-pointer px-4 py-1">Find Doctors</li>
                        <li className="cursor-pointer px-4 py-1">Login</li>
                        <li className="cursor-pointer px-4 py-1">Admin</li>
                    </ul>
                </div>
                {/* Social */}
                <div className=" absolute justify-center left-340 top-160 flex flex-col gap-2 items-end max-md:items-center z-10">
                    <p className="text-white font-semibold mb-1">Follow Us :</p>
                    <div className="flex gap-5">
                        <img src={instaIcon} alt="Instagram" className="w-9 h-9 " />
                        <img src={telegramIcon} alt="Telegram" className="w-9 h-9" />
                        <img src={facebookIcon} alt="Facebook" className="w-9 h-9" />
                    </div>
                </div>

                {/* Big MEDBLOOM */}
                <div className="absolute left-2 top-192 right-1 flex w-full justify-center mt-10 mb-3 select-none pointer-events-none">
                    <span className="text-[200px] font-bold tracking-widest text-white  max-md:text-[14vw] whitespace-nowrap">
                        MEDBLOOM
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Footer;
