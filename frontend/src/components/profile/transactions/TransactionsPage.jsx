import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Banknote, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { fetchPatientWallet } from '../../../api/patientApi';
import { fetchDoctorWallet } from '../../../api/doctorApi';
import { showToast } from '../../ui/Toast';
import { Pagination } from '../../ui/Pagination';
import Loader from '../../ui/Loading';

export default function TransactionsPage({ userRole }) {
    const isDoctor = userRole === 'doctor';

    // Theme Colors
    const primaryBg = isDoctor ? 'bg-[#6B3B3D]' : 'bg-[#00A4A3]';
    const primaryText = isDoctor ? 'text-[#6B3B3D]' : 'text-[#00A4A3]';
    const secondaryBg = isDoctor ? 'bg-[#F8E9EA]' : 'bg-teal-50';

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Pagination State
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const ITEMS_PER_PAGE = 7; // Adjusted to prevent scroll

    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const res = isDoctor ? await fetchDoctorWallet() : await fetchPatientWallet();
            if (res?.data?.success) {
                setTransactions(res.data.transactions);
            }
        } catch (error) {
            console.error("Failed to load transactions:", error);
            showToast.error("Could not load transaction history");
        } finally {
            setLoading(false);
        }
    }, [isDoctor]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // Computed Metrics
    const { totalCredits, totalDebits } = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            if (curr.status !== 'Failed') {
                if (curr.type === 'credit') acc.totalCredits += curr.amount;
                if (curr.type === 'debit') acc.totalDebits += curr.amount;
            }
            return acc;
        }, { totalCredits: 0, totalDebits: 0 });
    }, [transactions]);

    // Filtering
    const filteredTransactions = useMemo(() => {
        if (filter === 'Credits') return transactions.filter(t => t.type === 'credit');
        if (filter === 'Debits') return transactions.filter(t => t.type === 'debit');
        return transactions;
    }, [transactions, filter]);

    // Pagination
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

    // Helpers
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Success': return 'bg-green-50 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
            case 'Refunded': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Success': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'Pending': return <Clock className="w-3.5 h-3.5" />;
            case 'Failed': return <XCircle className="w-3.5 h-3.5" />;
            case 'Refunded': return <ArrowDownLeft className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="w-full flex flex-col gap-6 font-sans h-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className={`w-6 h-6 ${primaryText}`} />
                        Transaction History
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View all your wallet top-ups, bookings, and refunds.
                    </p>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Credits */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <ArrowDownLeft className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Received</p>
                        <p className="text-3xl font-black text-gray-900">₹{totalCredits.toFixed(2)}</p>
                    </div>
                </div>

                {/* Total Debits */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Spent</p>
                        <p className="text-3xl font-black text-gray-900">₹{totalDebits.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Transactions Table Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                {/* Filters */}
                <div className="p-6 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
                    {['All', 'Credits', 'Debits'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${filter === tab
                                ? `${primaryBg} text-white shadow-md`
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table */}
                {transactions.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-64">
                        <div className={`w-16 h-16 rounded-full ${secondaryBg} flex items-center justify-center mb-4`}>
                            <Banknote className={`w-8 h-8 ${primaryText}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No Transactions Found</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm">
                            You haven't made any transactions yet. Your wallet top-ups, bookings, and refunds will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider bg-gray-50/50">
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Mode</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedTransactions.map((txn) => (
                                    <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {txn.transactionId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(txn.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
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
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                                            {txn.paymentGateway === 'razorpay' ? (
                                                <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">Razorpay</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 bg-[#E0F7F7] text-[#00A4A3] rounded-md text-xs font-bold border border-[#00A4A3]/20">Wallet</span>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyle(txn.status)}`}>
                                                    {getStatusIcon(txn.status)}
                                                    {txn.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                            No transactions match the selected filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-6 bg-white border-t border-gray-100 flex justify-center">
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
        </div>
    );
}
