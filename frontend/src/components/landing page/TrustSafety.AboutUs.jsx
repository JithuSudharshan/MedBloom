import React from 'react'
import { ArrowRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const TrustSafety = () => {

    const navigate = useNavigate()

    return (
        <div>
            {/* ================= Trust & Safety ================= */}
            <section className="bg-teal-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-teal-700 mb-8">
                        Trust &amp; Safety
                    </h2>

                    <div className="space-y-6 mb-10">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-teal-600 font-semibold mb-2">
                                Verified Doctors
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                All healthcare professionals on MEDBLOOM go through a rigorous
                                verification process. We check their medical licenses,
                                credentials, and practice history to ensure you're receiving
                                care from qualified professionals.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-teal-600 font-semibold mb-2">
                                Data Privacy
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Your health information is sensitive and private. We use
                                industry-leading security measures to protect your data, and we
                                never share your information without your explicit consent.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate("/signup")}
                            className="flex items-center gap-2 border border-teal-500 text-teal-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-100 transition">
                            Join as a Doctor
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-teal-500 text-white">
                                <ArrowRight size={14} />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/doctors")}
                            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                            Find a Doctor
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white">
                                <ArrowRight size={14} />
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TrustSafety