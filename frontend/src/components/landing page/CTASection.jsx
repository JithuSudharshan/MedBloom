import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
    const navigate = useNavigate()
    return (
        <section className="bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-teal-50 rounded-2xl px-10 py-14 text-center">

                    {/* Heading */}
                    <h2 className="text-3xl font-bold text-teal-700 mb-4">
                        Ready to experience better healthcare?
                    </h2>

                    {/* Description */}
                    <p className="max-w-3xl mx-auto text-gray-500 text-base leading-relaxed mb-8">
                        Join thousands of patients who have simplified their healthcare journey
                        with <span className="font-medium text-gray-600">MEDBLOOM</span> – a trusted
                        platform that connects you with verified doctors, makes booking appointments
                        effortless, and ensures that quality care is always just a few clicks away.
                    </p>

                    {/* Button */}
                    <button
                        onClick={() => navigate("/signup")}
                        className="inline-flex items-center gap-2 border border-teal-600 text-teal-600 px-6 py-3 rounded-lg text-sm font-medium hover:bg-teal-100 transition">
                        Create an Account
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-teal-600 text-white">
                            <ArrowRight size={14} />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
