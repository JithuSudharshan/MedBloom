import { CalendarClock, Video, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UpNextBanner({ appointment }) {
    if (!appointment) {
        return (
            <div className="bg-gradient-to-r from-rose-50 to-[#FCF5F5] rounded-3xl p-6 border border-rose-100/50 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-[#6B3B3D] font-bold text-lg flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-rose-500" />
                        Up Next
                    </h3>
                    <p className="text-[#B08B8C] text-sm mt-1">You have no upcoming appointments for today.</p>
                </div>
            </div>
        );
    }

    const isOnline = appointment.mode === 'Online';

    return (
        <div className="bg-gradient-to-r from-[#B08B8C] to-[#8C6264] rounded-3xl p-6 shadow-lg relative overflow-hidden group">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
                        {appointment.avatar ? (
                            <img src={appointment.avatar} alt="Patient" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                {appointment.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                                UP NEXT
                            </span>
                            <span className="text-rose-100 text-xs font-semibold flex items-center gap-1">
                                {isOnline ? <Video className="w-3 h-3" /> : <CalendarClock className="w-3 h-3" />}
                                {appointment.mode}
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-xl leading-tight">
                            {appointment.name}
                        </h3>
                        <p className="text-rose-100 text-sm font-medium mt-0.5">
                            Today at {appointment.time}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        to="/doctor/dashboard" // Should route to consultation room or appointment details
                        className="bg-white text-[#8C6264] px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
                    >
                        {isOnline ? "Join Room" : "View Details"}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
