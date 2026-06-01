import React, { useState } from 'react';
import Modal from '../../profile/Modal';

export default function CancelAppointmentModal({ isOpen, onClose, onConfirm }) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2 sm:p-6 flex flex-col gap-6 max-w-md w-full">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">Cancel Appointment</h2>
                    <p className="text-slate-500 text-sm">
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Reason for Cancellation</label>
                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please tell us why you need to cancel..."
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#00A4A3] focus:ring-1 focus:ring-[#00A4A3] min-h-[100px] resize-none"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                    <button 
                        onClick={onClose}
                        className="w-full bg-[#00A4A3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-[#008c8a] transition"
                    >
                        Keep Appointment
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className="w-full border border-red-200 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Cancel Appointment
                    </button>
                </div>
            </div>
        </Modal>
    );
}
