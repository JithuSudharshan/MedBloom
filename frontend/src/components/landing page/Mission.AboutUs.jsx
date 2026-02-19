import React from 'react'

const MissionSection = () => {
    return (
        <>
            {/* ================= Mission ================= */}
            <section className="bg-white py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-teal-600 mb-8">
                        Mission
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        At <span className="text-teal-600 font-semibold">MEDBLOOM</span>, we believe
                        that healthcare should be accessible to everyone. Our platform connects
                        patients with qualified healthcare professionals, making it easy to find
                        the right doctor, book appointments, and manage your health records all
                        in one place.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Founded in 2025, <span className="text-teal-600 font-semibold">MEDBLOOM</span> was
                        born out of the frustration of not being able to find and book appointments
                        with doctors easily. We've built a platform that puts patients first,
                        while also giving healthcare providers the tools they need to manage
                        their practice efficiently.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        Our team of healthcare professionals and technology experts are dedicated
                        to improving the healthcare experience for everyone involved.
                    </p>
                </div>
            </section></>

    )
}

export default MissionSection