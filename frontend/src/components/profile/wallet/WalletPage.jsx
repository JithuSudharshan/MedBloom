import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, Loader2, CheckCircle2, Clock, XCircle, Banknote } from 'lucide-react';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/animations/Success.json';
import rejectedAnimation from '../../../assets/animations/Rejected.json';
import TopUpModal from './TopUpModal';
import { Pagination } from '../../ui/Pagination';
import { fetchPatientWallet, initiatePatientTopUp, verifyPatientTopUp } from '../../../api/patientApi';
import { fetchDoctorWallet, initiateDoctorTopUp, verifyDoctorTopUp } from '../../../api/doctorApi';
import { showToast } from '../../ui/Toast';

const WalletPage = ({ userRole }) => {
    const isDoctor = userRole === 'doctor';

    // Theme Colors
    const themeBg = isDoctor ? 'bg-[#FCF8F8]' : 'bg-[#F8FDFD]';
    const primaryText = isDoctor ? 'text-[#6B3B3D]' : 'text-[#00A4A3]';
    const primaryBg = isDoctor ? 'bg-[#6B3B3D]' : 'bg-[#00A4A3]';
    const primaryHover = isDoctor ? 'hover:bg-[#5a3133]' : 'hover:bg-teal-700';
    const secondaryBg = isDoctor ? 'bg-[#F8E9EA]' : 'bg-teal-50';
    const secondaryHover = isDoctor ? 'hover:bg-[#f1d7d8]' : 'hover:bg-teal-100';

    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed'


    // Pagination & Filter State
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const ITEMS_PER_PAGE = 7;

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const filteredTransactions = useMemo(() => {
        if (filter === 'Credit') return transactions.filter(t => t.type === 'credit');
        if (filter === 'Debit') return transactions.filter(t => t.type === 'debit');
        return transactions;
    }, [transactions, filter]);

    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

    const loadWalletData = useCallback(async () => {
        try {
            setLoading(true);
            const res = isDoctor ? await fetchDoctorWallet() : await fetchPatientWallet();
            if (res?.data?.success) {
                setBalance(res.data.walletBalance);
                setTransactions(res.data.transactions);
            }
        } catch (error) {
            console.error("Failed to load wallet data:", error);
            showToast.error("Could not load wallet data");
        } finally {
            setLoading(false);
        }
    }, [isDoctor]);

    useEffect(() => {
        loadWalletData();
    }, [loadWalletData]);

    const handleTopUp = async (amount) => {
        try {
            // 1. Initiate Top Up
            const initRes = isDoctor ? await initiateDoctorTopUp(amount) : await initiatePatientTopUp(amount);

            if (!initRes?.data?.success) {
                throw new Error("Failed to initialize payment");
            }

            const { orderId, amount: rzpAmount, keyId } = initRes.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: keyId,
                amount: rzpAmount,
                currency: "INR",
                name: "MedBloom Wallet",
                description: "Add funds to wallet",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const paymentData = {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            amount: amount
                        };

                        // 3. Verify Payment
                        const verifyRes = isDoctor ? await verifyDoctorTopUp(paymentData) : await verifyPatientTopUp(paymentData);

                        if (verifyRes?.data?.success) {
                            setIsTopUpOpen(false);
                            setPaymentStatus('success');
                            setBalance(verifyRes.data.walletBalance);
                            loadWalletData(); // reload transactions
                            setTimeout(() => setPaymentStatus(null), 3500);
                        }
                    } catch (verifyError) {
                        console.error("Payment verification failed:", verifyError);
                        setIsTopUpOpen(false);
                        setPaymentStatus('failed');
                        setTimeout(() => setPaymentStatus(null), 3500);
                    }
                },
                theme: {
                    color: isDoctor ? "#6B3B3D" : "#00A4A3"
                },
                modal: {
                    ondismiss: function () {
                        // User closed the Razorpay modal without completing payment
                        setIsTopUpOpen(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                // Programmatically close the Razorpay modal on failure
                rzp.close();

                setIsTopUpOpen(false);
                setPaymentStatus('failed');
                setTimeout(() => setPaymentStatus(null), 3500);
            });
            rzp.open();

        } catch (error) {
            console.error("Top up error:", error);
            showToast.error("Failed to start payment process");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Failed': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Success': return "bg-green-50 text-green-700 border-green-200";
            case 'Pending': return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case 'Failed': return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
                <button
                    onClick={() => setIsTopUpOpen(true)}
                    className={`flex items-center gap-2 ${primaryBg} ${primaryHover} text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md`}
                >
                    <Plus className="w-5 h-5" />
                    Add Funds
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className={`${primaryBg} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
                    <div className="relative z-10">
                        <p className="text-white/80 font-medium mb-1">Available Balance</p>
                        <h2 className="text-4xl font-bold">₹{balance.toFixed(2)}</h2>
                    </div>
                    <div className="relative z-10 flex gap-4 mt-6">
                        <button
                            onClick={() => setIsTopUpOpen(true)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 backdrop-blur-sm"
                        >
                            <ArrowDownLeft className="w-4 h-4" /> Top Up
                        </button>
                    </div>
                    {/* Decorative Background */}
                    <Wallet className="absolute -bottom-6 -right-6 w-40 h-40 text-white/10 rotate-12" />
                </div>

                {/* Ledger Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className={`w-12 h-12 ${secondaryBg} rounded-full flex items-center justify-center mb-4`}>
                        <ArrowDownLeft className={`w-6 h-6 ${primaryText}`} />
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Received</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        ₹{transactions.filter(t => t.type === 'credit' && t.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                    </h3>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <ArrowUpRight className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Spent</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        ₹{transactions.filter(t => t.type === 'debit' && t.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                    </h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
                    <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
                    <div className="flex bg-gray-200/50 p-1 rounded-xl">
                        {['All', 'Credit', 'Debit'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === tab
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className={`w-8 h-8 animate-spin mb-4 ${primaryText}`} />
                        <p>Loading transactions...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                        <div className={`w-16 h-16 ${secondaryBg} rounded-full flex items-center justify-center mb-4`}>
                            <Banknote className={`w-8 h-8 ${primaryText}`} />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg">No transactions yet</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-sm">When you add funds or make payments, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Description</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                    <th className="px-6 py-4 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedTransactions.map((txn) => (
                                    <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {txn.transactionId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(txn.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 min-w-[200px] max-w-[300px]">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`transition-all duration-300 ${expandedRowId === txn._id ? 'whitespace-normal' : 'whitespace-nowrap overflow-hidden text-ellipsis w-full'}`}>
                                                    {txn.description}
                                                </span>
                                                {txn.description.length > 40 && (
                                                    <button
                                                        onClick={() => setExpandedRowId(expandedRowId === txn._id ? null : txn._id)}
                                                        className={`text-[11px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity ${primaryText}`}
                                                    >
                                                        {expandedRowId === txn._id ? 'Show Less' : 'View More'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyle(txn.status)}`}>
                                                    {getStatusIcon(txn.status)}
                                                    {txn.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <div className="px-6 pb-6 pt-2 bg-white flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    total={totalPages}
                                    onChange={setCurrentPage}
                                    userRole={userRole}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <TopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
                onTopUp={handleTopUp}
                userRole={userRole}
            />

            {/* Payment Status Overlays */}
            {paymentStatus === 'success' && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="flex flex-col items-center">
                        <Lottie animationData={successAnimation} loop={false} style={{ width: 250, height: 250 }} />
                        <h2 className={`text-2xl font-bold mt-4 ${primaryText}`}>Top Up Successful!</h2>
                        <p className="text-slate-500 mt-2 font-medium">Funds have been added to your wallet.</p>
                    </div>
                </div>
            )}

            {paymentStatus === 'failed' && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="flex flex-col items-center">
                        <Lottie animationData={rejectedAnimation} loop={false} style={{ width: 200, height: 200 }} />
                        <h2 className="text-2xl font-bold text-red-500 mt-6">Payment Failed</h2>
                        <p className="text-slate-500 mt-2 text-center max-w-sm font-medium">
                            Your transaction could not be processed. If money was deducted, it will be refunded automatically.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPage;
