import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Calendar, User, Activity } from 'lucide-react';

export default function ViewPrescriptionModal({ isOpen, onClose, appointment, userRole = "patient" }) {
    if (!isOpen || !appointment) return null;

    // Check if prescription exists and is an array
    const hasPrescription = appointment.prescription && Array.isArray(appointment.prescription) && appointment.prescription.length > 0;
    
    const isDoctor = userRole === 'doctor';

    // Dynamic Theme based on Role
    const theme = {
        iconBg: isDoctor ? "bg-[#FCF5F5]" : "bg-teal-50",
        iconText: isDoctor ? "text-[#6B3B3D]" : "text-teal-700",
        hoverBorder: isDoctor ? "hover:border-[#B08B8C]/50" : "hover:border-teal-400/50",
        notesBg: isDoctor ? "bg-[#FCF5F5]" : "bg-teal-50",
        notesBorder: isDoctor ? "border-[#b08b8c]/20" : "border-teal-200",
        notesTitle: isDoctor ? "text-[#b08b8c]" : "text-teal-700",
        pillBg: isDoctor ? "bg-[#FCF5F5]" : "bg-teal-50",
        pillText: isDoctor ? "text-[#6B3B3D]" : "text-teal-700",
    };

    // Formatting Date
    let dateStr = appointment.dateTimeLabel || "N/A";
    if (appointment.rawDate) {
        try {
            const d = new Date(appointment.rawDate);
            if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            }
        } catch(e) {}
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${theme.iconBg} ${theme.iconText}`}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Prescription Details</h2>
                                <p className="text-sm text-slate-500">ID: {appointment.appointmentId || `#MED-${(appointment.id || appointment._id || '109283').slice(-6).toUpperCase()}`}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto flex-1 bg-white">
                        
                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-dashed border-slate-200">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-lg text-slate-800">{appointment.doctorName || "Doctor"}</h3>
                                <p className="text-slate-500 text-sm font-medium">{appointment.speciality || "Specialist"}</p>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium text-slate-800">{appointment.primaryTitle || appointment.patientName || "Patient"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{dateStr}</span>
                                </div>
                            </div>
                        </div>

                        {/* Medications */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className={`w-5 h-5 ${theme.iconText}`} />
                                <h3 className="text-lg font-bold text-slate-800">Prescribed Medications</h3>
                            </div>

                            {!hasPrescription ? (
                                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-500 font-medium">No medications were prescribed for this consultation.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {appointment.prescription.map((med, index) => (
                                        <div key={index} className={`flex flex-col p-5 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all ${theme.hoverBorder}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-slate-800 text-lg">{med.medication}</h4>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${theme.pillBg} ${theme.pillText}`}>
                                                    {med.duration}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dosage</span>
                                                    <span className="text-sm font-medium text-slate-700">{med.dosage}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Frequency</span>
                                                    <span className="text-sm font-medium text-slate-700">{med.frequency}</span>
                                                </div>
                                            </div>

                                            {med.instructions && (
                                                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instructions</span>
                                                    <span className="text-sm italic text-slate-600">{med.instructions}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {appointment.notes && (
                            <div className={`p-5 border rounded-2xl ${theme.notesBg} ${theme.notesBorder}`}>
                                <h4 className={`text-sm font-bold mb-2 uppercase tracking-wider ${theme.notesTitle}`}>Doctor's Notes</h4>
                                <p className="text-sm text-slate-700 leading-relaxed">{appointment.notes}</p>
                            </div>
                        )}

                        {!isDoctor && hasPrescription && (
                            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                                <div className="text-blue-500 mt-0.5">ℹ️</div>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    <span className="font-semibold">Note:</span> You can also view and download this prescription anytime in the <span className="font-semibold">Medical Records</span> section under <span className="font-semibold">Prescriptions</span>.
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-slate-50 mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
