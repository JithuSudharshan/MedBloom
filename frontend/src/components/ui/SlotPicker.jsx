import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Utility to generate next 14 days
const generateDateScroller = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            dateObj: d,
            isoDate: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' })
        });
    }
    return dates;
};

const DATES = generateDateScroller();

/**
 * SlotPicker UI Component
 * 
 * @param {Array} availableSlots - Array of slots from Logic Engine
 * @param {Array} bookedSlots - Array of booked slots (for visual disabled state)
 * @param {Function} onSelectSlot - Callback when a valid slot is selected
 * @param {String} selectedDate - Currently selected date (YYYY-MM-DD)
 * @param {Function} onSelectDate - Callback when a date is clicked
 */
export default function SlotPicker({ 
    availableSlots = [], 
    bookedSlots = [], 
    onSelectSlot, 
    selectedDate = DATES[0].isoDate, 
    onSelectDate 
}) {
    const [activeSlot, setActiveSlot] = useState(null);

    // Filter booked slots for the selected date
    const bookedForDate = bookedSlots.filter(s => s.isoStart.startsWith(selectedDate));

    const handleDateClick = (dateStr) => {
        if (onSelectDate) onSelectDate(dateStr);
        setActiveSlot(null); // Reset slot selection on date change
    };

    const handleSlotClick = (slot) => {
        setActiveSlot(slot.isoStart);
        if (onSelectSlot) onSelectSlot(slot);
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#F8E9EA] flex items-center justify-center text-[#6B3B3D]">
                    <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#6B3B3D]">Select an Appointment Time</h2>
                    <p className="text-sm font-medium text-gray-500">Pick a suitable date and time for your consultation.</p>
                </div>
            </div>

            {/* Horizontal Date Scroller */}
            <div className="relative mb-8">
                <div className="flex items-center gap-3 overflow-x-auto pb-4 pr-4
                    [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F5EBEB]">
                    
                    {DATES.map((d, index) => {
                        const isSelected = selectedDate === d.isoDate;
                        return (
                            <button
                                key={index}
                                onClick={() => handleDateClick(d.isoDate)}
                                className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl transition-all duration-300 border 
                                    ${isSelected 
                                        ? 'bg-[#6B3B3D] text-white border-[#6B3B3D] shadow-md scale-105' 
                                        : 'bg-white text-gray-600 border-gray-100 hover:border-[#B08B8C]/50 hover:bg-rose-50/20'
                                    }`}
                            >
                                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-rose-200' : 'text-gray-400'}`}>
                                    {d.dayName}
                                </span>
                                <span className="text-xl font-bold mb-1">
                                    {d.dayNumber}
                                </span>
                                <span className={`text-[10px] font-semibold ${isSelected ? 'text-rose-100' : 'text-gray-400'}`}>
                                    {d.month}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Responsive Grid for Time Chips */}
            <div className="mt-4">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Available Slots</h3>
                
                {availableSlots.length === 0 && bookedForDate.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No slots available on this date.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        
                        {/* Render Available Slots */}
                        {availableSlots.map((slot, index) => {
                            const isSelected = activeSlot === slot.isoStart;
                            return (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    key={`avail-${index}`}
                                    onClick={() => handleSlotClick(slot)}
                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center
                                        ${isSelected 
                                            ? 'bg-[#F8E9EA] text-[#6B3B3D] border-2 border-[#6B3B3D] shadow-sm' 
                                            : 'bg-[#F8E9EA] text-[#6B3B3D] border-2 border-transparent hover:bg-[#F2D7D9]'
                                        }`}
                                >
                                    {slot.displayTime}
                                </motion.button>
                            );
                        })}

                        {/* Render Booked Slots (Greyed out) */}
                        {bookedForDate.map((slot, index) => (
                            <div
                                key={`booked-${index}`}
                                className="py-3 px-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-400 border-2 border-transparent flex items-center justify-center gap-1.5 cursor-not-allowed opacity-70"
                            >
                                <Lock className="w-3.5 h-3.5" />
                                <span className="line-through">{slot.displayTime}</span>
                            </div>
                        ))}

                    </div>
                )}
            </div>

        </div>
    );
}
