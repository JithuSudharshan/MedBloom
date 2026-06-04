import { useState } from "react";
import { Sparkles, ArrowRight, AlertTriangle, ShieldAlert, Activity, Loader2 } from "lucide-react";
import { publicAnalyzeSymptomsApi } from "../../api/landingPageApi";

const AISymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("");
    const [showInsights, setShowInsights] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleInsights = async () => {
        if (!symptoms.trim()) return;
        
        setIsLoading(true);
        setShowInsights(true);
        setErrorMsg("");
        setAiResponse(null);

        try {
            const response = await publicAnalyzeSymptomsApi(symptoms);
            if (response.data.success) {
                setAiResponse(response.data.data);
            } else {
                setErrorMsg("Failed to analyze symptoms. Please try again.");
            }
        } catch (error) {
            console.error("Public AI Triage Error:", error);
            if (error.response?.status === 429) {
                setErrorMsg("You have reached your daily limit for free public AI triage. Please sign up for a free MEDBLOOM account for unlimited access!");
            } else {
                setErrorMsg("An error occurred while connecting to the AI. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <div
                className="
          bg-teal-50 border-4 border-teal-100
          rounded-3xl p-8 shadow-sm
          transition-all duration-500 ease-in-out
        "
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="text-teal-800 font-bold text-xl">
                            AI Symptom Checker
                        </h3>
                        <p className="text-teal-600 text-sm">Describe your symptoms to get a specialist recommendation.</p>
                    </div>
                </div>

                {/* Input */}
                <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="E.g. I have a severe headache and blurry vision..."
                    className="
            w-full resize-none
            rounded-xl border border-teal-200 bg-white
            px-5 py-4 text-gray-700
            focus:outline-none focus:ring-2 focus:ring-teal-500
          "
                    rows={3}
                    disabled={isLoading}
                />

                {/* Button */}
                <div className="flex justify-end mt-5">
                    <button
                        onClick={handleInsights}
                        disabled={!symptoms.trim() || isLoading}
                        className="
              flex items-center gap-2
              bg-teal-600 text-white
              px-6 py-3 rounded-full text-sm font-semibold
              transition-all duration-300 shadow-md
              hover:scale-105 hover:bg-teal-700
              disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed
            "
                    >
                        {isLoading ? "Analyzing..." : "Get Insights"}
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>

                {/* Expandable Insights Section */}
                <div
                    className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${showInsights ? "max-h-[800px] mt-8 opacity-100" : "max-h-0 opacity-0"}
          `}
                >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 text-teal-600">
                                <Activity className="w-10 h-10 animate-pulse mb-3" />
                                <p className="font-medium animate-pulse">Analyzing symptoms with AI...</p>
                            </div>
                        ) : errorMsg ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-3 border border-red-100">
                                <AlertTriangle className="shrink-0 w-6 h-6" />
                                <div>
                                    <p className="font-semibold">{errorMsg}</p>
                                </div>
                            </div>
                        ) : aiResponse ? (
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="text-teal-800 font-bold mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-teal-600" /> AI Insights
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed">{aiResponse.explanation}</p>
                                </div>

                                {aiResponse.isEmergency ? (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-red-700 font-bold mb-1">Medical Emergency</h4>
                                            <p className="text-red-600 text-sm">Your symptoms indicate a potentially severe emergency. Please seek immediate medical attention or call emergency services.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                                        <p className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-1">Recommended Specialist</p>
                                        <h4 className="text-teal-900 font-bold text-lg">{aiResponse.specialistRecommended}</h4>
                                    </div>
                                )}
                                
                                <div className="flex items-start gap-2 text-xs text-gray-400 mt-4">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <p>{aiResponse.disclaimer}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AISymptomChecker;
