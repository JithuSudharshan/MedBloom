import React, { useState } from 'react';
import { Mail, Phone, User, X, Check } from 'lucide-react';
import dayjs from 'dayjs';

export default function InquiryDetailModal({ enquiry, notification, onClose }) {
    const [copied, setCopied] = useState(null);

    if (!enquiry) return null;

    const handleCopy = (value, key) => {
        navigator.clipboard.writeText(value);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_50px_-12px_rgba(13,148,136,0.2)] w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 text-white text-center relative overflow-hidden">
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]"></div>
                    
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-inner relative z-10">
                        <Mail className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    
                    <h3 className="text-xl font-bold tracking-tight relative z-10">Contact Inquiry</h3>
                    {!notification?.read && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-white text-teal-700 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm relative z-10">
                            New
                        </span>
                    )}
                </div>

                {/* Body Details */}
                <div className="p-6 flex flex-col gap-4 bg-slate-50/30">
                    
                    {/* Name Row */}
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-teal-200 hover:shadow-md group">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Full Name</p>
                            <p className="text-[15px] font-bold text-slate-800 truncate">{enquiry.name}</p>
                        </div>
                        <button 
                            onClick={() => handleCopy(enquiry.name, 'name')}
                            className="p-2 rounded-xl text-slate-400 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            title="Copy Name"
                        >
                            {copied === 'name' ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>}
                        </button>
                    </div>

                    {/* Email Row */}
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-teal-200 hover:shadow-md group">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                            <p className="text-[15px] font-bold text-slate-800 truncate">{enquiry.email}</p>
                        </div>
                        <button 
                            onClick={() => handleCopy(enquiry.email, 'email')}
                            className="p-2 rounded-xl text-slate-400 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            title="Copy Email"
                        >
                            {copied === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>}
                        </button>
                    </div>

                    {/* Phone Row */}
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-teal-200 hover:shadow-md group">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                            <p className="text-[15px] font-bold text-slate-800 truncate">{enquiry.phone}</p>
                        </div>
                        <button 
                            onClick={() => handleCopy(enquiry.phone, 'phone')}
                            className="p-2 rounded-xl text-slate-400 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            title="Copy Phone"
                        >
                            {copied === 'phone' ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>}
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-2 flex flex-col gap-4 bg-slate-50/30">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 transition-all active:scale-[0.98]"
                    >
                        Close Details
                    </button>
                    <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                        Received {dayjs(enquiry.createdAt || notification?.timestamp).format('MMM DD, YYYY [at] hh:mm A')}
                    </p>
                </div>
            </div>
        </div>
    );
}
