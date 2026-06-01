import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import successAnimation from '../../assets/animations/Success.json';
import { createOrderForAppointment, verifyPaymentForAppointment, reschedulePatientAppointment, fetchPatientWallet, bookAppointmentWithWalletApi } from '../../api/patientApi';
import { motion } from 'framer-motion';
import { Star, Award, Users, MapPin, BadgeCheck, Loader2 } from 'lucide-react';
import PatientSlotPicker from '../../components/ui/PatientSlotPicker';
import { fetchPublicDoctorProfile } from '../../api/landingPageApi';
import Loader from '../../components/ui/Loading';
import { useAuth } from '../../context/AuthContext';

export default function PublicDoctorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    // Check for reschedule parameters
    const searchParams = new URLSearchParams(location.search);
    const isReschedule = searchParams.get('reschedule') === 'true';
    const oldAppointmentId = searchParams.get('oldId');
    const oldMode = searchParams.get('oldMode');

    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    // Dynamic Razorpay Script Load
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };
        loadRazorpayScript();
    }, []);

    useEffect(() => {
        const loadWallet = async () => {
            try {
                const res = await fetchPatientWallet();
                if (res.data?.success) {
                    setWalletBalance(res.data.walletBalance);
                }
            } catch (error) {
                // Ignore errors (guest user or doctor)
            }
        };
        loadWallet();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetchPublicDoctorProfile(id);
                if (response.data.success) {
                    setDoctorData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load doctor profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <Loader />;
    if (!doctorData) return <div className="p-8 text-center text-gray-500">Doctor not found.</div>;

    const user = doctorData.user || {};
    const doctor = doctorData;

    const handleConfirmBooking = async (slotIso, selectedDate, mode, paymentMethod = 'razorpay') => {
        if (!isAuthenticated) {
            toast.error("Please login to book an appointment");
            navigate('/login', { state: { from: location } });
            return;
        }

        try {
            setIsProcessing(true);
            
            if (isReschedule) {
                // Handle Reschedule Flow
                try {
                    const res = await reschedulePatientAppointment(oldAppointmentId, selectedDate, slotIso, mode);
                    if (res.data?.success) {
                        toast.success("Appointment rescheduled successfully!");
                        setIsSuccess(true);
                        setTimeout(() => navigate('/patient/appointments'), 3000);
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message || "Failed to reschedule appointment.");
                } finally {
                    setIsProcessing(false);
                }
                return;
            }

            // Wallet Payment Flow
            if (paymentMethod === 'wallet') {
                const res = await bookAppointmentWithWalletApi({
                    doctorId: doctor._id,
                    date: selectedDate,
                    slot: slotIso,
                    mode: mode
                });
                
                if (res.data?.success) {
                    setIsSuccess(true);
                    setTimeout(() => navigate('/patient/appointments'), 3000);
                }
                return;
            }

            // 1. Create Order (Booking Flow for Razorpay)
            const orderRes = await createOrderForAppointment({
                doctorId: doctor._id,
                date: selectedDate, 
                slot: slotIso,
                mode: mode
            });

            const { order, keyId, appointmentId } = orderRes.data;

            // 2. Open Razorpay Modal
            const options = {
                key: keyId,
                amount: order.amount,
                currency: order.currency,
                name: "MedBloom Health",
                description: `Consultation with Dr. ${doctor.displayName}`,
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        setIsProcessing(true);
                        const verifyRes = await verifyPaymentForAppointment({
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            appointmentId: appointmentId
                        });

                        if (verifyRes.data.success) {
                            setIsSuccess(true);
                            setTimeout(() => {
                                navigate('/patient/appointments');
                            }, 3000);
                        }
                    } catch (error) {
                        toast.error("Payment verification failed. Please contact support.");
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#00A4A3"
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error("Payment failed. Please try again.");
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to initiate booking");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen w-full bg-slate-50 lg:overflow-hidden font-sans">
            <div className="max-w-[1600px] mx-auto h-full p-4 lg:p-8">
                
                {/* 2-Column No-Scroll Layout Container */}
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                    
                    {/* ========================================================= */}
                    {/* LEFT SECTION: Identity & Trust (60%) */}
                    {/* ========================================================= */}
                    <div className="w-full lg:w-[60%] flex flex-col justify-center h-full space-y-8 pr-0 lg:pr-8">
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-8"
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                                    <img 
                                        src={doctor.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"} 
                                        alt={doctor.displayName || "Doctor"} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-lg">
                                    <div className="bg-[#00A4A3] text-white p-2 rounded-full">
                                        <BadgeCheck className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Header */}
                            <div className="flex flex-col justify-center text-center sm:text-left mt-2 sm:mt-4">
                                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                                    {doctor.displayName || user.name || "Doctor"}
                                </h1>
                                <p className="text-xl text-slate-600 font-medium mb-4 flex items-center justify-center sm:justify-start gap-2">
                                    {doctor.primarySpecialization || "Specialist"}
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1 text-sm text-slate-500">
                                        <MapPin className="w-4 h-4" /> {doctor.location || "Clinic"}
                                    </span>
                                </p>
                                
                                {/* Bio Section (Scrollable 4-5 lines to keep viewport fixed) */}
                                <div className="max-h-[80px] overflow-y-auto pr-4 text-slate-500 leading-relaxed
                                    [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                                    <p>{doctor.shortBio || doctor.about || "No biography available at this time."}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* The Trust Row */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        >
                            {/* Rating */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center sm:items-start transition-all hover:shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{doctor.rating || "New"}</h3>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Rating</p>
                            </div>

                            {/* Experience */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center sm:items-start transition-all hover:shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-[#EBFFFF] flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-[#00A4A3]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{doctor.yearOfExperience || 0}+ Years</h3>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Experience</p>
                            </div>

                            {/* Patients */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center sm:items-start transition-all hover:shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-[#EBFFFF] flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-[#00A4A3]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{doctor.numberOfPatientsTreated || 0}+</h3>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Happy Patients</p>
                            </div>
                        </motion.div>

                    </div>

                    {/* ========================================================= */}
                    {/* RIGHT SECTION: Functional Column (40%) - Step 2 */}
                    {/* ========================================================= */}
                    <div className="w-full lg:w-[40%] h-full flex flex-col">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="h-full"
                        >
                            <PatientSlotPicker
                                doctorId={id}
                                availabilityConfig={doctorData.availabilityConfig}
                                doctorData={doctor}
                                onConfirm={handleConfirmBooking}
                                isReschedule={isReschedule}
                                lockedMode={isReschedule ? oldMode : null}
                                walletBalance={walletBalance}
                            />
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Processing Overlay */}
            {isProcessing && !isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-[#00A4A3] animate-spin" />
                        <p className="mt-4 text-lg font-semibold text-slate-700">Securely Processing...</p>
                        <p className="text-sm text-slate-500 text-center max-w-xs mt-2">
                            Please do not close this window or press back.
                        </p>
                    </div>
                </div>
            )}

            {/* Success Overlay with Lottie */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                        <Lottie 
                            animationData={successAnimation} 
                            loop={false} 
                            style={{ width: 300, height: 300 }} 
                        />
                        <h2 className="text-3xl font-bold text-[#00A4A3] mt-4">Booking Confirmed!</h2>
                        <p className="text-slate-500 mt-2">Redirecting to your dashboard...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
