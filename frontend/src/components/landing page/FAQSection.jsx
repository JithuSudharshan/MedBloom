import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 text-left focus:outline-none group"
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-teal-600' : 'text-gray-800 group-hover:text-teal-600'}`}>
                    {question}
                </span>
                <div className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 leading-relaxed pr-12">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => {
    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "Booking an appointment is simple. You can navigate to our 'Find Doctors' page, search for a specialist that meets your needs, select an available time slot, and confirm your booking instantly. You'll receive a confirmation email with all the details."
        },
        {
            question: "Are the doctors verified and licensed?",
            answer: "Yes, absolutely. Every doctor on MedBloom undergoes a rigorous, multi-step verification process. We thoroughly check their medical licenses, qualifications, and past experience before they are approved to consult on our platform."
        },
        {
            question: "Is my personal and medical data secure?",
            answer: "Your privacy is our top priority. MedBloom employs enterprise-grade, end-to-end encryption to secure all your health records, prescriptions, and consultation history. Only you and your authorized doctors can access your data."
        },
        {
            question: "Can I have a consultation via video call?",
            answer: "Yes! MedBloom supports high-quality, secure video consultations. You can consult with top specialists from the comfort of your home, and receive digital prescriptions immediately after your session."
        },
        {
            question: "What should I do if I need to cancel my appointment?",
            answer: "You can easily cancel or reschedule your appointment from your Patient Dashboard. Just navigate to 'My Appointments' and select the cancel option. Please try to cancel at least 24 hours in advance."
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] rounded-full bg-teal-100 blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[25%] h-[40%] rounded-full bg-blue-100 blur-[100px] opacity-40"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Left Column: Heading */}
                    <div className="lg:w-1/3 flex flex-col justify-start">
                        <span className="text-teal-600 font-bold tracking-widest text-sm uppercase mb-3">Support</span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-[#003B46] mb-6 leading-tight">
                            Frequently <br />
                            Asked <br className="hidden lg:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-[#00A3A1]">Questions</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Find answers to common questions about booking appointments, managing your health records, and our privacy policies.
                        </p>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
