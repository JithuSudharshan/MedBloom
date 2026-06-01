import React, { useState, useEffect } from 'react';
import { Calendar, Video, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentDetails({ appointment, userRole, onBack, onReschedule, onCancel }) {
    const isDoctor = userRole === 'doctor';

    // Fallbacks for data
    const id = appointment.id || appointment._id || 'MED-109283';
    const status = appointment.status || 'Confirmed';
    const docName = appointment.doctorName || appointment.primaryTitle || 'Doctor';
    const docImage = appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150';
    const docSpeciality = appointment.speciality || appointment.secondaryText || 'Specialist';
    const dateTime = appointment.dateTimeLabel || 'October 15, 2025  10:30 AM';
    const consultationMode = appointment.mode || 'Online Consultation';

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
                    <h3 className="text-[#006D6F] font-semibold text-lg">
                        Appointments ID : #{id}
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
                            src={docImage} 
                            alt={docName} 
                            className="w-20 h-20 rounded-full object-cover shadow-sm"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-[#006D6F] mb-1">{docName}</h2>
                            <p className="text-slate-400 font-medium">{docSpeciality}</p>
                        </div>
                    </div>
                    
                    <div className="bg-[#ebffff] text-[#00A4A3] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap">
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
                                className="bg-[#00A4A3] hover:bg-[#008c8a] text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm"
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
                            onClick={() => navigate(`/consultation/${id}`)}
                            disabled={!canJoinVideo}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition shadow-sm ${canJoinVideo ? 'bg-[#00A4A3] hover:bg-[#008c8a] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
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
