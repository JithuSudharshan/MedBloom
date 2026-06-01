import React from "react";
import Lottie from 'lottie-react'
import adminAnimation from '../../assets/animations/Admin CRM.json'

const LeftHero = ({ headLine, sentence, imgSrc, imgSize, isLottie, role = "patient" }) => {
    const isDoctor = role?.toLowerCase() === 'doctor';

    return (
        <div className="hidden md:flex flex-col justify-center items-center p-10 lg:p-16 w-1/2 relative overflow-hidden">
            {/* Background Gradients for Smooth Crossfade */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#016666] to-[#01CCCB] transition-opacity duration-700 ease-in-out ${isDoctor ? 'opacity-0' : 'opacity-100'}`}>
                {/* Patient Watermark */}
                <span className="text-[200px] xl:text-[280px] font-bold text-white opacity-10 absolute -bottom-16 xl:-bottom-24 -left-10 pointer-events-none select-none tracking-tighter leading-none">
                    bloom
                </span>
            </div>

            <div className={`absolute inset-0 bg-gradient-to-br from-[#6B3B3D] to-[#8C5D5E] transition-opacity duration-700 ease-in-out ${isDoctor ? 'opacity-100' : 'opacity-0'}`}>
                {/* Doctor Watermark - Aligned Left */}
                <span className="text-[200px] xl:text-[280px] font-bold text-[#F8E9EA] opacity-[0.06] absolute -bottom-16 xl:-bottom-24 -left-10 pointer-events-none select-none tracking-tighter leading-none">
                    bloom
                </span>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-white w-full max-w-md">
                {isLottie ? (
                    <Lottie animationData={adminAnimation} className={`mb-10 ${imgSize}`} loop={false} />
                ) : (
                    <div className="relative w-full p-3 md:p-4 rounded-[2.5rem] bg-white/10 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/20 mb-10 transition-all duration-500 group">
                        <div className="relative w-full rounded-3xl overflow-hidden shadow-inner">
                            <img key={imgSrc} src={imgSrc} alt="Illustration" className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />

                            {/* Intelligent Color Grading Overlay to match Doctor Palette */}
                            <div className={`absolute inset-0 bg-[#6B3B3D]/25 mix-blend-color transition-opacity duration-700 ${isDoctor ? 'opacity-100' : 'opacity-0'}`}></div>

                            {/* Subtle inner shadow for premium feel */}
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                        </div>
                    </div>
                )}

                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-center tracking-tight transition-all duration-500 drop-shadow-sm">
                    {headLine}
                </h2>
                <p className="text-[15px] text-center max-w-sm text-white/90 leading-relaxed transition-all duration-500">
                    {sentence}
                </p>
            </div>
        </div>
    );
};

export default LeftHero;
