import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Save, Loader2, FileText, Plus, Trash2, PanelRightClose, PanelRightOpen, History, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import ReviewModal from '../../components/profile/appointments/ReviewModal';
import { fetchPatientRecordsForConsultation, completeConsultationApi, savePrescriptionApi } from '../../api/doctorApi';
import { fetchAppointmentDetailsForConsultation } from '../../api/patientApi';

// Using exact theme colors from the app
const DOCTOR_THEME = {
    primary: '#b08b8c',
    bg: 'bg-[#fcf8f8]',
    border: 'border-[#b08b8c]',
    text: 'text-[#b08b8c]',
    button: 'bg-[#b08b8c] hover:bg-[#9a7677]'
};

const PATIENT_THEME = {
    primary: '#00A4A3',
    bg: 'bg-[#F8FDFD]',
    border: 'border-[#00A4A3]',
    text: 'text-[#00A4A3]',
    button: 'bg-[#00A4A3] hover:bg-[#008c8a]'
};

export default function VideoConsultationRoom() {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isDoctor = user?.role === 'doctor';
    
    const theme = isDoctor ? DOCTOR_THEME : PATIENT_THEME;

    // UI States
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('prescription'); // 'prescription', 'records'
    
    // Call States
    const [localStream, setLocalStream] = useState(null);
    const [hasRemoteStream, setHasRemoteStream] = useState(false);
    const [trackCount, setTrackCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callStatus, setCallStatus] = useState('joining'); // joining, waiting, connected, ended

    // Prescription States
    const [medications, setMedications] = useState([
        { medication: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
    const [privateNotes, setPrivateNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasSubmittedPrescription, setHasSubmittedPrescription] = useState(false);

    // Records States
    const [patientRecords, setPatientRecords] = useState([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);

    // Consultation Details (for patient view)
    const [consultationDetails, setConsultationDetails] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // WebRTC Refs
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(new MediaStream());
    const pendingCandidates = useRef([]);
    const isNegotiating = useRef(false);

    // Fetch Patient Records for Doctor
    useEffect(() => {
        if (isDoctor && appointmentId) {
            const getRecords = async () => {
                setIsLoadingRecords(true);
                try {
                    const res = await fetchPatientRecordsForConsultation(appointmentId);
                    if (res.data.success) {
                        setPatientRecords(res.data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch records", err);
                } finally {
                    setIsLoadingRecords(false);
                }
            };
            getRecords();
        } else if (!isDoctor && appointmentId) {
            const getConsultationDetails = async () => {
                try {
                    const res = await fetchAppointmentDetailsForConsultation(appointmentId);
                    if (res.data.success) {
                        setConsultationDetails(res.data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch consultation details", err);
                }
            };
            getConsultationDetails();
        }
    }, [isDoctor, appointmentId]);

    // Prevent doctor from accidentally refreshing/closing tab before prescription is submitted
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDoctor && !hasSubmittedPrescription && (callStatus === 'connected' || callStatus === 'in_progress' || callStatus === 'waiting')) {
                e.preventDefault();
                e.returnValue = "You have an active consultation and haven't submitted a prescription yet. Are you sure you want to leave?";
                return e.returnValue;
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDoctor, hasSubmittedPrescription, callStatus]);

    // Fetch media and init socket
    useEffect(() => {
        let isMounted = true;

        const initCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                
                if (!isMounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                setLocalStream(stream);
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                
                socketRef.current = io('http://localhost:5000', {
                    withCredentials: true,
                    query: { userId: user?._id }
                });

                socketRef.current.emit('join-consultation', { appointmentId, userRole: user?.role });
                setCallStatus('waiting');

                socketRef.current.on('user-joined', handleUserJoined);
                socketRef.current.on('consultation-started', (data) => {
                    setCallStatus('in_progress');
                    if (user?.role === 'doctor' && isMounted) {
                        setTimeout(() => initiateOffer(), 500);
                    }
                });
                socketRef.current.on('offer', handleReceiveOffer);
                socketRef.current.on('answer', handleReceiveAnswer);
                socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
                socketRef.current.on('user-left', handleUserLeft);
                
                socketRef.current.on('consultation-ended', () => {
                    toast.success("The doctor has completed the consultation.");
                    if (!isDoctor) {
                        setShowReviewModal(true);
                    } else {
                        endCall(true);
                    }
                });

                socketRef.current.on('call-error', (data) => {
                    toast.error(data.message);
                    endCall(true);
                });

            } catch (err) {
                if (isMounted) {
                    console.error("Media access denied:", err);
                    toast.error(`Media Error: ${err.name} - ${err.message}`);
                    setCallStatus('ended');
                }
            }
        };

        initCall();

        return () => {
            isMounted = false;
            endCall(false); 
        };
    }, []);

    // Assign remote stream when it changes
    useEffect(() => {
        if (remoteVideoRef.current && hasRemoteStream) {
            if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
                remoteVideoRef.current.srcObject = remoteStreamRef.current;
                remoteVideoRef.current.play().catch(e => console.log("Video play error ignored"));
            }
        }
    }, [hasRemoteStream, trackCount]);

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', {
                    appointmentId,
                    candidate: event.candidate
                });
            }
        };

        peer.onnegotiationneeded = async () => {
            if (isNegotiating.current) return;
            isNegotiating.current = true;
            try {
                await initiateOffer();
            } finally {
                isNegotiating.current = false;
            }
        };

        peer.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                if (!remoteStreamRef.current.getTrackById(track.id)) {
                    remoteStreamRef.current.addTrack(track);
                }
            });
            setTrackCount(prev => prev + 1);
            setHasRemoteStream(true);
            setCallStatus('connected');
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, localStreamRef.current);
            });
        }

        return peer;
    };

    const initiateOffer = async () => {
        if (!peerRef.current) peerRef.current = createPeer();
        
        try {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', { appointmentId, offer });
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    };

    const handleUserJoined = () => {
        // Handled by consultation-started
    };

    const handleReceiveOffer = async (data) => {
        if (!peerRef.current) peerRef.current = createPeer();
        
        try {
            if (peerRef.current.signalingState !== "stable") {
                await Promise.all([
                    peerRef.current.setLocalDescription({type: "rollback"}),
                    peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer))
                ]);
            } else {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            }

            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socketRef.current.emit('answer', { appointmentId, answer });

            for (const candidate of pendingCandidates.current) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidates.current = [];
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    };

    const handleReceiveAnswer = async (data) => {
        if (!peerRef.current) return;
        try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            for (const candidate of pendingCandidates.current) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidates.current = [];
        } catch (err) {
            console.error("Error handling answer:", err);
        }
    };

    const handleNewICECandidateMsg = async (data) => {
        if (peerRef.current && peerRef.current.remoteDescription) {
            try {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (err) {
                console.error("Error adding ice candidate:", err);
            }
        } else {
            pendingCandidates.current.push(data.candidate);
        }
    };

    const handleUserLeft = () => {
        toast.info("The other person has left the room.");
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        remoteStreamRef.current = new MediaStream();
        setHasRemoteStream(false);
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
        setCallStatus('waiting');
    };

    // Controls
    const toggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const endCall = (shouldNavigate = true, force = false) => {
        if (isDoctor && !hasSubmittedPrescription && shouldNavigate && callStatus !== 'ended' && !force) {
            toast.error("Please submit a prescription before ending the call.");
            return;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerRef.current) {
            peerRef.current.close();
        }
        if (socketRef.current) {
            socketRef.current.emit('leave-consultation', { appointmentId });
            socketRef.current.disconnect();
        }
        setCallStatus('ended');
        
        if (shouldNavigate && !showReviewModal) {
            navigate(`/${isDoctor ? 'doctor' : 'patient'}/appointments`);
        }
    };

    // Prescription Handlers
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

    const handleSavePrescription = async () => {
        const validMedications = medications.filter(m => m.medication.trim() !== '');
        
        if (validMedications.length === 0) {
            toast.error("Please add at least one medication.");
            return;
        }

        for (const med of validMedications) {
            if (!med.dosage.trim() || !med.frequency.trim() || !med.duration.trim()) {
                toast.error(`Please fill in Dosage, Frequency, and Duration for ${med.medication}`);
                return;
            }
        }

        setIsSaving(true);
        try {
            await savePrescriptionApi(appointmentId, {
                prescription: validMedications,
                notes: privateNotes
            });
            
            setHasSubmittedPrescription(true);
            toast.success("Prescription saved successfully!");
        } catch (error) {
            console.error("Save prescription error:", error);
            const errMsg = error.response?.data?.message || "Failed to save prescription.";
            toast.error(errMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompleteConsultation = async () => {
        if (!hasSubmittedPrescription) {
            toast.error("Please submit a prescription before completing the consultation.");
            return;
        }

        try {
            await completeConsultationApi(appointmentId);
            toast.success("Consultation completed successfully.");
            if (socketRef.current) {
                socketRef.current.emit('end-consultation', { appointmentId });
            }
            endCall(true, true);
        } catch (error) {
            console.error("Complete consultation error:", error);
            const errMsg = error.response?.data?.message || "Failed to complete consultation.";
            toast.error(errMsg);
        }
    };

    return (
        <div className={`h-screen overflow-hidden ${theme.bg} p-4 sm:p-6 flex flex-col font-sans relative`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 shrink-0">
                <div>
                    <h1 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>Virtual Consultation</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">Appointment ID: #{appointmentId}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${theme.border} ${theme.text} hidden sm:block`}>
                        {callStatus === 'joining' && 'Requesting Media...'}
                        {callStatus === 'waiting' && 'Waiting for other person...'}
                        {(callStatus === 'connected' || callStatus === 'in_progress') && 'Call Connected'}
                        {callStatus === 'ended' && 'Call Ended'}
                    </div>
                    <button 
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className={`p-2 rounded-lg border transition-all ${isDrawerOpen ? `bg-[${theme.primary}] text-white` : `bg-white ${theme.text}`} ${theme.border}`}
                    >
                        {isDrawerOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex gap-4 sm:gap-6 flex-1 h-[calc(100vh-100px)] relative overflow-hidden">
                
                {/* Main Video Area (Left) */}
                <div className={`flex-1 bg-black rounded-3xl overflow-hidden relative shadow-lg flex flex-col transition-all duration-300`}>
                    
                    {/* Remote Video (Full Size) */}
                    {hasRemoteStream ? (
                        <video 
                            ref={remoteVideoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/50">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-white/30" />
                            <p>{callStatus === 'waiting' ? 'Waiting for someone to join...' : 'Connecting...'}</p>
                        </div>
                    )}

                    {/* Local Video (PiP Anchored Bottom Right) */}
                    <div className="absolute bottom-24 right-6 w-28 h-40 sm:w-32 sm:h-48 md:w-48 md:h-64 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-10 transition-all duration-300">
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                        />
                        {isVideoOff && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <VideoOff className="w-8 h-8 text-white/50" />
                            </div>
                        )}
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4 sm:gap-6 items-center">
                        <button 
                            onClick={toggleMute}
                            className={`p-3 sm:p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'}`}
                        >
                            {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </button>
                        
                        {!isDoctor && (
                            <button 
                                onClick={() => endCall(true)}
                                className="p-4 sm:p-5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                            >
                                <PhoneOff className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        )}

                        <button 
                            onClick={toggleVideo}
                            className={`p-3 sm:p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'}`}
                        >
                            {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </button>

                        {/* Doctor Quick Actions in Control Bar when Drawer is closed */}
                        {isDoctor && !isDrawerOpen && (
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className={`px-4 py-3 sm:py-4 rounded-full text-white font-semibold transition-all backdrop-blur-md shadow-md bg-white/20 hover:bg-white/30`}
                            >
                                Open Pad
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Drawer */}
                <div className={`absolute lg:relative top-0 right-0 h-full w-[100%] sm:w-[400px] bg-white rounded-3xl shadow-2xl lg:shadow-sm border border-slate-100 flex flex-col transition-all duration-300 z-40 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-[120%] hidden lg:block lg:w-0 lg:opacity-0 lg:border-none lg:overflow-hidden lg:p-0'}`}>
                    
                    {isDoctor ? (
                        <div className="flex flex-col h-full overflow-hidden w-full sm:w-[400px] shrink-0">
                            {/* Tabs Header */}
                            <div className="flex items-center border-b border-slate-100 shrink-0">
                                <button 
                                    onClick={() => setActiveTab('prescription')} 
                                    className={`flex-1 py-4 text-sm font-semibold transition-all ${activeTab === 'prescription' ? `${theme.text} border-b-2 ${theme.border}` : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Prescription
                                </button>
                                <button 
                                    onClick={() => setActiveTab('records')} 
                                    className={`flex-1 py-4 text-sm font-semibold transition-all ${activeTab === 'records' ? `${theme.text} border-b-2 ${theme.border}` : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Patient Records
                                </button>
                                {/* Mobile Close Drawer Button */}
                                <button onClick={() => setIsDrawerOpen(false)} className="lg:hidden p-4 text-slate-400 hover:text-slate-600">
                                    <PanelRightClose className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8D3D4]">
                                
                                {activeTab === 'prescription' && (
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                                            {medications.map((med, index) => (
                                                <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group">
                                                    {medications.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRow(index)}
                                                            className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 rounded-full text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Medication Name" 
                                                            value={med.medication}
                                                            onChange={(e) => handleChange(index, 'medication', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[${theme.primary}] focus:ring-1 focus:ring-[${theme.primary}]/20 outline-none text-sm`}
                                                        />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Dosage (e.g. 500mg)" 
                                                            value={med.dosage}
                                                            onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[${theme.primary}] focus:ring-1 focus:ring-[${theme.primary}]/20 outline-none text-sm`}
                                                        />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Freq (e.g. 1-0-1)" 
                                                            value={med.frequency}
                                                            onChange={(e) => handleChange(index, 'frequency', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[${theme.primary}] focus:ring-1 focus:ring-[${theme.primary}]/20 outline-none text-sm`}
                                                        />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Duration (e.g. 5 Days)" 
                                                            value={med.duration}
                                                            onChange={(e) => handleChange(index, 'duration', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[${theme.primary}] focus:ring-1 focus:ring-[${theme.primary}]/20 outline-none text-sm`}
                                                        />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Instructions (Optional)" 
                                                        value={med.instructions}
                                                        onChange={(e) => handleChange(index, 'instructions', e.target.value)}
                                                        className={`w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[${theme.primary}] focus:ring-1 focus:ring-[${theme.primary}]/20 outline-none text-xs`}
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={handleAddRow}
                                                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl border-2 border-dashed border-[${theme.primary}]/30 ${theme.text} text-sm font-medium hover:bg-slate-50 transition-all`}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Row
                                            </button>

                                            <div className="flex flex-col gap-1 mt-2">
                                                <label className="text-xs font-semibold text-slate-600">Private Notes (Optional)</label>
                                                <textarea 
                                                    className={`w-full h-24 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[${theme.primary}]/20 resize-none text-sm`}
                                                    placeholder="Add any private notes..."
                                                    value={privateNotes}
                                                    onChange={(e) => setPrivateNotes(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 shrink-0">
                                            <button 
                                                onClick={handleSavePrescription}
                                                disabled={isSaving || medications.filter(m => m.medication.trim() !== '').length === 0}
                                                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''} ${theme.button}`}
                                            >
                                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                {isSaving ? 'Saving...' : (hasSubmittedPrescription ? 'Update Prescription' : 'Submit Prescription')}
                                            </button>

                                            {hasSubmittedPrescription && (
                                                <button 
                                                    onClick={handleCompleteConsultation}
                                                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold transition-all shadow-md"
                                                >
                                                    <PhoneOff className="w-5 h-5" />
                                                    Complete Consultation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'records' && (
                                    <div className="flex flex-col gap-4 h-full">
                                        {isLoadingRecords ? (
                                            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                                <p className="text-sm">Fetching records...</p>
                                            </div>
                                        ) : patientRecords.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-40 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                                <History className="w-8 h-8 mb-2 opacity-50" />
                                                <p className="text-sm">No medical records found.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                                                {patientRecords.map((record) => (
                                                    <div key={record._id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-slate-800 text-sm">{record.title}</h4>
                                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                                    {record.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mb-3">{new Date(record.createdAt).toLocaleDateString()}</p>
                                                            
                                                            <a 
                                                                href={record.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${theme.text} hover:underline`}
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                View Document
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Patient Drawer
                        <div className="p-6 h-full flex flex-col w-full sm:w-[400px] shrink-0">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-bold text-slate-800">Consultation Details</h2>
                                <button onClick={() => setIsDrawerOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
                                    <PanelRightClose className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex-1 flex flex-col items-center pt-8 text-center">
                                <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                                    <img 
                                        src={consultationDetails?.doctor?.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150"} 
                                        alt="Doctor" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {consultationDetails?.doctor?.displayName ? 
                                        (consultationDetails.doctor.displayName.toLowerCase().startsWith('dr') ? 
                                            consultationDetails.doctor.displayName : `Dr. ${consultationDetails.doctor.displayName}`) 
                                        : "Your Doctor"}
                                </h3>
                                <p className="text-sm text-slate-500 mb-8 font-medium">
                                    {consultationDetails?.doctor?.primarySpecialization || "MedBloom Specialist"}
                                </p>
                                
                                <div className="bg-[#E0F7F7] p-6 rounded-2xl border border-[#00A4A3]/20 w-full shadow-sm">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Status</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${callStatus === 'in_progress' ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
                                        <p className={`text-sm ${theme.text} font-bold`}>
                                            {callStatus === 'joining' ? 'Connecting to secure server...' :
                                             callStatus === 'waiting' ? 'Waiting in lobby for doctor...' : 
                                             (callStatus === 'in_progress' || callStatus === 'connected') ? 'Consultation Active' : 'Call Ended'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-8 text-xs text-slate-400 max-w-xs text-center leading-relaxed">
                                    Your consultation is fully encrypted and secure. Please ensure you are in a quiet environment with a stable internet connection.
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Patient Review Modal */}
            {!isDoctor && consultationDetails && (
                <ReviewModal 
                    isOpen={showReviewModal}
                    onClose={() => {
                        setShowReviewModal(false);
                        navigate('/patient/appointments');
                    }}
                    appointment={{
                        id: appointmentId,
                        primaryTitle: consultationDetails.doctor?.displayName ? 
                            (consultationDetails.doctor.displayName.toLowerCase().startsWith('dr') ? 
                                consultationDetails.doctor.displayName : `Dr. ${consultationDetails.doctor.displayName}`) 
                            : "Your Doctor"
                    }}
                    onSuccess={() => {
                        setShowReviewModal(false);
                        navigate('/patient/appointments');
                    }}
                />
            )}
        </div>
    );
}
