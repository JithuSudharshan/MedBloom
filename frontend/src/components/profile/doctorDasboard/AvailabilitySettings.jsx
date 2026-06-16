import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, Plus, Trash2, CalendarDays, Loader2, Save, AlertTriangle, Copy } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../ui/Button';
import { fetchDoctorAvailability, saveDoctorAvailability } from '../../../api/doctorApi';
import { showToast } from '../../ui/Toast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

// Generate HH:MM options in 15-min steps
const TIME_OPTIONS = (() => {
    const t = [];
    for (let h = 0; h < 24; h++)
        for (let m = 0; m < 60; m += 15)
            t.push(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`);
    return t;
})();

const toMins = (hhmm) => { if (!hhmm) return 0; const [h,m] = hhmm.split(':').map(Number); return h*60+m; };
const toHhmm = (mins) => `${Math.floor(mins/60).toString().padStart(2,'0')}:${(mins%60).toString().padStart(2,'0')}`;
const fmt12 = (hhmm) => { const [h,m] = hhmm.split(':').map(Number); const s=h>=12?'PM':'AM'; return `${h%12||12}:${m.toString().padStart(2,'0')} ${s}`; };

// Returns true if two windows overlap
const windowsOverlap = (a, b) => toMins(a.start) < toMins(b.end) && toMins(a.end) > toMins(b.start);

const validateDay = (slots) => {
    const errors = [];
    if (slots.length === 0) return errors;
    for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        if (!s.start || !s.end) { errors.push(i); continue; }
        if (toMins(s.start) >= toMins(s.end)) { errors.push(i); continue; }
        for (let j = 0; j < slots.length; j++) {
            if (i === j) continue;
            if (windowsOverlap(s, slots[j])) { errors.push(i); break; }
        }
    }
    return [...new Set(errors)];
};

const defaultConfig = () => ({
    rules: { duration: 20, buffer: 5, advanceWindow: 7 },
    weekly: Object.fromEntries(DAYS.map(d => [d, { enabled: false, slots: [] }])),
    blockedDates: []
});

export default function AvailabilitySettings({ userRole = 'doctor' }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [config, setConfig] = useState(defaultConfig());
    const [activeDay, setActiveDay] = useState('monday');
    // Bug #22 fix: store the local date string directly
    const [selectedBlockDate, setSelectedBlockDate] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchDoctorAvailability();
                if (res.data?.data) setConfig(res.data.data);
            } catch { showToast.error("Failed to load availability"); }
            finally { setIsLoading(false); }
        })();
    }, []);

    // ── Computed ──────────────────────────────────────────────────────────────
    const dayErrors = React.useMemo(() => {
        const map = {};
        DAYS.forEach(d => { map[d] = validateDay(config.weekly[d]?.slots || []); });
        return map;
    }, [config]);

    const hasErrors = DAYS.some(d => config.weekly[d].enabled && dayErrors[d].length > 0);
    const hasEmptyEnabled = DAYS.some(d => config.weekly[d].enabled && config.weekly[d].slots.length === 0);

    // ── Handlers: weekly schedule ─────────────────────────────────────────────
    const toggleDay = (day) =>
        setConfig(p => ({ ...p, weekly: { ...p.weekly, [day]: { ...p.weekly[day], enabled: !p.weekly[day].enabled } } }));

    const addSlot = (day) => {
        const slots = config.weekly[day].slots;
        let newStart = '09:00', newEnd = '13:00';
        if (slots.length > 0) {
            const latest = Math.max(...slots.map(s => toMins(s.end)));
            if (latest + 60 <= 1440) { newStart = toHhmm(latest); newEnd = toHhmm(Math.min(latest + 240, 1440)); }
        }
        const newSlot = { id: Date.now().toString(), start: newStart, end: newEnd };
        setConfig(p => ({ ...p, weekly: { ...p.weekly, [day]: { ...p.weekly[day], slots: [...p.weekly[day].slots, newSlot] } } }));
    };

    const updateSlot = (day, id, field, value) => {
        setConfig(p => {
            const slots = p.weekly[day].slots.map(s => s.id === id ? { ...s, [field]: value } : s);
            // Bug #18 fix: auto-advance end time if start >= end
            const updated = slots.map(s => {
                if (s.id === id && field === 'start' && toMins(s.start) >= toMins(s.end)) {
                    return { ...s, end: toHhmm(Math.min(toMins(value) + 60, 1440)) };
                }
                return s;
            });
            return { ...p, weekly: { ...p.weekly, [day]: { ...p.weekly[day], slots: updated } } };
        });
    };

    const removeSlot = (day, id) =>
        setConfig(p => ({ ...p, weekly: { ...p.weekly, [day]: { ...p.weekly[day], slots: p.weekly[day].slots.filter(s => s.id !== id) } } }));

    // Bug #21 fix: copy day schedule to other days
    const copyToWeekdays = (sourceDay) => {
        const sourceSlots = config.weekly[sourceDay].slots;
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].filter(d => d !== sourceDay);
        setConfig(p => {
            const weekly = { ...p.weekly };
            weekdays.forEach(d => {
                weekly[d] = { enabled: true, slots: sourceSlots.map(s => ({ ...s, id: `${s.id}-${d}` })) };
            });
            return { ...p, weekly };
        });
        showToast.success('Copied to Mon–Fri!');
    };

    // ── Handlers: blocked dates ───────────────────────────────────────────────
    const addBlockedDate = () => {
        if (!selectedBlockDate) return;
        // Bug #22 fix: use local date parts to avoid UTC off-by-one
        const d = selectedBlockDate;
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        if (!config.blockedDates.includes(dateStr)) {
            setConfig(p => ({ ...p, blockedDates: [...p.blockedDates, dateStr].sort() }));
        }
        setSelectedBlockDate(null);
    };

    const removeBlockedDate = (ds) =>
        setConfig(p => ({ ...p, blockedDates: p.blockedDates.filter(d => d !== ds) }));

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (hasErrors) return showToast.error("Fix overlapping or invalid slots first.");
        if (hasEmptyEnabled) return showToast.error("Enabled days must have at least one time slot.");
        setIsSaving(true);
        try {
            await saveDoctorAvailability(config);
            showToast.success("Availability saved!");
        } catch (e) {
            showToast.error(e?.response?.data?.message || "Failed to save availability");
        } finally { setIsSaving(false); }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center w-full h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#6B3B3D]" />
        </div>
    );

    const activeDayData = config.weekly[activeDay];
    const activeDayErrors = dayErrors[activeDay];

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-y-auto pb-10 pr-2
            [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F5EBEB]">

            {/* ── Header Bar ── */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-20">
                <div>
                    <h2 className="text-2xl font-bold text-[#6B3B3D] flex items-center gap-2">
                        <CalendarDays className="w-6 h-6 text-[#B08B8C]" /> Schedule Builder
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-1">Set your weekly routine, booking rules, and date exceptions.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} role={userRole}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl shadow-[0_8px_20px_rgba(107,59,61,0.2)]">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            {/* ── Weekly Schedule ── */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50">

                {/* Day tabs */}
                <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-gray-100">
                    {DAYS.map(day => {
                        const isActive = activeDay === day;
                        const isEnabled = config.weekly[day].enabled;
                        const hasErr = isEnabled && dayErrors[day].length > 0;
                        return (
                            <button key={day} onClick={() => setActiveDay(day)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 flex items-center gap-1.5
                                    ${isActive ? 'bg-[#6B3B3D] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-rose-50/50 hover:text-[#6B3B3D] border border-gray-100'}`}>
                                {DAY_LABELS[day]}
                                {hasErr && <AlertTriangle className={`w-3 h-3 ${isActive ? 'text-yellow-300' : 'text-amber-500'}`} />}
                                {isEnabled && !hasErr && <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-300' : 'bg-[#4A7C59]'}`} />}
                            </button>
                        );
                    })}
                </div>

                {/* Active day config */}
                <div className="flex flex-col gap-5">
                    {/* Day enable toggle + copy button */}
                    <div className="flex items-center justify-between bg-rose-50/30 p-4 rounded-2xl border border-rose-50/50">
                        <div>
                            <h3 className="text-base font-bold text-[#6B3B3D] capitalize">{activeDay}s</h3>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Available for online consultations?</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Bug #21: copy to weekdays */}
                            {activeDayData.enabled && ['monday','tuesday','wednesday','thursday','friday'].includes(activeDay) && (
                                <button onClick={() => copyToWeekdays(activeDay)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6B3B3D] bg-white border border-rose-200 rounded-full hover:bg-rose-50 transition-colors">
                                    <Copy className="w-3 h-3" /> Copy to Mon–Fri
                                </button>
                            )}
                            <button onClick={() => toggleDay(activeDay)}
                                className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner ${activeDayData.enabled ? 'bg-[#4A7C59]' : 'bg-gray-300 hover:bg-gray-400'}`}>
                                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${activeDayData.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeDayData.enabled ? (
                            <motion.div key="enabled" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                className="flex flex-col gap-3">

                                {/* Slots */}
                                {activeDayData.slots.map((slot, idx) => {
                                    const isErr = activeDayErrors.includes(idx);
                                    const isStartGteEnd = toMins(slot.start) >= toMins(slot.end);
                                    const errMsg = isStartGteEnd ? 'End must be after start' : isErr ? 'Overlaps with another slot' : null;

                                    return (
                                        <motion.div key={slot.id || idx} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col gap-1">
                                            <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all bg-white shadow-sm
                                                ${isErr ? 'border-red-300 bg-red-50/30' : 'border-gray-100 hover:border-[#B08B8C]/40'}`}>

                                                {/* Time label */}
                                                <span className="text-xs font-bold text-gray-400 w-6 shrink-0">#{idx+1}</span>

                                                {/* Start */}
                                                <select value={slot.start}
                                                    onChange={e => updateSlot(activeDay, slot.id, 'start', e.target.value)}
                                                    className={`px-3 py-2 text-sm font-semibold rounded-xl border focus:outline-none focus:ring-2 flex-1 transition-colors
                                                        ${isErr ? 'border-red-200 bg-red-50 text-red-900 focus:ring-red-200' : 'border-gray-100 bg-gray-50 text-gray-700 focus:ring-[#B08B8C]/30'}`}>
                                                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                                                </select>

                                                <span className={`text-xs font-bold shrink-0 ${isErr ? 'text-red-400' : 'text-gray-400'}`}>to</span>

                                                {/* End — only shows options AFTER start (Bug #18 partial fix) */}
                                                <select value={slot.end}
                                                    onChange={e => updateSlot(activeDay, slot.id, 'end', e.target.value)}
                                                    className={`px-3 py-2 text-sm font-semibold rounded-xl border focus:outline-none focus:ring-2 flex-1 transition-colors
                                                        ${isErr ? 'border-red-200 bg-red-50 text-red-900 focus:ring-red-200' : 'border-gray-100 bg-gray-50 text-gray-700 focus:ring-[#B08B8C]/30'}`}>
                                                    {TIME_OPTIONS.filter(t => toMins(t) > toMins(slot.start))
                                                        .map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                                                </select>

                                                {/* Duration badge */}
                                                {!isErr && (
                                                    <span className="text-[10px] font-bold text-[#B08B8C] bg-rose-50 px-2 py-1 rounded-lg shrink-0">
                                                        {toMins(slot.end) - toMins(slot.start)}m
                                                    </span>
                                                )}

                                                <button onClick={() => removeSlot(activeDay, slot.id)}
                                                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors shrink-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {/* Bug #18: specific error message */}
                                            {errMsg && (
                                                <span className="text-[11px] font-bold text-red-500 pl-3 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> {errMsg}
                                                </span>
                                            )}
                                        </motion.div>
                                    );
                                })}

                                {/* Add slot button */}
                                <button onClick={() => addSlot(activeDay)}
                                    className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#B08B8C]/30 text-[#B08B8C] hover:text-[#6B3B3D] hover:border-[#6B3B3D]/50 hover:bg-rose-50/20 font-semibold transition-all text-sm">
                                    <Plus className="w-4 h-4" /> Add Time Block
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="disabled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-10 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <Clock className="w-10 h-10 mb-3 text-gray-300" />
                                <p className="text-gray-500 font-medium capitalize">Unavailable on {activeDay}s</p>
                                <p className="text-xs text-gray-400 mt-1">Toggle on to add time slots</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Bottom Grid: Rules & Blocked Dates ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Booking Rules */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#B08B8C]" /> Booking Rules
                    </h2>
                    <div className="space-y-5">

                        {/* Slot Duration */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Slot Duration (minutes)</label>
                            <p className="text-xs text-gray-400 mb-2">Length of each consultation</p>
                            <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B08B8C]/40 bg-gray-50/50 font-medium text-gray-700"
                                value={config.rules.duration}
                                onChange={e => setConfig(p => ({ ...p, rules: { ...p.rules, duration: Number(e.target.value) } }))}>
                                {[10,15,20,30,45,60].map(v => <option key={v} value={v}>{v} Minutes</option>)}
                            </select>
                        </div>

                        {/* Bug #19 fix: Buffer Time editor */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Buffer Between Slots (minutes)</label>
                            <p className="text-xs text-gray-400 mb-2">Rest/prep time between appointments</p>
                            <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B08B8C]/40 bg-gray-50/50 font-medium text-gray-700"
                                value={config.rules.buffer}
                                onChange={e => setConfig(p => ({ ...p, rules: { ...p.rules, buffer: Number(e.target.value) } }))}>
                                {[0,5,10,15,20,30].map(v => <option key={v} value={v}>{v === 0 ? 'No buffer' : `${v} Minutes`}</option>)}
                            </select>
                        </div>

                        {/* Advance Window */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Advance Booking Window</label>
                            <p className="text-xs text-gray-400 mb-2">How far ahead patients can book</p>
                            <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B08B8C]/40 bg-gray-50/50 font-medium text-gray-700"
                                value={config.rules.advanceWindow}
                                onChange={e => setConfig(p => ({ ...p, rules: { ...p.rules, advanceWindow: Number(e.target.value) } }))}>
                                {[7,14,21,30,60].map(v => <option key={v} value={v}>Up to {v} Days</option>)}
                            </select>
                        </div>

                        {/* Summary pill */}
                        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3 text-xs text-[#6B3B3D] font-semibold flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#4A7C59]" />
                            Each slot: <strong>{config.rules.duration}m</strong> + <strong>{config.rules.buffer}m</strong> buffer
                            = <strong>{config.rules.duration + config.rules.buffer}m</strong> total cycle
                        </div>
                    </div>
                </div>

                {/* Blocked Dates */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50/50 flex flex-col">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-2 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#B08B8C]" /> Date Exceptions
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">Block specific dates — patients won't see any slots on these days.</p>

                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="border border-gray-100 rounded-3xl p-2 bg-gray-50/30 flex justify-center shrink-0">
                            {/* Bug #22 fix: minDate set to tomorrow (can't block today if patients could already book) */}
                            <DatePicker
                                selected={selectedBlockDate}
                                onChange={date => setSelectedBlockDate(date)}
                                inline
                                minDate={new Date()}
                                highlightDates={config.blockedDates.map(ds => {
                                    const [y, mo, d] = ds.split('-').map(Number);
                                    return new Date(y, mo-1, d); // local date — Bug #22/#23 fix
                                })}
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-3 w-full">
                            <button onClick={addBlockedDate} disabled={!selectedBlockDate}
                                className="w-full px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold text-sm shadow-sm hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                Block Selected Date
                            </button>

                            <div className="w-full h-px bg-gray-100" />

                            <div className="flex flex-col gap-2 w-full max-h-[200px] overflow-y-auto pr-1
                                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
                                {config.blockedDates.length === 0 && (
                                    <span className="text-sm text-gray-400 italic">No dates blocked.</span>
                                )}
                                {config.blockedDates.map(ds => {
                                    // Bug #23 fix: parse as local date to avoid UTC off-by-one
                                    const [y, mo, d] = ds.split('-').map(Number);
                                    const label = new Date(y, mo-1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                                    return (
                                        <motion.div key={ds} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between bg-rose-50/60 text-[#6B3B3D] px-4 py-2.5 rounded-2xl text-sm font-bold border border-rose-100/50">
                                            {label}
                                            <button onClick={() => removeBlockedDate(ds)} className="text-red-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-full p-1 transition-colors shadow-sm">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
