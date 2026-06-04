import React, { useState, useEffect } from 'react';
import Modal from '../../profile/Modal';
import { AlertCircle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { getRefundEstimateApi } from '../../../api/patientApi';

export default function CancelAppointmentModal({ isOpen, onClose, onConfirm, appointment }) {
    const [reason, setReason] = useState('');
    const [refundData, setRefundData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && appointment && (appointment.id || appointment._id)) {
            const fetchEstimate = async () => {
                setLoading(true);
                try {
                    const res = await getRefundEstimateApi(appointment.id || appointment._id);
                    if (res.data?.success) {
                        setRefundData({
                            percentage: res.data.refundPercentage,
                            amount: res.data.refundAmount
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch refund estimate", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchEstimate();
        } else {
            setRefundData(null);
        }
    }, [isOpen, appointment]);

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    let alertColor = '';
    let AlertIcon = null;

    if (refundData) {
        if (refundData.percentage === 100) {
            alertColor = 'bg-emerald-50 border-emerald-200 text-emerald-700';
            AlertIcon = CheckCircle;
        } else if (refundData.percentage === 50) {
            alertColor = 'bg-amber-50 border-amber-200 text-amber-700';
            AlertIcon = Info;
        } else {
            alertColor = 'bg-rose-50 border-rose-200 text-rose-700';
            AlertIcon = AlertCircle;
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2 sm:p-6 flex flex-col gap-6 max-w-md w-full">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">Cancel Appointment</h2>
                    <p className="text-slate-500 text-sm">
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-6 h-6 text-[#00A4A3] animate-spin" />
                        <span className="ml-2 text-sm text-slate-500">Calculating refund estimate...</span>
                    </div>
                ) : refundData !== null ? (
                    <div className={`p-4 rounded-xl border flex gap-3 items-start ${alertColor}`}>
                        <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <strong className="block mb-1">
                                {refundData.percentage === 100 ? '100% Refund Available' : refundData.percentage === 50 ? '50% Refund Available' : 'No Refund Available'}
                            </strong>
                            <p>
                                {refundData.percentage === 100 
                                    ? `You are cancelling more than 24 hours in advance. You will receive a full refund of ₹${refundData.amount} to your wallet.`
                                    : refundData.percentage === 50
                                    ? `You are cancelling within 24 hours. You will receive a partial refund of ₹${refundData.amount} to your wallet.`
                                    : `You are cancelling less than 1 hour before the appointment. As per policy, you will not receive a refund.`
                                }
                            </p>
                        </div>
                    </div>
                ) : null}

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
