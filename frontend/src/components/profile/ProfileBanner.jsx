import React from "react";
import { Calendar, Clock, User } from "lucide-react";

const ProfileBanner = ({ userRole = 'patient', userDetails, metrics = [] }) => {
    const { fullName, nextAppointment, lastCheckup, profileStatus } = userDetails || {};
    const isDoctor = userRole === 'doctor';
    const isAdmin = userRole === 'admin';

    let description = "Here, you can manage your personal details and medical information securely.";
    let welcomeName = fullName || "Patient";
    
    if (isDoctor) {
        description = "Here, you can manage your appointments, availability, and patients securely.";
        welcomeName = fullName || "Doctor";
    } else if (isAdmin) {
        description = "Here, you can manage platform operations, doctors, patients, and revenue.";
        welcomeName = fullName || "Admin";
    }

    return (
        <section className={`w-full relative overflow-hidden py-14 px-8 border-b ${
            isDoctor 
                ? "bg-gradient-to-br from-[#FCF5F5] via-[#FDF9F9] to-[#FFFFFF] border-[#B08B8C]/20" 
                : "bg-gradient-to-br from-[#E0FAFA] via-[#F2FCFC] to-[#FFFFFF] border-teal-50/50"
        }`}>
            {/* Background Watermark */}
            <div className={`absolute top-1/2 -translate-y-1/2 -left-10 text-[18rem] font-bold select-none pointer-events-none tracking-tighter ${
                isDoctor ? "text-rose-900/5" : "text-teal-900/5"
            }`}>
                bloom
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                {/* Text Content */}
                <div className="max-w-2xl">
                    <h1 className={`text-[2.5rem] leading-tight font-medium mb-3 tracking-tight ${
                        isDoctor ? "text-[#6B3B3D]" : "text-[#004d4d]"
                    }`}>
                        Welcome back, {welcomeName}!<br/>
                        This is your {isDoctor ? "Professional Hub" : (isAdmin ? "Admin Console" : "Patient Profile")}.
                    </h1>
                    <p className={`text-lg font-medium opacity-80 ${
                        isDoctor ? "text-[#B08B8C]" : "text-[#006D6F]"
                    }`}>
                        {description}
                    </p>
                </div>

                {/* Stat Cards */}
                {metrics && metrics.length > 0 && (
                    <div className="flex gap-4">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <div key={index} className={`bg-white rounded-2xl p-5 flex flex-col justify-between min-w-[150px] ${
                                    isDoctor ? "shadow-[0_8px_30px_rgba(176,139,140,0.12)]" : "shadow-[0_8px_30px_rgba(0,109,111,0.06)]"
                                }`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                                        isDoctor ? "bg-[#F8E9EA] text-[#B08B8C]" : "bg-teal-50 text-teal-600"
                                    }`}>
                                        {Icon && <Icon size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">{metric.label}:</p>
                                        <p className="text-sm font-semibold text-gray-800">{metric.value || "N/A"}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProfileBanner;