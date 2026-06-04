import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Bot, AlertTriangle, ShieldAlert, Activity, ArrowRight, User } from "lucide-react";
import { analyzeSymptomsApi } from "../../../api/patientApi";
import { publicAnalyzeSymptomsApi } from "../../../api/landingPageApi";
import { showToast } from "../../ui/Toast";

export default function SymptomChecker({ isPublic = false }) {
    const [messages, setMessages] = useState([
        {
            role: "ai",
            content: "Hello! I am the MEDBLOOM AI Triage Assistant. Please describe your symptoms in detail, and I'll help you figure out which specialist you should see. How are you feeling today?",
            isInitial: true
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        
        // Add user message to chat
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = isPublic 
                ? await publicAnalyzeSymptomsApi(userMessage)
                : await analyzeSymptomsApi(userMessage);
            
            if (response.data.success) {
                const aiData = response.data.data;
                setMessages(prev => [...prev, { 
                    role: "ai", 
                    content: aiData.explanation,
                    specialist: aiData.specialistRecommended,
                    isEmergency: aiData.isEmergency,
                    disclaimer: aiData.disclaimer
                }]);
            } else {
                showToast.error("Failed to analyze symptoms.");
                setMessages(prev => [...prev, { role: "ai", content: "I'm sorry, I'm having trouble analyzing your symptoms right now. Please try again later.", isError: true }]);
            }
        } catch (error) {
            console.error("AI Triage Error:", error);
            
            if (error.response?.status === 429) {
                showToast.error("Daily limit reached.");
                setMessages(prev => [...prev, { 
                    role: "ai", 
                    content: "You have reached your daily limit for free public AI triage. Please sign up for a free MEDBLOOM account for unlimited access!", 
                    isError: true 
                }]);
            } else {
                showToast.error("An error occurred communicating with the AI.");
                setMessages(prev => [...prev, { role: "ai", content: "I'm sorry, I'm having trouble connecting to the network. Please try again.", isError: true }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,109,111,0.06)] border border-white overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#03373B] to-[#00A4A3] p-6 shrink-0 flex items-center gap-4 z-10">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-xl">AI Symptom Checker</h2>
                    <p className="text-teal-100 text-sm">Describe your symptoms to get a specialist recommendation</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 relative custom-scrollbar">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00A4A3 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-4 relative z-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        
                        {/* Avatar */}
                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-white border-2 border-teal-100 text-[#00A4A3]'}`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                            
                            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white text-gray-700 shadow-sm border border-slate-100 rounded-tl-sm'}`}>
                                <p className="leading-relaxed">{msg.content}</p>
                            </div>
                            
                            {/* AI Specific Cards (Specialist & Emergency) */}
                            {msg.role === 'ai' && msg.specialist && (
                                <div className="mt-3 w-full">
                                    {msg.isEmergency ? (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 shadow-sm">
                                            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-red-700 font-semibold mb-1">Medical Emergency</h4>
                                                <p className="text-red-600 text-sm">Your symptoms indicate a potentially severe emergency. Please seek immediate medical attention or call emergency services.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#EAFDFD] border border-teal-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <p className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-1">Recommended Specialist</p>
                                                <h4 className="text-gray-800 font-bold text-lg">{msg.specialist}</h4>
                                            </div>
                                            <Link to={`/doctors?speciality=${encodeURIComponent(msg.specialist)}`} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0">
                                                Find Doctors <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}
                                    
                                    {msg.disclaimer && (
                                        <div className="mt-3 flex items-start gap-2 text-xs text-gray-400 bg-white p-3 rounded-lg border border-gray-100">
                                            <ShieldAlert className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
                                            <p>{msg.disclaimer}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                    <div className="flex gap-4 relative z-10">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-white border-2 border-teal-100 flex items-center justify-center text-[#00A4A3] shadow-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center shadow-sm">
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-10">
                <form onSubmit={handleSubmit} className="flex gap-3 relative max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="E.g. I have a severe headache and blurry vision..."
                        disabled={isLoading}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-gray-700 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white w-14 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                    >
                        <Send className="w-5 h-5 ml-1" />
                    </button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-3">Powered by Google Gemini AI. Not a substitute for professional medical advice.</p>
            </div>
            
        </div>
    );
}
