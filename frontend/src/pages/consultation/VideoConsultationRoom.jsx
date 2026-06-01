import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Save, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

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

    const [localStream, setLocalStream] = useState(null);
    const [hasRemoteStream, setHasRemoteStream] = useState(false);
    const [trackCount, setTrackCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callStatus, setCallStatus] = useState('joining'); // joining, waiting, connected, ended

    const [prescriptionText, setPrescriptionText] = useState('');
    const [privateNotes, setPrivateNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(new MediaStream());
    const pendingCandidates = useRef([]);
    const isNegotiating = useRef(false);

    // Fetch media and init socket
    useEffect(() => {
        let isMounted = true;

        const initCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                
                // If component unmounted while waiting for camera, stop tracks and abort
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

                // Join the room
                socketRef.current.emit('join-consultation', { appointmentId, userRole: user?.role });
                setCallStatus('waiting');

                socketRef.current.on('user-joined', handleUserJoined);
                socketRef.current.on('offer', handleReceiveOffer);
                socketRef.current.on('answer', handleReceiveAnswer);
                socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
                socketRef.current.on('user-left', handleUserLeft);
                
                socketRef.current.on('call-error', (data) => {
                    toast.error(data.message);
                    endCall(true);
                });

                // If Doctor, immediately send an offer in case patient is already there
                if (user?.role === 'doctor') {
                    setTimeout(() => {
                        if (isMounted) initiateOffer();
                    }, 1000); // Small delay to ensure listeners are bound
                }

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
            endCall(false); // Cleanup without navigating
        };
    }, []);

    // Assign remote stream when it changes
    useEffect(() => {
        if (remoteVideoRef.current && hasRemoteStream) {
            // Only assign if it's a new stream to prevent interrupting play()
            if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
                remoteVideoRef.current.srcObject = remoteStreamRef.current;
                remoteVideoRef.current.play().catch(e => console.log("Video play error ignored"));
            }
        }
    }, [hasRemoteStream, trackCount]);

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" }
            ]
        });

        peer.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", peer.iceConnectionState);
            if (peer.iceConnectionState === 'failed' || peer.iceConnectionState === 'disconnected') {
                toast.error("Connection failed. ICE state: " + peer.iceConnectionState);
            }
        };

        peer.onconnectionstatechange = () => {
            console.log("Connection State:", peer.connectionState);
        };

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, localStreamRef.current);
            });
        }

        return peer;
    };

    const initiateOffer = async () => {
        if (!isDoctor) return;
        if (isNegotiating.current) return; // Prevent rapid double offers
        isNegotiating.current = true;
        
        try {
            if (peerRef.current) peerRef.current.close();
            // Critical: Reset the media stream to drop any dead tracks from a previous connection
            remoteStreamRef.current = new MediaStream();
            setHasRemoteStream(false);
            
            peerRef.current = createPeer();
            
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', { appointmentId, offer });
        } catch (err) {
            console.error("Error creating offer:", err);
        } finally {
            // Unlock after a delay to allow WebRTC handshake to complete
            setTimeout(() => { isNegotiating.current = false; }, 2000);
        }
    };

    const handleUserJoined = async () => {
        // Only Doctor initiates when someone joins
        if (isDoctor) {
            await initiateOffer();
        }
    };

    const handleReceiveOffer = async ({ offer }) => {
        if (isDoctor) return; // Doctor never processes offers in this architecture
        
        try {
            if (peerRef.current) peerRef.current.close();
            // Critical: Reset the media stream to drop any dead tracks from a previous connection
            remoteStreamRef.current = new MediaStream();
            setHasRemoteStream(false);
            pendingCandidates.current = []; // Clear old candidates
            peerRef.current = createPeer();
            
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socketRef.current.emit('answer', { appointmentId, answer });
            setCallStatus('connected');
            
            processPendingCandidates();
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    };

    const handleReceiveAnswer = async ({ answer }) => {
        if (!isDoctor) return; // Patient never processes answers
        
        try {
            if (peerRef.current && peerRef.current.signalingState !== 'stable') {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                setCallStatus('connected');
                
                processPendingCandidates();
            }
        } catch (err) {
            console.error("Error handling answer:", err);
        }
    };

    const processPendingCandidates = () => {
        while (pendingCandidates.current.length > 0) {
            const candidate = pendingCandidates.current.shift();
            peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
        }
    };

    const handleICECandidateEvent = (e) => {
        if (e.candidate) {
            socketRef.current.emit('ice-candidate', {
                appointmentId,
                candidate: e.candidate
            });
        }
    };

    const handleNewICECandidateMsg = async ({ candidate }) => {
        try {
            if (peerRef.current && peerRef.current.remoteDescription) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                pendingCandidates.current.push(candidate);
            }
        } catch (err) {
            console.error("Error adding ICE candidate:", err);
        }
    };

    const handleTrackEvent = (e) => {
        console.log("Track received:", e.track.kind);
        remoteStreamRef.current.addTrack(e.track);
        setHasRemoteStream(true);
        setTrackCount(prev => prev + 1);
    };

    const handleUserLeft = () => {
        toast.info("The other person left the call.");
        setHasRemoteStream(false);
        remoteStreamRef.current = new MediaStream();
        setCallStatus('waiting');
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
    };

    const toggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOff(!videoTrack.enabled);
        }
    };

    const endCall = (shouldNavigate = true) => {
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
        
        if (shouldNavigate) {
            if (isDoctor) {
                navigate('/doctor/appointments');
            } else {
                navigate('/patient/appointments');
            }
        }
    };

    const handleSavePrescription = async () => {
        if (!prescriptionText.trim() && !privateNotes.trim()) {
            toast.error("Please enter prescription or notes before saving.");
            return;
        }

        setIsSaving(true);
        try {
            await axios.put(`http://localhost:5000/api/doctor/appointments/${appointmentId}/prescription`, {
                prescription: prescriptionText,
                notes: privateNotes
            }, { withCredentials: true });
            
            toast.success("Prescription saved successfully!");
        } catch (error) {
            console.error("Save prescription error:", error);
            toast.error("Failed to save prescription.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`h-screen overflow-hidden ${theme.bg} p-6 flex flex-col font-sans`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className={`text-2xl font-bold ${theme.text}`}>Virtual Consultation</h1>
                    <p className="text-slate-500 text-sm">Appointment ID: #{appointmentId}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium border ${theme.border} ${theme.text}`}>
                    {callStatus === 'joining' && 'Requesting Media...'}
                    {callStatus === 'waiting' && 'Waiting for other person...'}
                    {callStatus === 'connected' && 'Call Connected'}
                    {callStatus === 'ended' && 'Call Ended'}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 h-[calc(100vh-140px)]">
                
                {/* Main Video Area */}
                <div className={`flex-1 bg-black rounded-3xl overflow-hidden relative shadow-lg flex flex-col ${isDoctor ? 'lg:w-2/3' : 'w-full'}`}>
                    
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

                    {/* Local Video (PiP) */}
                    <div className="absolute bottom-24 right-6 w-32 h-48 md:w-48 md:h-64 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
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

                    {/* Controls */}
                    <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6 items-center">
                        <button 
                            onClick={toggleMute}
                            className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'}`}
                        >
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        
                        <button 
                            onClick={() => endCall(true)}
                            className="p-5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                        >
                            <PhoneOff className="w-8 h-8" />
                        </button>

                        <button 
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'}`}
                        >
                            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Doctor Prescription Side Panel */}
                {isDoctor && (
                    <div className="w-full lg:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg bg-opacity-10 ${theme.bg}`}>
                                <FileText className={`w-6 h-6 ${theme.text}`} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Prescription Pad</h2>
                        </div>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-semibold text-slate-600">Prescription / Medications</label>
                                <textarea 
                                    className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#b08b8c]/20 resize-none font-mono text-sm"
                                    placeholder="Type prescription details here... e.g. Amoxicillin 500mg, 1 tablet 3 times a day for 7 days."
                                    value={prescriptionText}
                                    onChange={(e) => setPrescriptionText(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2 h-1/3">
                                <label className="text-sm font-semibold text-slate-600">Private Notes (Optional)</label>
                                <textarea 
                                    className="w-full h-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#b08b8c]/20 resize-none text-sm"
                                    placeholder="Add any private notes for future reference..."
                                    value={privateNotes}
                                    onChange={(e) => setPrivateNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-6 mt-2 border-t border-slate-100">
                            <button 
                                onClick={handleSavePrescription}
                                disabled={isSaving || (!prescriptionText.trim() && !privateNotes.trim())}
                                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''} ${theme.button}`}
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isSaving ? 'Saving...' : 'Save Prescription'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
