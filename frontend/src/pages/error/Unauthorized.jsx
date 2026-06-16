import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, HeartPulse, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F0F7F7] flex flex-col relative overflow-hidden font-sans">
            
            {/* Background Medical Mesh/Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-gradient-to-br from-teal-200/50 to-teal-50/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-gradient-to-tl from-[#00A4A3]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle Grid Pattern for Texture */}
            <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(0, 164, 163, 0.15) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

            {/* Floating Medical Icons */}
            <motion.div 
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[25%] left-[15%] text-teal-600/30 hidden lg:block"
            >
                <Activity size={56} strokeWidth={1} />
            </motion.div>
            
            <motion.div 
                animate={{ y: [0, 25, 0], opacity: [0.15, 0.4, 0.15] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[25%] right-[12%] text-teal-600/30 hidden lg:block"
            >
                <HeartPulse size={72} strokeWidth={1} />
            </motion.div>

            {/* Header / Logo */}
            <div className="relative z-20 w-full p-8 sm:px-12 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-[#006666] flex items-center justify-center shadow-lg border border-teal-400/30">
                        <span className="text-white font-extrabold text-xl leading-none tracking-tighter">M</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#004d4d]">MEDBLOOM</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10 mb-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl bg-white/70 backdrop-blur-2xl border border-white shadow-[0_30px_60px_-15px_rgba(0,102,102,0.15)] rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden"
                >
                    {/* Inner Decorative Shine */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00A4A3] to-transparent opacity-60" />

                    {/* Icon Container with elegant pulsing */}
                    <div className="relative w-32 h-32 mx-auto mb-10">
                        {/* Soft Outer Glow */}
                        <div className="absolute inset-0 bg-rose-200/50 rounded-full blur-2xl animate-pulse" />
                        {/* Middle Ring */}
                        <div className="absolute inset-2 bg-rose-100 rounded-full animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                        {/* Inner Circle */}
                        <div className="relative w-full h-full bg-gradient-to-b from-white to-rose-50 text-rose-500 rounded-full border-[8px] border-white shadow-xl flex items-center justify-center z-10">
                            <ShieldAlert className="w-14 h-14" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-4 mb-12">
                        <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-rose-500 uppercase">Error 401 / 403</h2>
                        <h1 className="text-4xl sm:text-[3rem] font-extrabold text-[#004d4d] tracking-tight leading-tight">
                            Access Restricted
                        </h1>
                        <p className="text-[#5a7a7a] text-[16px] sm:text-lg leading-relaxed max-w-lg mx-auto">
                            You've ventured into a restricted area. Please ensure you're logged into the correct account to access this module.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-[#006666] bg-white border-2 border-teal-100 hover:bg-teal-50 hover:border-teal-200 transition-all shadow-sm active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#00A4A3] to-[#007A7A] hover:from-[#008F8F] hover:to-[#006666] transition-all shadow-[0_10px_20px_-10px_rgba(0,164,163,0.5)] hover:shadow-[0_10px_25px_-5px_rgba(0,164,163,0.6)] active:scale-95"
                        >
                            Return to Homepage
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Support Link */}
                    <div className="mt-14 pt-8 border-t border-teal-900/10">
                        <p className="text-sm text-gray-500 font-medium">
                            Think this is a mistake? <span className="text-[#008C89] hover:text-teal-800 cursor-pointer underline underline-offset-4 decoration-[#008C89]/30 hover:decoration-teal-700 transition-all">Contact Support</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
