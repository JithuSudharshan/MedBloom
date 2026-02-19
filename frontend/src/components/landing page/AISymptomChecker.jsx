import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const AISymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("");
    const [showInsights, setShowInsights] = useState(false);

    const handleInsights = () => {
        if (!symptoms.trim()) return;
        setShowInsights(true);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <div
                className="
          bg-teal-50 border-6 border-teal-500
          rounded-3xl p-8
          transition-all duration-500 ease-in-out
        "
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <Sparkles className="text-teal-600" size={20} />
                    </div>
                    <h3 className="text-teal-700 font-semibold text-lg">
                        AI Symptom Checker
                    </h3>
                </div>

                {/* Input */}
                <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms to get instant insights."
                    className="
            w-full resize-none
            rounded-lg border border-gray-300 bg-white
            px-4 py-3 text-sm text-gray-500
            focus:outline-none focus:ring-2 focus:ring-teal-500
          "
                    rows={3}
                />

                {/* Button */}
                <div className="flex justify-end mt-5">
                    <button
                        onClick={handleInsights}
                        className="
              flex items-center gap-2
              bg-teal-600 text-white
              px-5 py-2 rounded-full text-sm font-medium
              transition-all duration-300
              hover:scale-105 hover:bg-teal-700
              active:scale-95
            "
                    >
                        Get Insights
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <ArrowRight size={14} />
                        </span>
                    </button>
                </div>

                {/* Expandable Insights Section */}
                <div
                    className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${showInsights ? "max-h-96 mt-8 opacity-100" : "max-h-0 opacity-0"}
          `}
                >
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h4 className="text-teal-700 font-semibold mb-3">
                            Possible Insights
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>• Your symptoms may indicate a mild infection.</li>
                            <li>• Staying hydrated and resting is recommended.</li>
                            <li>• Consult a specialist if symptoms persist.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AISymptomChecker;
