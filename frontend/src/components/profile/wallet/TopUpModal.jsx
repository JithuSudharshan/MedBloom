import React, { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { showToast } from '../../ui/Toast';

const TopUpModal = ({ isOpen, onClose, onTopUp, userRole }) => {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const predefinedAmounts = [500, 1000, 2000, 5000];

    const isDoctor = userRole === 'doctor';
    const primaryColor = isDoctor ? 'bg-[#6B3B3D]' : 'bg-[#00A4A3]';
    const primaryHover = isDoctor ? 'hover:bg-[#5a3133]' : 'hover:bg-teal-700';
    const focusRing = isDoctor ? 'focus:ring-[#6B3B3D]/20 focus:border-[#6B3B3D]' : 'focus:ring-[#00A4A3]/20 focus:border-[#00A4A3]';
    const pillActive = isDoctor ? 'bg-[#F8E9EA] border-[#6B3B3D] text-[#6B3B3D]' : 'bg-teal-50 border-[#00A4A3] text-[#00A4A3]';
    const pillInactive = 'bg-white border-gray-200 text-gray-600 hover:border-gray-300';

    const handleProceed = async () => {
        const numAmount = Number(amount);
        if (!numAmount || numAmount < 100) {
            showToast.error("Please enter a valid amount (Min: ₹100)");
            return;
        }
        
        setIsProcessing(true);
        try {
            await onTopUp(numAmount);
        } finally {
            setIsProcessing(false);
            setAmount('');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className={`${primaryColor} px-6 py-4 flex justify-between items-center text-white`}>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Add Funds to Wallet
                    </h2>
                    <button 
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount (₹)</label>
                    <div className="relative mb-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input 
                            type="number" 
                            min="100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 transition-all ${focusRing}`}
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-8">
                        {predefinedAmounts.map(val => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setAmount(val.toString())}
                                disabled={isProcessing}
                                className={`py-2 px-1 text-sm font-medium rounded-lg border transition-colors ${
                                    amount === val.toString() ? pillActive : pillInactive
                                }`}
                            >
                                +₹{val}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleProceed}
                            disabled={isProcessing || !amount || Number(amount) < 100}
                            className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2 ${primaryColor} ${primaryHover}`}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing
                                </>
                            ) : (
                                `Proceed to Pay`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;
