import React from 'react';
import Button from './Button';
import image from '../../assets/images/ReviewBanner.png'
import ArrowButton from '../ui/ArrowButton';

const PatientReviewPromo = () => {
    return (
        <section className="w-full py-20 px-5 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0a2540]">
                        What our <span className="text-[#00bfa6]">patients</span> say about us
                    </h1>
                </div>

                {/* Content Section with Background Image */}
                <div
                    className="relative rounded-3xl overflow-hidden shadow-xl min-h-[500px] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    {/* Content */}
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
                        {/* Left Content */}
                        <div className="lg:col-span-2 flex flex-col justify-center p-8 lg:p-12 space-y-6">
                            <h2 className="text-4xl lg:text-[56px] font-bold text-[#0e7c7b] leading-tight">
                                Patient Stories
                            </h2>
                            <p className="text-xl lg:text-2xl text-[#0a2540] font-normal">
                                Real stories, real smiles
                            </p>
                            { /* Book Appointment button */}
                            <div className="pt-4">
                                <ArrowButton variant="primary">
                                    Book appointment
                                </ArrowButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PatientReviewPromo;
