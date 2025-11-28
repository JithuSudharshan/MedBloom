import React from "react";

const ProfileBanner = ({ profileOwner, profileDescription }) => (
    <section className="w-full  mx-auto mt-5 bg-gradient-to-r from-[#00737A] to-[#00C8C7] py-10 px-8 border-b border-cyan-300">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-white text-4xl font-bold mb-3 tracking-tight">
                {profileOwner}
            </h1>
            <p className="text-white text-lg opacity-90">
                {profileDescription}
            </p>
        </div>
    </section>
);

export default ProfileBanner;