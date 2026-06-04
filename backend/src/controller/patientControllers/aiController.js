import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../../config/env.js";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY || "fallback_key");

export const analyzeSymptoms = async (req, res) => {
    try {
        console.log("=== AI Symptom Checker Route Hit ===");
        const { symptoms } = req.body;
        console.log("Symptoms received:", symptoms);

        if (!symptoms) {
            return res.status(400).json({ success: false, message: "Symptoms are required." });
        }

        if (!ENV.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Gemini API key is not configured." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are a highly professional medical triage assistant for a hospital platform called MEDBLOOM.
            A patient has described the following symptoms: "${symptoms}"

            Your job is to analyze these symptoms and provide a supportive, non-diagnostic triage recommendation.
            
            CRITICAL RULES:
            1. You MUST include a strict medical disclaimer stating that you are an AI assistant, not a doctor, and this is not a medical diagnosis.
            2. You must recommend the most appropriate type of specialist the patient should consult (e.g., "Cardiologist", "Dermatologist", "General Physician").
            3. You must provide a brief, empathetic explanation of why that specialist is recommended.
            4. If the symptoms indicate a severe medical emergency (e.g., chest pain, severe bleeding, sudden paralysis), you MUST strongly urge them to seek immediate emergency medical care or call an ambulance.
            
            Return the response in the following strict JSON format (do not include markdown blocks like \`\`\`json):
            {
                "disclaimer": "String (the medical disclaimer)",
                "specialistRecommended": "String (e.g. 'General Physician')",
                "explanation": "String (empathetic explanation of the recommendation)",
                "isEmergency": Boolean (true if this sounds like a medical emergency, false otherwise)
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown formatting if Gemini included it
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const jsonResponse = JSON.parse(text);

        res.status(200).json({
            success: true,
            data: jsonResponse
        });

    } catch (error) {
        console.error("Error in AI Symptom Checker:", error);
        res.status(500).json({ success: false, message: "Failed to analyze symptoms. Please try again later." });
    }
};
