import React from 'react'
import {
    Search,
    Calendar,
    Video,
} from "lucide-react";

const HowItWorks = () => {
    return (
        <div>
            {/* ================= How It Works ================= */}
            <section className="bg-teal-50 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-teal-700 text-center mb-4">
                        How MEDBLOOM works
                    </h2>

                    <h3 className="text-teal-600 font-semibold text-center mb-10">
                        For Patients
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Card 1 */}
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                <Search size={20} />
                            </div>
                            <h4 className="text-teal-600 font-semibold mb-2">
                                Step 1: Find a doctor
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Search for doctors by specialty, location, or availability to find
                                the perfect match for your needs.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                <Calendar size={20} />
                            </div>
                            <h4 className="text-teal-600 font-semibold mb-2">
                                Step 2: Book an Appointment
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Select a convenient time slot and book your appointment online in
                                just a few clicks.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                <Video size={20} />
                            </div>
                            <h4 className="text-teal-600 font-semibold mb-2">
                                Step 3: Receive Care
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Visit your doctor in person or have a video consultation. Access
                                your medical records and prescriptions anytime.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-teal-600 font-semibold text-center mb-10">
                        For Doctors
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                                1
                            </div>
                            <h4 className="text-teal-600 font-semibold mb-2">
                                Step 1: Create a Profile
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Sign up and create your professional profile with your specialties,
                                experience, and availability.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                                2
                            </div>
                            <h4 className="text-teal-600 font-semibold mb-2">
                                Step 2: Manage Schedule
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Set your availability and manage your appointments through our
                                easy-to-use dashboard.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                                3
                            </div>
                            <h4 className="text-teal-600 font-semibold mb-2">
                                Step 3: Provide Care
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Conduct appointments, manage patient records, and issue
                                prescriptions all through the platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HowItWorks