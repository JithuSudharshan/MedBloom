import React from 'react';
import image from '../../assets/images/vdoCallPtomo.jpeg'

const VdoCallPromoSection = () => {
    return (
        <section className="w-full py-20 px-5 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-16 flex-col lg:flex-row">
                    {/* Text Content */}
                    <div className="flex-[0.3] max-w-md lg:text-left text-center">
                        <h2 className="text-5xl lg:text-[48px] font-bold leading-tight text-[#0a2540] mb-6 tracking-tight">
                            Care made simple, finally
                        </h2>
                        <p className="text-base leading-relaxed text-[#425466] mb-8">
                            Skip the waiting room. Connect with doctors
                            anytime, anywhere. Your health on your terms.
                        </p>
                        <div className="flex flex-col gap-4 lg:items-start items-center">
                            <button className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#00bfa6] text-white rounded-lg font-semibold text-[15px] hover:bg-[#00a892] transition-all duration-300 hover:-translate-y-0.5 shadow-md">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                No more waiting
                            </button>
                            <button className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#0e7c7b] text-white rounded-lg font-semibold text-[15px] hover:bg-[#0a5f5e] transition-all duration-300 hover:-translate-y-0.5 shadow-md">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Virtual Consultations
                            </button>
                        </div>
                    </div>

                    {/* Image Content div*/}
                    <div className="flex-[0.7] relative w-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[450px]">
                            {/* Image */}
                            <img
                                src={image}
                                alt="Medical consultation"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VdoCallPromoSection;
