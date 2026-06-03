import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, Loader2, Pill } from 'lucide-react';
import { toast } from 'sonner';
import { savePrescriptionApi } from '../../../api/doctorApi';

export default function PrescriptionBuilderModal({ isOpen, onClose, appointment, onSuccess }) {
    const [medications, setMedications] = useState([
        { medication: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !appointment) return null;

    const handleAddRow = () => {
        setMedications([...medications, { medication: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const handleRemoveRow = (index) => {
        if (medications.length === 1) return;
        const updated = [...medications];
        updated.splice(index, 1);
        setMedications(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...medications];
        updated[index][field] = value;
        setMedications(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter out empty rows
        const validMedications = medications.filter(m => m.medication.trim() !== '');
        
        if (validMedications.length === 0) {
            toast.error("Please add at least one medication.");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await savePrescriptionApi(appointment.id, {
                prescription: validMedications,
                notes
            });

            if (res.data?.success) {
                toast.success("Prescription saved successfully!");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save prescription");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#FCF5F5] text-[#b08b8c] rounded-xl">
                                <Pill className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Digital Prescription</h2>
                                <p className="text-sm text-slate-500">For {appointment.primaryTitle || "Patient"}</p>
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
                    <div className="p-6 overflow-y-auto flex-1">
                        <form id="prescription-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            {medications.map((med, index) => (
                                <div key={index} className="p-5 border border-slate-200 rounded-2xl bg-white relative group transition-all hover:border-[#b08b8c]/30 hover:shadow-sm">
                                    {medications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRow(index)}
                                            className="absolute -top-3 -right-3 p-2 bg-white border border-slate-200 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Medication Name *</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="e.g. Amoxicillin" 
                                                value={med.medication}
                                                onChange={(e) => handleChange(index, 'medication', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#b08b8c] focus:ring-2 focus:ring-[#b08b8c]/10 transition-all outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Dosage *</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="e.g. 500mg" 
                                                value={med.dosage}
                                                onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#b08b8c] focus:ring-2 focus:ring-[#b08b8c]/10 transition-all outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Frequency *</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="e.g. 1-0-1 (Twice a day)" 
                                                value={med.frequency}
                                                onChange={(e) => handleChange(index, 'frequency', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#b08b8c] focus:ring-2 focus:ring-[#b08b8c]/10 transition-all outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Duration *</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="e.g. 5 Days" 
                                                value={med.duration}
                                                onChange={(e) => handleChange(index, 'duration', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#b08b8c] focus:ring-2 focus:ring-[#b08b8c]/10 transition-all outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Specific Instructions (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Take after meals" 
                                            value={med.instructions}
                                            onChange={(e) => handleChange(index, 'instructions', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#b08b8c] focus:ring-2 focus:ring-[#b08b8c]/10 transition-all outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-[#b08b8c]/30 text-[#b08b8c] font-medium hover:bg-[#FCF5F5] hover:border-[#b08b8c]/50 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Medication
                            </button>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Private Notes (Optional)</label>
                                <textarea
                                    rows="2"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any private notes for future reference..."
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#b08b8c] focus:ring-2 focus:ring-[#b08b8c]/10 transition-all outline-none resize-none text-slate-700"
                                />
                            </div>

                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 flex gap-4 bg-slate-50 mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="prescription-form"
                            disabled={isSubmitting}
                            className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-white transition-all ${
                                isSubmitting
                                ? 'bg-[#b08b8c]/50 cursor-not-allowed'
                                : 'bg-[#b08b8c] hover:bg-[#9a7677] hover:shadow-lg'
                            }`}
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSubmitting ? 'Saving...' : 'Save Prescription'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
