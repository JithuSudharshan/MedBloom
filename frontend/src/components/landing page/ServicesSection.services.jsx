import React from 'react'
import {
    Video,
    CalendarCheck,
    FileText,
    Star,
    Brain,
} from "lucide-react";
import ServicesCards from './ServicesCards';

const ServicesSection = () => {
    return (
        <section className="bg-white py-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    <ServicesCards
                        icon={Video}
                        title="Online Consultations"
                        description="Connect with doctors from the comfort of your home through secure video calls. Get medical advice, prescriptions, and follow-ups without the need to travel."
                        buttonText="Book video consultation"
                    />

                    <ServicesCards
                        icon={CalendarCheck}
                        title="Doctor Availability & Booking"
                        description="View real-time availability of doctors and book appointments instantly. Receive reminders and easily reschedule if needed."
                        buttonText="Find Available Doctor"
                    />

                    <ServicesCards
                        icon={FileText}
                        title="Prescription Management"
                        description="Access your prescriptions digitally, download them as needed, and receive reminders for refills. Doctors can upload new prescriptions directly to your account."
                        buttonText="Manage Prescriptions"
                    />

                    <ServicesCards
                        icon={Star}
                        title="Reviews & Ratings"
                        description="Read verified patient reviews and ratings to choose the right doctor for your needs. Share your own experience to help others make informed decisions."
                        buttonText="View Doctor Ratings"
                    />

                    <ServicesCards
                        icon={Brain}
                        title="AI Symptom Checker"
                        description="Get preliminary insights about your symptoms using our AI-powered symptom checker. This tool helps you understand potential conditions before consulting a doctor."
                        buttonText="Check Symptoms"
                    />

                </div>
            </div>
        </section>
    );
};

export default ServicesSection;