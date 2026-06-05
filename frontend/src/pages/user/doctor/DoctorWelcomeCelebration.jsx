import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, Sparkles, Stethoscope, ArrowRight } from 'lucide-react';
import api from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';

export default function DoctorWelcomeCelebration() {
    const navigate = useNavigate();
    const { user, loading } = useAuth() || {};
    const [isLoading, setIsLoading] = useState(false);
    
    // Use user data from AuthContext
    const docName = user?.name || "Doctor";
    const defaultPic = user?.avatar || user?.profile_url || null;
    const [realProfilePic, setRealProfilePic] = useState(defaultPic);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const res = await api.get('/doctor/profile');
                if (res.data?.details?.avatar?.src) {
                    setRealProfilePic(res.data.details.avatar.src);
                }
            } catch (error) {
                console.error("Failed to fetch real profile pic:", error);
            }
        };
        fetchDoctorProfile();
    }, []);

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            // Mark welcome as seen on backend
            await api.patch('/doctor/welcome-seen');
            
            
            navigate('/doctor/dashboard');
        } catch (error) {
            console.error("Error marking welcome as seen:", error);
            // Navigate anyway so they aren't stuck
            navigate('/doctor/dashboard');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#FCF8F8] flex items-center justify-center">Loading...</div>;
    }

    // Particle effect configuration
    const particles = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        scale: Math.random() * 0.8 + 0.5,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="min-h-screen bg-[#FCF8F8] flex items-center justify-center relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#B08B8C] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6B3B3D] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
            
            {/* Floating Particles (Confetti Alternative) */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{ 
                        opacity: [0, 1, 0],
                        x: particle.x,
                        y: particle.y,
                        scale: particle.scale,
                        rotate: particle.rotation
                    }}
                    transition={{
                        duration: 2.5 + Math.random() * 2,
                        ease: "easeOut",
                        delay: Math.random() * 0.5
                    }}
                    className={`absolute z-0 w-3 h-3 rounded-full ${Math.random() > 0.5 ? 'bg-[#B08B8C]' : 'bg-[#6B3B3D]'}`}
                    style={{ left: '50%', top: '50%' }}
                />
            ))}

            <motion.div 
                className="relative z-10 w-full max-w-2xl px-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(176,139,140,0.3)] border border-white/50 text-center relative">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-tr from-[#6B3B3D] to-[#B08B8C] rounded-2xl flex items-center justify-center shadow-lg border-4 border-white transform rotate-12"
                    >
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Profile Picture */}
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                        className="w-32 h-32 mx-auto rounded-full border-[6px] border-white shadow-xl overflow-hidden mt-6 mb-8 relative"
                    >
                        {realProfilePic ? (
                            <img src={realProfilePic} alt="Doctor Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#FCF8F8] flex items-center justify-center text-[#B08B8C]">
                                <Stethoscope className="w-12 h-12 opacity-50" />
                            </div>
                        )}
                        <div className="absolute inset-0 border-2 border-[#B08B8C]/20 rounded-full"></div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-[#B08B8C]" />
                            <h2 className="text-[#B08B8C] font-semibold tracking-wider uppercase text-sm">Profile Approved</h2>
                            <Sparkles className="w-5 h-5 text-[#B08B8C]" />
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold text-[#6B3B3D] mb-4">
                            Welcome, Dr. {docName.replace('Dr. ', '')}!
                        </h1>
                        
                        <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                            Your professional profile has been verified and approved by the MedBloom administration. You are now fully active and can start managing consultations.
                        </p>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <button
                            onClick={handleContinue}
                            disabled={isLoading}
                            className="group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#6B3B3D] to-[#8C6264] rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? "Setting up..." : "Enter Professional Hub"}
                                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
