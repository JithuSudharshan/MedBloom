const HeroSection = ({ imgSrc, title, para, ratingCard }) => {
    return (
        <section className="bg-white py-10 md:py-16">
            <div className="max-w-7xl mx-auto">

                {/* TOP TAGS */}
                <div className="flex justify-between px-6 md:px-10 mb-4">
                    <span className="text-xs md:text-sm font-semibold tracking-[0.15em]" style={{ color: "#00A3A1" }}>
                        CARE.
                    </span>
                    <span className="text-xs md:text-sm font-semibold tracking-[0.15em]" style={{ color: "#00A3A1" }}>
                        CONNECT.
                    </span>
                    <span className="text-xs md:text-sm font-semibold tracking-[0.15em]" style={{ color: "#00A3A1" }}>
                        BLOOM.
                    </span>
                </div>

                {/* MEDBLOOM TITLE */}
                <h1
                    className="text-center font-semibold leading-none tracking-[-0.03em]
                               text-[80px] md:text-[120px] lg:text-[150px]"
                    style={{ color: "#003B46" }}
                >
                    {title}
                </h1>

                {/* HERO GRADIENT BOX */}
                <div
                    className="
                        relative w-[92%] mx-auto 
                        rounded-[40px] overflow-visible
                        mt-8 md:mt-12
                        h-[230px] md:h-[260px] lg:h-[300px]
                    "
                    style={{
                        background: "linear-gradient(90deg, #00737A 0%, #00C8C7 100%)"
                    }}
                >
                    {/* LEFT DESCRIPTION */}
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 max-w-xs text-white">
                        <p className="text-sm md:text-base leading-relaxed">
                            {para}
                        </p>
                    </div>

                    {/* DOCTOR IMAGE EXACT OVERFLOW POSITION */}
                    <img
                        src={imgSrc}
                        alt="Doctor"
                        className="
                            absolute left-1/2 -translate-x-1/2
                            h-[380px] md:h-[440px] lg:h-[480px]
                            -top-[95px] md:-top-[110px] lg:-top-[172px]
                        "
                        style={{
                            filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.12))"
                        }}
                    />

                    {/* RATING CARD */}
                    {ratingCard && <div
                        className="
                            absolute bottom-6 right-6 md:bottom-10 md:right-10 
                            bg-white rounded-3xl p-5 shadow-xl
                            w-52 md:w-60
                        "
                    >
                        <div className="flex -space-x-2 mb-3">
                            <div className="w-9 h-9 bg-blue-400 rounded-full border-2 border-white"></div>
                            <div className="w-9 h-9 bg-pink-300 rounded-full border-2 border-white"></div>
                            <div className="w-9 h-9 bg-teal-500 rounded-full border-2 border-white"></div>
                            <div className="w-9 h-9 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="text-4xl font-bold" style={{ color: "#00A3A1" }}>
                            4.8+
                        </div>
                        <p className="text-xs text-gray-700 leading-tight">
                            Average patient rating based
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                            on over 1,500 verified reviews on Google
                        </p>
                    </div>}
                </div>
            </div>
        </section>
    )
}

export default HeroSection;
