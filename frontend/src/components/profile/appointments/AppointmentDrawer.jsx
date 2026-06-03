import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Video, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentDrawer({ isOpen, onClose, appointment, userRole, onReschedule, onCancel, onWritePrescription }) {
    if (!appointment) return null;

    const isDoctor = userRole === 'doctor';

    // Theme definitions based on userRole
    const theme = {
        primaryText: isDoctor ? 'text-[#6B3B3D]' : 'text-[#00A4A3]',
        primaryTextDark: isDoctor ? 'text-[#5a3133]' : 'text-[#006D6F]',
        primaryBg: isDoctor ? 'bg-[#6B3B3D]' : 'bg-[#00A4A3]',
        primaryBgHover: isDoctor ? 'hover:bg-[#5a3133]' : 'hover:bg-[#008c8a]',
        lightBg: isDoctor ? 'bg-[#F8E9EA]' : 'bg-[#ebffff]',
        lightBorder: isDoctor ? 'border-[#6B3B3D]/10' : 'border-[#00A4A3]/10',
    };

    // Fallbacks and Formatting
    const rawId = appointment.id || appointment._id || '109283';
    // Use native appointmentId if it exists, otherwise fallback to formatting the raw ID
    const displayId = appointment.appointmentId || `#MED-${rawId.slice(-6).toUpperCase()}`;
    const status = appointment.status || 'Confirmed';
    
    let formattedStatus = status;
    if (status === 'in_progress') formattedStatus = 'In Progress';
    if (status === 'pending_payment') formattedStatus = 'Pending Payment';
    // capitalize others if needed, assuming backend sends them properly (e.g. 'Completed', 'Cancelled', 'Confirmed')
    // Actually the mapping in doctorProfileControllers maps to 'Upcoming', 'Completed', 'Cancelled'.
    // If raw status comes through, let's just capitalize it for display
    formattedStatus = formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1);
    if (formattedStatus === 'In_progress') formattedStatus = 'In Progress';

    // Dynamically choose between Doctor or Patient info based on userRole
    const personName = isDoctor ? (appointment.patientName || appointment.primaryTitle) : (appointment.doctorName || appointment.primaryTitle || 'Doctor');
    const personImage = isDoctor 
        ? (appointment.patientImage || 'https://cdn-icons-png.flaticon.com/512/3061/3061126.png')
        : (appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150');
    const personSubtitle = isDoctor ? (appointment.secondaryText || 'Patient') : (appointment.speciality || appointment.secondaryText || 'Specialist');
    const dateTime = appointment.dateTimeLabel || 'TBD';
    
    // Check consultation mode
    const consultationMode = appointment.mode || appointment.consultationMode || 'Online Consultation';
    const isOnline = consultationMode.toLowerCase().includes('online');

    const statusStyles = {
        Completed: "bg-[#ecfdf5] text-[#047857]",
        Upcoming: `${theme.lightBg} ${theme.primaryText}`,
        Confirmed: `${theme.lightBg} ${theme.primaryText}`,
        Cancelled: "bg-[#fef2f2] text-[#be123c]",
        "In Progress": "bg-[#e0f2fe] text-[#0284c7]",
    };
    const navigate = useNavigate();
    const [canJoinVideo, setCanJoinVideo] = useState(false);
    const [timeMessage, setTimeMessage] = useState('Checking time...');
    const [isConcluded, setIsConcluded] = useState(false);
    useEffect(() => {
        setIsConcluded(false);
        setCanJoinVideo(false);
        setTimeMessage('Checking time...');

        if (!isOnline || status === 'Cancelled') return;
        if (status === 'Completed') {
            setIsConcluded(true);
            return;
        }

        const parseDateTime = (timeStr) => {
            if (appointment.rawDate && timeStr) {
                if (timeStr.includes('T')) return new Date(timeStr.replace('Z', ''));
                const d = new Date(`${appointment.rawDate}T${timeStr}`);
                if (!isNaN(d.getTime())) return d;
            }
            return null;
        };

        let targetStartDate = null;
        try {
            let dateStr = dateTime.replace(' at ', ' ');
            targetStartDate = new Date(dateStr);
        } catch(e) {}

        if (!targetStartDate || isNaN(targetStartDate.getTime())) {
            targetStartDate = parseDateTime(appointment.rawStartTime);
        }

        let targetEndDate = null;
        if (appointment.rawEndTime) {
            targetEndDate = parseDateTime(appointment.rawEndTime);
        } else if (targetStartDate && !isNaN(targetStartDate.getTime())) {
            targetEndDate = new Date(targetStartDate.getTime() + 30 * 60000);
        }

        const checkTime = () => {
            if (!targetStartDate || isNaN(targetStartDate.getTime())) {
                setCanJoinVideo(true);
                setTimeMessage('');
                return;
            }

            const now = new Date();

            if (targetEndDate && now.getTime() >= targetEndDate.getTime()) {
                setIsConcluded(true);
                setCanJoinVideo(false);
                return;
            }

            const timeDiff = targetStartDate.getTime() - now.getTime();
            const joinWindowOffset = 5 * 60000;

            if (timeDiff <= joinWindowOffset) {
                setCanJoinVideo(true);
                setTimeMessage('');
            } else {
                setCanJoinVideo(false);
                const msUntilJoin = timeDiff - joinWindowOffset;
                const hours = Math.floor(msUntilJoin / (1000 * 60 * 60));
                const mins = Math.floor((msUntilJoin % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((msUntilJoin % (1000 * 60)) / 1000);

                if (hours > 0) {
                    setTimeMessage(`Joinable in ${hours}h ${mins}m`);
                } else {
                    setTimeMessage(`Joinable in ${mins}m ${secs}s`);
                }
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 1000);
        return () => clearInterval(interval);
    }, [appointment, isOnline, status, dateTime]);

    const effectiveStatus = isConcluded && formattedStatus !== 'Cancelled' ? 'Completed' : formattedStatus;
    const currentStatusStyle = statusStyles[effectiveStatus] || statusStyles.Confirmed;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className={`text-xl font-bold ${theme.primaryTextDark}`}>Appointment Details</h2>
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col gap-8 flex-1">
                            
                            {/* ID and Status */}
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Appointment ID</span>
                                    <span className={`${theme.primaryTextDark} font-bold`}>{displayId}</span>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${currentStatusStyle}`}>
                                    {effectiveStatus}
                                </div>
                            </div>

                            {/* Doctor/Patient Info */}
                            <div className="flex flex-col items-center text-center">
                                <img 
                                    src={personImage} 
                                    alt={personName} 
                                    className="w-24 h-24 rounded-full object-cover shadow-md mb-4 border-4 border-white"
                                />
                                <h2 className="text-2xl font-bold text-slate-800 mb-1">{personName}</h2>
                                <p className="text-slate-500 font-medium">{personSubtitle}</p>
                                <div className={`mt-4 ${theme.lightBg} ${theme.primaryText} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
                                    {isOnline ? "Online Consultation" : "Offline Consultation"}
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                <div className={`p-3 bg-white rounded-xl ${theme.primaryText} shadow-sm`}>
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Scheduled Time</span>
                                    <span className="font-bold text-slate-700">{dateTime}</span>
                                </div>
                            </div>

                            {/* Contextual Area (Online vs Offline) */}
                            {isOnline ? (
                                status === 'Cancelled' ? (
                                    <div className="flex flex-col items-center text-center p-6 bg-red-50 border border-red-100 rounded-3xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm mb-4">
                                            <X className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">Consultation Cancelled</h4>
                                        <p className="text-slate-500 text-sm px-4">
                                            This virtual consultation has been cancelled. No further action is required.
                                        </p>
                                    </div>
                                ) : isConcluded || status === 'Completed' ? (
                                    <div className="flex flex-col items-center text-center p-6 bg-[#ecfdf5] border border-[#047857]/10 rounded-3xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#047857] shadow-sm mb-4">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">Consultation Completed</h4>
                                        <p className="text-slate-500 text-sm px-4">
                                            This virtual consultation has concluded.
                                        </p>
                                    </div>
                                ) : (
                                    <div className={`flex flex-col items-center text-center p-6 ${theme.lightBg} border ${theme.lightBorder} rounded-3xl`}>
                                        <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center ${theme.primaryText} shadow-sm mb-4`}>
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">Virtual Consultation</h4>
                                        <p className="text-slate-500 text-sm mb-6 px-4">
                                            Your video room will be live 5 minutes before your scheduled time.
                                        </p>
                                        <button 
                                            onClick={() => { onClose(); navigate(`/consultation/${rawId}`); }}
                                            disabled={!canJoinVideo}
                                            className={`w-full flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition shadow-md ${canJoinVideo ? `${theme.primaryBg} ${theme.primaryBgHover} text-white` : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                        >
                                            <Video className="w-5 h-5" />
                                            {canJoinVideo ? 'Join Video Call' : 'Not yet available'}
                                        </button>
                                        {!canJoinVideo && timeMessage && (
                                            <p className="text-xs text-orange-500 font-medium mt-2">{timeMessage}</p>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-100 rounded-3xl relative overflow-hidden">
                                    {status === 'Cancelled' && (
                                        <div className="absolute top-0 inset-x-0 h-1 bg-red-400"></div>
                                    )}
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm mb-4">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">Clinic Address</h4>
                                    <p className="text-slate-500 text-sm px-4">
                                        {appointment.clinicAddress || "MedBloom Central Hospital, 123 Health Ave, Wellness District, City"}
                                    </p>
                                    {status === 'Cancelled' && (
                                        <p className="text-xs text-red-500 font-bold mt-4 uppercase tracking-wider">
                                            Appointment Cancelled
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Footer Actions */}
                        {effectiveStatus !== 'Cancelled' && effectiveStatus !== 'Completed' && !isDoctor && (
                            <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => { onClose(); onReschedule(); }}
                                    className={`${theme.primaryBg} ${theme.primaryBgHover} text-white py-3 rounded-xl text-sm font-bold transition shadow-sm`}
                                >
                                    Reschedule
                                </button>
                                <button 
                                    onClick={() => { onClose(); onCancel(); }}
                                    className="border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 py-3 rounded-xl text-sm font-bold transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {/* Footer Actions for Doctor */}
                        {effectiveStatus !== 'Cancelled' && isDoctor && !isOnline && (
                            <div className="p-6 border-t border-slate-100 bg-white">
                                <button 
                                    onClick={() => { onClose(); onWritePrescription(appointment); }}
                                    className={`w-full ${theme.primaryBg} ${theme.primaryBgHover} text-white py-3.5 rounded-xl text-sm font-bold transition shadow-md flex items-center justify-center gap-2`}
                                >
                                    Write Prescription
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
