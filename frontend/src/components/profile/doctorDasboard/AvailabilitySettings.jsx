import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, Clock, Plus, Trash2, CalendarDays, Loader2, Save } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../ui/Button';
import { fetchDoctorAvailability, saveDoctorAvailability } from '../../../api/doctorApi';
import { showToast } from '../../ui/Toast';

// Utility to generate time options
const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            times.push(`${hour}:${minute}`);
        }
    }
    return times;
};

const TIME_OPTIONS = generateTimeOptions();
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function AvailabilitySettings({ userRole = 'doctor' }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [scheduleConfig, setScheduleConfig] = useState({
        rules: { duration: 30, advanceWindow: 7 },
        weekly: {
            monday: { enabled: false, slots: [] },
            tuesday: { enabled: false, slots: [] },
            wednesday: { enabled: false, slots: [] },
            thursday: { enabled: false, slots: [] },
            friday: { enabled: false, slots: [] },
            saturday: { enabled: false, slots: [] },
            sunday: { enabled: false, slots: [] },
        },
        blockedDates: []
    });

    const [activePreviewDay, setActivePreviewDay] = useState('monday');
    const [selectedBlockDate, setSelectedBlockDate] = useState(null);

    // Fetch availability on mount
    useEffect(() => {
        const loadAvailability = async () => {
            try {
                const response = await fetchDoctorAvailability();
                if (response.data && response.data.data) {
                    setScheduleConfig(response.data.data);
                }
            } catch (error) {
                showToast.error("Failed to load availability");
            } finally {
                setIsLoading(false);
            }
        };
        loadAvailability();
    }, []);

    // Save availability
    const handleSave = async () => {
        setIsSaving(true);
        try {
            console.log("this is been called")
            const response = await saveDoctorAvailability(scheduleConfig);
            console.log(response.data.data)
            showToast.success("Availability settings saved!");
        } catch (error) {
            showToast.error("Failed to save availability");
        } finally {
            setIsSaving(false);
        }
    };

    // Helpers
    const toggleDay = (day) => {
        setScheduleConfig(prev => ({
            ...prev,
            weekly: {
                ...prev.weekly,
                [day]: { ...prev.weekly[day], enabled: !prev.weekly[day].enabled }
            }
        }));
    };

    const addSlot = (day) => {
        setScheduleConfig(prev => ({
            ...prev,
            weekly: {
                ...prev.weekly,
                [day]: {
                    ...prev.weekly[day],
                    slots: [...prev.weekly[day].slots, { id: Date.now().toString(), start: '09:00', end: '13:00' }]
                }
            }
        }));
    };

    const updateSlot = (day, index, field, value) => {
        setScheduleConfig(prev => {
            const newSlots = [...prev.weekly[day].slots];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return {
                ...prev,
                weekly: {
                    ...prev.weekly,
                    [day]: { ...prev.weekly[day], slots: newSlots }
                }
            }
        });
    };

    const removeSlot = (day, index) => {
        setScheduleConfig(prev => {
            const newSlots = prev.weekly[day].slots.filter((_, i) => i !== index);
            return {
                ...prev,
                weekly: {
                    ...prev.weekly,
                    [day]: { ...prev.weekly[day], slots: newSlots }
                }
            }
        });
    };

    const handleAddBlockedDate = () => {
        if (!selectedBlockDate) return;
        const dateStr = selectedBlockDate.toISOString().split('T')[0];
        if (!scheduleConfig.blockedDates.includes(dateStr)) {
            setScheduleConfig(prev => ({ ...prev, blockedDates: [...prev.blockedDates, dateStr] }));
        }
        setSelectedBlockDate(null);
    };

    const removeBlockedDate = (dateStr) => {
        setScheduleConfig(prev => ({ ...prev, blockedDates: prev.blockedDates.filter(d => d !== dateStr) }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader2 className="w-8 h-8 animate-spin text-[#6B3B3D]" />
            </div>
        );
    }

    const activeDayData = scheduleConfig.weekly[activePreviewDay];

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-y-auto pb-10 pr-2
            [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F5EBEB]">

            {/* Top Action Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-20">
                <div>
                    <h2 className="text-2xl font-bold text-[#6B3B3D] flex items-center gap-2">
                        <CalendarDays className="w-6 h-6 text-[#B08B8C]" /> Online Consultation Schedule
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-1">Manage your weekly routine, booking rules, and date exceptions.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    role={userRole}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl shadow-[0_8px_20px_rgba(107,59,61,0.2)]"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            {/* Weekly Routine (Tabbed) */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50">
                {/* Horizontal Day Tabs */}
                <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-gray-100">
                    {DAYS_OF_WEEK.map(day => {
                        const isActive = activePreviewDay === day;
                        const isEnabled = scheduleConfig.weekly[day].enabled;
                        return (
                            <button
                                key={day}
                                onClick={() => setActivePreviewDay(day)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all duration-300 flex items-center gap-2
                                    ${isActive
                                        ? 'bg-[#6B3B3D] text-white shadow-md'
                                        : 'bg-gray-50 text-gray-600 hover:bg-rose-50/50 hover:text-[#6B3B3D] border border-gray-100'
                                    }`}
                            >
                                {day}
                                {isEnabled && (
                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-[#6B3B3D]'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Day Configuration */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between bg-rose-50/30 p-5 rounded-2xl border border-rose-50/50">
                        <div>
                            <h3 className="text-lg font-bold text-[#6B3B3D] capitalize">{activePreviewDay}s</h3>
                            <p className="text-sm text-gray-500 font-medium">Are you available for online consultations on this day?</p>
                        </div>
                        <button
                            onClick={() => toggleDay(activePreviewDay)}
                            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner ${activeDayData.enabled ? 'bg-[#4A7C59]' : 'bg-gray-300 hover:bg-gray-400'}`}
                        >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${activeDayData.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeDayData.enabled ? (
                            <motion.div
                                key="enabled"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {activeDayData.slots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 rounded-2xl border border-[#B08B8C]/20 bg-white shadow-sm hover:border-[#B08B8C]/50 transition-colors">
                                        <select
                                            value={slot.start}
                                            onChange={(e) => updateSlot(activePreviewDay, index, 'start', e.target.value)}
                                            className="px-3 py-2 font-semibold rounded-xl border border-gray-100 focus:outline-none focus:border-[#B08B8C] bg-gray-50 text-gray-700 flex-1"
                                        >
                                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <span className="text-gray-400 font-medium text-sm">to</span>
                                        <select
                                            value={slot.end}
                                            onChange={(e) => updateSlot(activePreviewDay, index, 'end', e.target.value)}
                                            className="px-3 py-2 font-semibold rounded-xl border border-gray-100 focus:outline-none focus:border-[#B08B8C] bg-gray-50 text-gray-700 flex-1"
                                        >
                                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <button
                                            onClick={() => removeSlot(activePreviewDay, index)}
                                            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors ml-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => addSlot(activePreviewDay)}
                                    className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#B08B8C]/30 text-[#B08B8C] hover:text-[#6B3B3D] hover:border-[#6B3B3D]/50 hover:bg-rose-50/20 font-semibold transition-all h-full min-h-[72px]"
                                >
                                    <Plus className="w-5 h-5" /> Add Time Block
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="disabled"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200"
                            >
                                <Clock className="w-12 h-12 mb-4 text-gray-300" />
                                <p className="text-gray-500 font-medium">You are marked as unavailable for online consultations on <span className="capitalize">{activePreviewDay}s</span>.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Grid: Rules & Exceptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Section: Booking Rules */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50 flex flex-col">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#B08B8C]" /> Booking Rules
                    </h2>
                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Slot Duration (Minutes)</label>
                            <p className="text-xs text-gray-500 mb-3">How long is each online consultation?</p>
                            <select
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B08B8C]/50 focus:border-[#B08B8C] bg-gray-50/50 transition-all font-medium text-gray-700"
                                value={scheduleConfig.rules.duration}
                                onChange={(e) => setScheduleConfig(prev => ({ ...prev, rules: { ...prev.rules, duration: Number(e.target.value) } }))}
                            >
                                <option value={15}>15 Minutes</option>
                                <option value={20}>20 Minutes</option>
                                <option value={30}>30 Minutes</option>
                                <option value={45}>45 Minutes</option>
                                <option value={60}>60 Minutes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Booking Window</label>
                            <p className="text-xs text-gray-500 mb-3">How far in advance can patients book you?</p>
                            <select
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B08B8C]/50 focus:border-[#B08B8C] bg-gray-50/50 transition-all font-medium text-gray-700"
                                value={scheduleConfig.rules.advanceWindow}
                                onChange={(e) => setScheduleConfig(prev => ({ ...prev, rules: { ...prev.rules, advanceWindow: Number(e.target.value) } }))}
                            >
                                <option value={7}>Up to 7 Days</option>
                                <option value={14}>Up to 14 Days</option>
                                <option value={30}>Up to 30 Days</option>
                                <option value={60}>Up to 60 Days</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Blocked Dates */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50 flex flex-col">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#B08B8C]" /> Date Exceptions
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mb-6">Select specific dates where you will be completely unavailable for consultations.</p>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="border border-gray-100 rounded-3xl p-3 bg-gray-50/30 w-full sm:w-auto flex justify-center">
                            <DatePicker
                                selected={selectedBlockDate}
                                onChange={(date) => setSelectedBlockDate(date)}
                                inline
                                minDate={new Date()}
                            />
                        </div>
                        <div className="flex-1 flex flex-col items-start gap-4 w-full">
                            <button
                                onClick={handleAddBlockedDate}
                                disabled={!selectedBlockDate}
                                className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                            >
                                Block Selected Date
                            </button>

                            <div className="w-full h-px bg-gray-100 my-1"></div>

                            <div className="flex flex-col gap-2 w-full max-h-[150px] overflow-y-auto pr-2
                                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
                                {scheduleConfig.blockedDates.length === 0 && (
                                    <span className="text-sm text-gray-400 font-medium italic">No dates blocked currently.</span>
                                )}
                                {scheduleConfig.blockedDates.map(dateStr => (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={dateStr} className="flex items-center justify-between bg-rose-50/50 text-[#6B3B3D] px-4 py-2.5 rounded-2xl text-sm font-bold border border-rose-100/50">
                                        {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        <button onClick={() => removeBlockedDate(dateStr)} className="text-red-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-full p-1 transition-colors shadow-sm">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
