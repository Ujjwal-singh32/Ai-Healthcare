"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseChatbotAnswer = (text) => {
  const extractSection = (label) => {
    const marker = `${label}:`;
    const start = text.indexOf(marker);
    if (start === -1) return "";
    const rest = text.slice(start + marker.length).trim();
    const nextMarker = rest.search(/🩺|📋|⚠️|🛡️|💊|⚕️/);
    return nextMarker === -1 ? rest.trim() : rest.slice(0, nextMarker).trim();
  };

  const parseList = (value) =>
    value
      .split(/\r?\n/)
      .map((item) => item.replace(/^[\s•-]+/, "").trim())
      .filter(Boolean);

  return {
    disease: extractSection("🩺 Predicted Disease"),
    description: extractSection("📋 Description"),
    commonSymptoms: parseList(extractSection("⚠️ Common Symptoms")),
    precautions: parseList(extractSection("🛡️ Precautions")),
    whenToSeeDoctor: extractSection("💊 When to See a Doctor"),
    disclaimer: extractSection("⚕️ Disclaimer"),
  };
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MLPredictionPage() {
  const [symptomsText, setSymptomsText] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePrediction = async () => {
    const userMessage = symptomsText.trim();
    if (!userMessage) {
      alert("Please enter patient symptoms.");
      return;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_CHATBOT_URL2 ||
      process.env.NEXT_PUBLIC_FLASK_URL ||
      "";

    if (!apiBaseUrl) {
      alert(
        "Please set NEXT_PUBLIC_CHATBOT_URL in your environment to your chatbot API base URL."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: userMessage, conversation_history: [] }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Prediction failed");
      setPrediction(parseChatbotAnswer(data.answer));
    } catch (error) {
      console.error("Prediction Error:", error);
      alert(`Something went wrong while predicting. ${error.message || ""}`.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#dbeafe] dark:from-[#0f172a] dark:via-[#1e3a8a] dark:to-[#1e40af] transition-colors duration-500 ease-in-out">
      <DocNav />

      <main className="flex-grow pt-24 pb-16 px-4">
        {/* Decorative elements */}
        <div className="absolute top-36 left-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-24 right-0 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full filter blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-10 backdrop-blur-sm">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#2563eb]/10 to-[#3b82f6]/10 dark:from-[#2563eb]/20 dark:to-[#3b82f6]/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800/50 rounded-full text-sm font-semibold shadow-md">
              <Brain className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa] animate-pulse" />
              <span className="text-[#1d4ed8] dark:text-[#60a5fa]">AI Health Predictor</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#1e40af] dark:text-[#60a5fa] mb-6 leading-tight">
            Intelligent Disease Prediction
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-200">
            Describe patient symptoms naturally to leverage our AI model and receive 
            data-driven disease predictions with corresponding medical recommendations.
          </p>

          <div className="mt-8 p-6 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50">
            <div className="text-left mb-6">
              <label className="flex items-center gap-2 text-[#1e40af] dark:text-[#60a5fa] text-lg font-medium mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Describe Patient Symptoms
              </label>
              <textarea
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border-2 border-[#c7d2fe] bg-white/50 px-4 py-3 text-gray-800 focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#2563eb33] dark:bg-gray-800/50 dark:border-[#3b82f6]/50 dark:text-gray-100 transition-all duration-300 backdrop-blur-sm"
                placeholder="E.g., The patient is experiencing severe headaches, mild fever, and nausea over the last 48 hours."
              />
            </div>

            <div className="flex justify-center">
              <button
                className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                onClick={handlePrediction}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {loading ? "Generating Prediction..." : "Generate Prediction"}
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Result Sections */}
        {prediction && (
          <div className="relative mt-16 max-w-6xl mx-auto animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#1e40af] dark:text-[#60a5fa]">
              Diagnostic Results
            </h2>

            {/* Row 1: Disease and Description */}
            <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                      Predicted Disease
                    </h3>
                  </div>
                  <div className="bg-[#dbeafe]/50 dark:bg-[#1e3a8a]/50 p-4 rounded-lg flex-grow border border-blue-100 dark:border-blue-800">
                    <p className="text-[#1e40af] dark:text-white text-lg font-medium">
                      {prediction.disease || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                      Description
                    </h3>
                  </div>
                  <div className="bg-[#dbeafe]/50 dark:bg-[#1e3a8a]/50 p-4 rounded-lg flex-grow border border-blue-100 dark:border-blue-800">
                    <p className="text-gray-700 dark:text-gray-200">
                      {prediction.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Common Symptoms and Precautions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Common Symptoms */}
              <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                    Common Symptoms
                  </h3>
                </div>
                <div className="space-y-2">
                  {prediction.commonSymptoms?.length > 0 ? (
                    prediction.commonSymptoms.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-1 text-[#2563eb] dark:text-[#60a5fa]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-200">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No common symptoms listed.</div>
                  )}
                </div>
              </div>

              {/* Precautions */}
              <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                    Precautions
                  </h3>
                </div>
                <div className="space-y-2">
                  {prediction.precautions?.length > 0 ? (
                    prediction.precautions.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-1 text-[#2563eb] dark:text-[#60a5fa]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-200">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No specific precautions recommended.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 3: When to See Doctor and Disclaimer */}
            <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                      When to See a Doctor
                    </h3>
                  </div>
                  <div className="bg-[#dbeafe]/50 dark:bg-[#1e3a8a]/50 p-4 rounded-lg flex-grow border border-blue-100 dark:border-blue-800">
                    <p className="text-gray-700 dark:text-gray-200">
                      {prediction.whenToSeeDoctor || "No urgent advice available."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#fee2e2] dark:bg-[#7f1d1d]/50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400">
                      Disclaimer
                    </h3>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex-grow border border-red-200 dark:border-red-900/50">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {prediction.disclaimer || "This tool provides predictions based on symptoms and is not a substitute for professional medical advice, diagnosis, or treatment."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setPrediction(null)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#1e40af] dark:text-[#60a5fa] rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </main>
      <DoctorFooter />
    </div>
  );
}