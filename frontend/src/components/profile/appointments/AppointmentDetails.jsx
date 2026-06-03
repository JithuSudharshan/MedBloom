import React, { useState, useEffect } from 'react';
import { Calendar, Video, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentDetails({ appointment, userRole, onBack, onReschedule, onCancel }) {
    const isDoctor = userRole === 'doctor';

    // Real data extraction with safe fallbacks
    const id = appointment.appointmentId || appointment.id || appointment._id || 'N/A';
    const status = appointment.status || 'Confirmed';
    
    // Dynamically choose between Doctor or Patient info based on userRole
    const personName = isDoctor ? (appointment.patientName || appointment.primaryTitle) : (appointment.doctorName || appointment.primaryTitle);
    const personImage = isDoctor 
        ? (appointment.patientImage || 'https://cdn-icons-png.flaticon.com/512/3061/3061126.png')
        : (appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150');
    
    const personSubtitle = isDoctor ? (appointment.secondaryText || 'Patient') : (appointment.speciality || appointment.secondaryText || 'Specialist');
    const dateTime = appointment.dateTimeLabel || 'TBD';
    const consultationMode = appointment.consultationMode || appointment.mode || 'offline';

    const statusStyles = {
        Completed: "bg-[#ecfdf5] text-[#047857]",
        Upcoming: "bg-[#ebffff] text-[#00A4A3]",
        Confirmed: "bg-[#ebffff] text-[#00A4A3]",
        Cancelled: "bg-[#fef2f2] text-[#be123c]",
    };

    const currentStatusStyle = statusStyles[status] || statusStyles.Confirmed;

    const navigate = useNavigate();
    const [canJoinVideo, setCanJoinVideo] = useState(false);
    const [timeMessage, setTimeMessage] = useState('Checking time...');

    useEffect(() => {
        if (!consultationMode.toLowerCase().includes('online') || status === 'Cancelled' || status === 'Completed') return;

        const parseDateTime = () => {
            if (appointment.rawDate && appointment.rawStartTime) {
                // assume ISO or valid Date string
                const d = new Date(`${appointment.rawDate}T${appointment.rawStartTime}`);
                if (!isNaN(d.getTime())) return d;
            }
            try {
                let dateStr = dateTime.replace(' at ', ' ');
                return new Date(dateStr);
            } catch(e) {
                return null;
            }
        };

        const targetDate = parseDateTime();

        const checkTime = () => {
            if (!targetDate || isNaN(targetDate.getTime())) {
                setCanJoinVideo(true);
                setTimeMessage('');
                return;
            }

            const now = new Date();
            const timeDiff = targetDate.getTime() - now.getTime();
            const minutesUntil = Math.floor(timeDiff / (1000 * 60));

            if (minutesUntil <= 5) {
                setCanJoinVideo(true);
                setTimeMessage('');
            } else {
                setCanJoinVideo(false);
                setTimeMessage(`Button will be enabled in ${minutesUntil - 5} minutes`);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [appointment, consultationMode, status, dateTime]);

    return (
        <div className="w-full flex flex-col">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition w-fit mb-4 text-sm font-medium"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Appointments
            </button>

            <div className={`bg-white rounded-[2rem] p-8 w-full border border-slate-100 ${
                isDoctor ? "shadow-[0_20px_60px_-15px_rgba(176,139,140,0.2)]" : "shadow-[0_20px_60px_-15px_rgba(0,109,111,0.2)]"
            }`}>
                
                {/* Header: ID and Status */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-semibold text-lg ${isDoctor ? 'text-[#6B3B3D]' : 'text-[#006D6F]'}`}>
                        Appointments ID : {id.startsWith('#') ? id : `#${id}`}
                    </h3>
                    <div className={`px-5 py-1.5 rounded-full text-sm font-medium ${currentStatusStyle}`}>
                        {status}
                    </div>
                </div>

                <hr className="border-slate-100 mb-8" />

                {/* Doctor Info & Mode */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <img 
                            src={personImage} 
                            alt={personName} 
                            className="w-20 h-20 rounded-full object-cover shadow-sm"
                        />
                        <div>
                            <h2 className={`text-2xl font-bold mb-1 ${isDoctor ? 'text-[#6B3B3D]' : 'text-[#006D6F]'}`}>{personName}</h2>
                            <p className="text-slate-400 font-medium">{personSubtitle}</p>
                        </div>
                    </div>
                    
                    <div className={`${isDoctor ? 'bg-rose-50 text-[#B08B8C]' : 'bg-[#ebffff] text-[#00A4A3]'} px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize`}>
                        {consultationMode}
                    </div>
                </div>

                {/* Date/Time and Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-[#F8FDFD] rounded-xl text-[#00A4A3]">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-lg font-medium">{dateTime}</span>
                    </div>

                    {status !== 'Cancelled' && status !== 'Completed' && (
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onReschedule}
                                className={`${isDoctor ? 'bg-[#B08B8C] hover:bg-[#9D7778]' : 'bg-[#00A4A3] hover:bg-[#008c8a]'} text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm`}
                            >
                                Reschedule
                            </button>
                            <button 
                                onClick={onCancel}
                                className="border border-red-400 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <hr className="border-slate-100 mb-8" />

                {/* Virtual Consultation Facility */}
                {consultationMode.toLowerCase().includes('online') && (
                    <div className="flex flex-col items-start">
                        <h4 className="text-xl font-bold text-slate-500 mb-2">Virtual Consultation Facility</h4>
                        <p className="text-slate-400 mb-6">
                            Your video room will be live 5 minutes before your scheduled time
                        </p>
                        
                        <button 
                            onClick={() => navigate(`/consultation/${appointment.id || appointment._id}`)}
                            disabled={!canJoinVideo}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition shadow-sm ${canJoinVideo ? (isDoctor ? 'bg-[#B08B8C] hover:bg-[#9D7778] text-white' : 'bg-[#00A4A3] hover:bg-[#008c8a] text-white') : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                            <Video className="w-5 h-5" />
                            {canJoinVideo ? 'Join Video Call' : 'Not yet available'}
                        </button>
                        {!canJoinVideo && timeMessage && (
                            <p className="text-xs text-orange-500 font-medium mt-2">{timeMessage}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
