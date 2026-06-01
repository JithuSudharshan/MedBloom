import React from "react";
import { Calendar, Clock, User } from "lucide-react";

const ProfileBanner = ({ userRole = 'patient', userDetails }) => {
    const { fullName, nextAppointment, lastCheckup, profileStatus } = userDetails || {};
    const isDoctor = userRole === 'doctor';

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
                        Welcome back, {fullName || (isDoctor ? "Doctor" : "Patient")}!<br/>
                        This is your {isDoctor ? "Professional Hub" : "Patient Profile"}.
                    </h1>
                    <p className={`text-lg font-medium opacity-80 ${
                        isDoctor ? "text-[#B08B8C]" : "text-[#006D6F]"
                    }`}>
                        Here, you can manage your personal details and<br/>medical information securely.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="flex gap-4">
                    {/* Card 1 */}
                    <div className={`bg-white rounded-2xl p-5 flex flex-col justify-between min-w-[150px] ${
                        isDoctor ? "shadow-[0_8px_30px_rgba(176,139,140,0.12)]" : "shadow-[0_8px_30px_rgba(0,109,111,0.06)]"
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                            isDoctor ? "bg-[#F8E9EA] text-[#B08B8C]" : "bg-teal-50 text-teal-600"
                        }`}>
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Next Appointment:</p>
                            <p className="text-sm font-semibold text-gray-800">{nextAppointment || "N/A"}</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className={`bg-white rounded-2xl p-5 flex flex-col justify-between min-w-[150px] ${
                        isDoctor ? "shadow-[0_8px_30px_rgba(176,139,140,0.12)]" : "shadow-[0_8px_30px_rgba(0,109,111,0.06)]"
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                            isDoctor ? "bg-[#F8E9EA] text-[#B08B8C]" : "bg-teal-50 text-teal-600"
                        }`}>
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Last Checkup:</p>
                            <p className="text-sm font-semibold text-gray-800">{lastCheckup || "N/A"}</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className={`bg-white rounded-2xl p-5 flex flex-col justify-between min-w-[150px] ${
                        isDoctor ? "shadow-[0_8px_30px_rgba(176,139,140,0.12)]" : "shadow-[0_8px_30px_rgba(0,109,111,0.06)]"
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                            isDoctor ? "bg-[#F8E9EA] text-[#B08B8C]" : "bg-teal-50 text-teal-600"
                        }`}>
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Profile Status:</p>
                            <p className="text-sm font-semibold text-gray-800">{profileStatus || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileBanner;