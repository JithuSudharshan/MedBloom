import React from "react";

const LeftHero = ({ sentence, imgSrc }) => (
    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#016666] to-[#01CCCB] text-white p-10 w-1/2">
        <img src={imgSrc} alt="hero" className=" mb-8" />
        <h2 className="text-2xl font-bold mb-2">Join MEDBLOOM Today</h2>
        <p className="text-sm text-center max-w-sm">
            {sentence}
        </p>
    </div>
);

export default LeftHero;
