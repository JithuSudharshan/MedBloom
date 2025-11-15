import React from "react";
import Lottie from 'lottie-react'
import adminAnimation from '../../assets/animations/Admin CRM.json'

const LeftHero = ({ headLine, sentence, imgSrc, imgSize, isLottie }) => (
    <div className="hidden md:flex flex-col  justify-center items-center bg-gradient-to-br from-[#016666] to-[#01CCCB] text-white p-10 w-1/2">
        {isLottie ? <Lottie animationData={adminAnimation} className={`mb-8 ${imgSize}`} loop={false} /> : <img src={imgSrc} alt="" className={`rounded-4xl mb-8 ${imgSize}`} />}
        <h2 className="text-2xl font-bold mb-2">{headLine}</h2>
        <p className="text-sm text-center max-w-sm">
            {sentence}
        </p>
    </div>
);

export default LeftHero;
