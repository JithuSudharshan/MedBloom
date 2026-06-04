import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Calendar as CalendarIcon, Clock, Wallet, CreditCard, Info } from 'lucide-react';
import { fetchAvailableSlots } from '../../api/landingPageApi';
import { toast } from 'sonner';
import Loader from './Loading';

// Removed global generator, shifted to component scope for dynamic window length

export default function PatientSlotPicker({ doctorId, availabilityConfig, doctorData, onConfirm, isReschedule, lockedMode, walletBalance = 0 }) {
    
    // Dynamically generate dates based on advanceWindow
    const DATES = React.useMemo(() => {
        const dates = [];
        const windowDays = availabilityConfig?.advanceWindow || 7;
        for (let i = 0; i < windowDays; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const pad = (n) => n.toString().padStart(2, '0');
            const localIsoDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            dates.push({
                dateObj: d,
                isoDate: localIsoDate,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: d.getDate(),
                month: d.toLocaleDateString('en-US', { month: 'short' })
            });
        }
        return dates;
    }, [availabilityConfig?.advanceWindow]);

    const blockedDatesList = availabilityConfig?.blockedDates || [];

    // Auto-select first non-blocked date on mount
    const initialDate = React.useMemo(() => {
        const firstAvailable = DATES.find(d => !blockedDatesList.includes(d.isoDate));
        return firstAvailable ? firstAvailable.isoDate : DATES[0].isoDate;
    }, [DATES, blockedDatesList]);

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [activeSlot, setActiveSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    // Consultation Mode logic
    const docMode = doctorData?.consultationMode || 'offline';
    // If lockedMode is provided (e.g. during reschedule), don't show toggle
    const hasBoth = docMode === 'both' && !lockedMode;
    const [selectedMode, setSelectedMode] = useState(lockedMode || (hasBoth ? null : docMode));

    // Dynamic fee calculation
    const currentFee = selectedMode === 'online' 
        ? doctorData?.consultationFees?.online || 500 
        : selectedMode === 'offline'
            ? doctorData?.consultationFees?.offline || 500
            : 0;

    const isWalletSufficient = walletBalance >= currentFee;

    useEffect(() => {
        if (!doctorId) return;

        const loadSlots = async () => {
            setLoading(true);
            try {
                const response = await fetchAvailableSlots(doctorId, selectedDate);
                if (response.data.success) {
                    setAvailableSlots(response.data.data.availableSlots);
                    setBookedSlots(response.data.data.bookedSlots);
                }
            } catch (error) {
                console.error("Failed to load slots");
            } finally {
                setLoading(false);
            }
        };
        loadSlots();
    }, [doctorId, selectedDate]);

    // Check if slot isoStart exists in bookedSlots
    const isBooked = (slotIso) => {
        return bookedSlots.some(b => {
            let bookedTime = b.startTime;
            if (bookedTime && bookedTime.includes('T')) {
                // Extract HH:mm from ISO string for backward compatibility
                const d = new Date(bookedTime);
                const pad = (n) => n.toString().padStart(2, '0');
                bookedTime = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
            }
            return bookedTime === slotIso;
        });
    };

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setActiveSlot(null); // Reset selection on date change
    };

    const handleConfirmClick = () => {
        if (!selectedMode) {
            toast.error("Please select a consultation mode");
            return;
        }
        if (!activeSlot) {
            toast.error("Please select an available time slot");
            return;
        }
        if (!isReschedule && !paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }
        onConfirm(activeSlot, selectedDate, selectedMode, isReschedule ? null : paymentMethod);
    };

    return (
        <div className="bg-[#EBFFFF] rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,164,163,0.08)] backdrop-blur-md border border-[#00A4A3]/10 h-full flex flex-col relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A4A3]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00A4A3]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00A4A3] shadow-sm">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Select Date & Time</h2>
                    </div>

                    {/* Consultation Mode Toggle removed from here */}
                    
                    {lockedMode && (
                        <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#00A4A3] text-white shadow-md uppercase tracking-wider">
                            {lockedMode} Consultation
                        </div>
                    )}
                </div>

                {/* Prominent Consultation Mode Selection */}
                {hasBoth && !lockedMode && (
                    <div className="mb-6">
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                            Select Consultation Mode
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSelectedMode('online')}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                    selectedMode === 'online'
                                    ? 'border-[#00A4A3] bg-[#00A4A3] text-white shadow-md'
                                    : 'border-transparent bg-white/80 hover:bg-white text-slate-600 hover:border-[#00A4A3]/30'
                                }`}
                            >
                                <span className="font-bold text-base">Online</span>
                                <span className={`text-xs mt-1 ${selectedMode === 'online' ? 'text-teal-100' : 'text-slate-400'}`}>
                                    ₹{doctorData?.consultationFees?.online || 500}
                                </span>
                            </button>
                            <button
                                onClick={() => setSelectedMode('offline')}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                    selectedMode === 'offline'
                                    ? 'border-[#00A4A3] bg-[#00A4A3] text-white shadow-md'
                                    : 'border-transparent bg-white/80 hover:bg-white text-slate-600 hover:border-[#00A4A3]/30'
                                }`}
                            >
                                <span className="font-bold text-base">In-Clinic</span>
                                <span className={`text-xs mt-1 ${selectedMode === 'offline' ? 'text-teal-100' : 'text-slate-400'}`}>
                                    ₹{doctorData?.consultationFees?.offline || 500}
                                </span>
                            </button>
                        </div>
                    </div>
                )}


                {/* Horizontal Date Scroller */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 pr-4 mb-4
                    [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#00A4A3]/20">
                    
                    {DATES.map((d, index) => {
                        const isSelected = selectedDate === d.isoDate;
                        const isBlocked = blockedDatesList.includes(d.isoDate);
                        
                        return (
                            <button
                                key={index}
                                onClick={() => !isBlocked && handleDateClick(d.isoDate)}
                                disabled={isBlocked}
                                className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl transition-all duration-300 border 
                                    ${isBlocked 
                                        ? 'bg-slate-100/50 text-slate-300 border-transparent cursor-not-allowed opacity-50'
                                        : isSelected 
                                            ? 'bg-[#00A4A3] text-white border-[#00A4A3] shadow-md scale-105' 
                                            : 'bg-white text-slate-600 border-white hover:border-[#00A4A3]/30 hover:bg-[#E0F7F7]'
                                    }`}
                            >
                                <span className={`text-xs font-bold uppercase tracking-wider mb-1 
                                    ${isBlocked ? 'text-slate-300' : isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                                    {d.dayName}
                                </span>
                                <span className="text-xl font-bold mb-1 relative">
                                    {d.dayNumber}
                                    {isBlocked && (
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-0.5 bg-slate-300 rotate-45 rounded-full"></span>
                                    )}
                                </span>
                                <span className={`text-[10px] font-semibold 
                                    ${isBlocked ? 'text-slate-300' : isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                                    {d.month}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Time Chips Grid */}
                <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#00A4A3]/20">
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#00A4A3]" /> Available Slots
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {loading ? (
                            <div className="col-span-full py-8 flex justify-center">
                                <Loader />
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                No slots available on this date.
                            </div>
                        ) : (
                            availableSlots.map((slot, index) => {
                                const booked = isBooked(slot.isoStart);
                                const isSelected = activeSlot === slot.isoStart;

                                if (booked) {
                                    return (
                                        <div
                                            key={`booked-${index}`}
                                            className="py-3 px-2 rounded-xl text-sm font-bold bg-white/50 text-slate-400 border border-transparent flex items-center justify-center gap-1.5 cursor-not-allowed opacity-70"
                                        >
                                            <Lock className="w-3.5 h-3.5" />
                                            <span className="line-through">{slot.displayTime}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={`avail-${index}`}
                                        onClick={() => setActiveSlot(slot.isoStart)}
                                        className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center
                                            ${isSelected 
                                                ? 'bg-white text-[#00A4A3] border-2 border-[#00A4A3] shadow-[0_4px_12px_rgba(0,164,163,0.2)]' 
                                                : 'bg-white text-slate-600 border-2 border-transparent hover:border-[#00A4A3]/30 hover:bg-[#F0FDFD]'
                                            }`}
                                    >
                                        {slot.displayTime}
                                    </motion.button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Footer / Action Area */}
            <div className="relative z-10 mt-6 pt-6 border-t border-[#00A4A3]/20 flex flex-col gap-4 bg-[#EBFFFF]">
                
                {/* Refund Policy Alert */}
                <div className="bg-white/60 border border-[#00A4A3]/30 rounded-xl p-3 flex gap-3 items-start shadow-sm">
                    <Info className="w-5 h-5 text-[#00A4A3] shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600">
                        <strong className="text-slate-800 block mb-1">Cancellation Refund Policy</strong>
                        <ul className="list-disc pl-4 space-y-0.5">
                            <li><strong>100% refund</strong> if cancelled more than 24 hours before the appointment.</li>
                            <li><strong>50% refund</strong> if cancelled 1 to 24 hours before the appointment.</li>
                            <li><strong>No refund</strong> if cancelled less than 1 hour before the appointment.</li>
                        </ul>
                    </div>
                </div>
                
                {/* Payment Selection - Hidden if Rescheduling */}
                {!isReschedule && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-1">Payment Method</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                    paymentMethod === 'razorpay'
                                    ? 'border-[#00A4A3] bg-white shadow-sm'
                                    : 'border-transparent bg-white/60 hover:bg-white text-slate-500'
                                }`}
                            >
                                <CreditCard className={`w-5 h-5 ${paymentMethod === 'razorpay' ? 'text-[#00A4A3]' : ''}`} />
                                <span className="font-bold text-sm">Razorpay</span>
                            </button>

                            <button
                                onClick={() => {
                                    if (isWalletSufficient) setPaymentMethod('wallet');
                                }}
                                disabled={!isWalletSufficient}
                                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${
                                    paymentMethod === 'wallet'
                                    ? 'border-[#00A4A3] bg-white shadow-sm'
                                    : !isWalletSufficient 
                                        ? 'border-transparent bg-slate-100/50 text-slate-400 cursor-not-allowed opacity-60'
                                        : 'border-transparent bg-white/60 hover:bg-white text-slate-500'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Wallet className={`w-5 h-5 ${paymentMethod === 'wallet' ? 'text-[#00A4A3]' : ''}`} />
                                    <span className="font-bold text-sm">Wallet</span>
                                </div>
                                <span className={`text-[10px] mt-1 font-semibold ${isWalletSufficient ? 'text-slate-500' : 'text-red-400'}`}>
                                    Bal: ₹{walletBalance || 0} {!isWalletSufficient && "(Insufficient)"}
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Consultation Fee</p>
                        <p className="text-2xl font-black text-[#00A4A3]">₹{currentFee}</p>
                    </div>
                    <button 
                        onClick={handleConfirmClick}
                        className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-md ${
                            activeSlot && selectedMode && (isReschedule || paymentMethod)
                            ? 'bg-[#00A4A3] hover:bg-[#008A89] text-white cursor-pointer hover:shadow-lg hover:-translate-y-0.5' 
                            : 'bg-[#00A4A3]/80 hover:bg-[#00A4A3] text-white cursor-pointer hover:shadow-lg'
                        }`}
                    >
                        {isReschedule ? "Confirm Reschedule" : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}
