"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Brain } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import HealthChatbotSection from "@/components/Chatbot";

const symptomsDict = {
  itching: 0,
  skin_rash: 1,
  nodal_skin_eruptions: 2,
  continuous_sneezing: 3,
  shivering: 4,
  chills: 5,
  joint_pain: 6,
  stomach_pain: 7,
  acidity: 8,
  ulcers_on_tongue: 9,
  muscle_wasting: 10,
  vomiting: 11,
  burning_micturition: 12,
  "spotting_ urination": 13,
  fatigue: 14,
  weight_gain: 15,
  anxiety: 16,
  cold_hands_and_feets: 17,
  mood_swings: 18,
  weight_loss: 19,
  restlessness: 20,
  lethargy: 21,
  patches_in_throat: 22,
  irregular_sugar_level: 23,
  cough: 24,
  high_fever: 25,
  sunken_eyes: 26,
  breathlessness: 27,
  sweating: 28,
  dehydration: 29,
  indigestion: 30,
  headache: 31,
  yellowish_skin: 32,
  dark_urine: 33,
  nausea: 34,
  loss_of_appetite: 35,
  pain_behind_the_eyes: 36,
  back_pain: 37,
  constipation: 38,
  abdominal_pain: 39,
  diarrhoea: 40,
  mild_fever: 41,
  yellow_urine: 42,
  yellowing_of_eyes: 43,
  acute_liver_failure: 44,
  fluid_overload: 45,
  swelling_of_stomach: 46,
  swelled_lymph_nodes: 47,
  malaise: 48,
  blurred_and_distorted_vision: 49,
  phlegm: 50,
  throat_irritation: 51,
  redness_of_eyes: 52,
  sinus_pressure: 53,
  runny_nose: 54,
  congestion: 55,
  chest_pain: 56,
  weakness_in_limbs: 57,
  fast_heart_rate: 58,
  pain_during_bowel_movements: 59,
  pain_in_anal_region: 60,
  bloody_stool: 61,
  irritation_in_anus: 62,
  neck_pain: 63,
  dizziness: 64,
  cramps: 65,
  bruising: 66,
  obesity: 67,
  swollen_legs: 68,
  swollen_blood_vessels: 69,
  puffy_face_and_eyes: 70,
  enlarged_thyroid: 71,
  brittle_nails: 72,
  swollen_extremeties: 73,
  excessive_hunger: 74,
  extra_marital_contacts: 75,
  drying_and_tingling_lips: 76,
  slurred_speech: 77,
  knee_pain: 78,
  hip_joint_pain: 79,
  muscle_weakness: 80,
  stiff_neck: 81,
  swelling_joints: 82,
  movement_stiffness: 83,
  spinning_movements: 84,
  loss_of_balance: 85,
  unsteadiness: 86,
  weakness_of_one_body_side: 87,
  loss_of_smell: 88,
  bladder_discomfort: 89,
  foul_smell_of_urine: 90,
  continuous_feel_of_urine: 91,
  passage_of_gases: 92,
  internal_itching: 93,
  "toxic_look_(typhos)": 94,
  depression: 95,
  irritability: 96,
  muscle_pain: 97,
  altered_sensorium: 98,
  red_spots_over_body: 99,
  belly_pain: 100,
  abnormal_menstruation: 101,
  dischromic_patches: 102,
  watering_from_eyes: 103,
  increased_appetite: 104,
  polyuria: 105,
  family_history: 106,
  mucoid_sputum: 107,
  rusty_sputum: 108,
  lack_of_concentration: 109,
  visual_disturbances: 110,
  receiving_blood_transfusion: 111,
  receiving_unsterile_injections: 112,
  coma: 113,
  stomach_bleeding: 114,
  distention_of_abdomen: 115,
  history_of_alcohol_consumption: 116,
  fluid_overload_1: 117,
  blood_in_sputum: 118,
  prominent_veins_on_calf: 119,
  palpitations: 120,
  painful_walking: 121,
  pus_filled_pimples: 122,
  blackheads: 123,
  scurring: 124,
  skin_peeling: 125,
  silver_like_dusting: 126,
  small_dents_in_nails: 127,
  inflammatory_nails: 128,
  blister: 129,
  red_sore_around_nose: 130,
  yellow_crust_ooze: 131,
};

const options = Object.keys(symptomsDict).map((symptom) => ({
  value: symptom,
  label: symptom.replace(/_/g, " "),
}));


export default function MLPredictionPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    setPrediction(null);
  }, [selectedSymptoms]);

  const handlePrediction = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_FLASK_URL;
    try {
      const res = await fetch(`${apiBaseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedSymptoms: selectedSymptoms.map((s) => s.value),
        }),
      });
      const data = await res.json();
      if (res.status !== 200 || data.error) {
        alert(`Error: ${data.error || "Prediction failed"}`);
        return;
      }
      setPrediction(data.details);
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Something went wrong while predicting. Please try again.");
    }
  };

  return (
  <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] text-[#2563eb] dark:text-[#60a5fa] overflow-hidden">
      {/* Decorative background pattern (copied from home page) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-10 dark:opacity-10">
          <defs>
            <radialGradient id="bg-grad-ml" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-grad-ml)" />
        </svg>
      </div>

      <UserNavbar />

  <main className="flex-grow py-16 px-4 animate-fade-in pt-28 sm:pt-32">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 dark:bg-[#f3f4f6]/80 backdrop-blur-xl rounded-full text-lg font-semibold text-[#2563eb] dark:text-[#2563eb] shadow animate-fade-in border border-[#c7d2fe] dark:border-[#60a5fa]">
              <Brain className="w-5 h-5 text-[#2563eb]" />
              <span className="tracking-wide">AI Health Predictor</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2563eb] dark:text-[#2563eb] mb-4 animate-fade-in tracking-tight">
            Health Risk Assessment
          </h1>

          <p className="text-lg text-[#2563eb] dark:text-[#2563eb] animate-fade-in max-w-2xl mx-auto font-medium">
            Select your symptoms and receive a professional, AI-powered health risk analysis. Our system provides evidence-based predictions and actionable recommendations.
          </p>

          <div className="text-left animate-fade-in">
            <label className="block text-[#2563eb] dark:text-[#2563eb] text-lg font-semibold mb-2">
              Select Symptoms
            </label>
            <div className="glassmorphic rounded-xl p-2 border border-[#c7d2fe] dark:border-[#60a5fa]">
              <Select
                isMulti
                name="symptoms"
                options={options}
                className="cool-select text-left"
                classNamePrefix="cool-select"
                placeholder="Start typing to search symptoms..."
                onChange={setSelectedSymptoms}
                value={selectedSymptoms}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    background: '#f8fafc',
                    borderColor: state.isFocused ? '#2563eb' : '#c7d2fe',
                    boxShadow: state.isFocused ? '0 0 0 2px #2563eb33' : 'none',
                    borderRadius: '1rem',
                    minHeight: '48px',
                    transition: 'all 0.2s',
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '1rem',
                    background: '#f1f5f9',
                    boxShadow: '0 8px 32px 0 #2563eb22',
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isSelected
                      ? '#2563eb'
                      : state.isFocused
                      ? '#e0e7ef'
                      : 'transparent',
                    color: state.isSelected ? '#fff' : '#2563eb',
                    fontWeight: state.isSelected ? 600 : 500,
                    borderRadius: '0.75rem',
                    padding: '10px 16px',
                    cursor: 'pointer',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    background: '#2563eb22',
                    borderRadius: '0.75rem',
                    color: '#2563eb',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#2563eb',
                    fontWeight: 600,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#2563eb',
                    ':hover': { background: '#2563eb', color: '#fff' },
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#94a3b8',
                    fontWeight: 500,
                  }),
                }}
              />
            </div>
          </div>

          <div className="flex justify-center animate-fade-in">
            <button
              className="mt-8 px-10 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-[#2563eb] dark:border-[#60a5fa]"
              onClick={handlePrediction}
            >
              Predict
            </button>
          </div>
        </div>

        {/* Prediction Result Sections */}
        {prediction && (
          <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
            {/* Disease */}
            <div className="glassmorphic bg-white/90 dark:bg-[#f3f4f6]/90 rounded-2xl p-8 shadow-2xl flex flex-col items-start border border-[#c7d2fe] dark:border-[#60a5fa]">
              <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-2 tracking-tight">Predicted Disease</h2>
              <p className="text-[#2563eb] dark:text-[#2563eb] text-lg font-semibold break-words">
                {prediction.disease || "N/A"}
              </p>
            </div>

            {/* Description */}
            <div className="glassmorphic bg-white/90 dark:bg-[#f3f4f6]/90 rounded-2xl p-8 shadow-2xl flex flex-col items-start border border-[#c7d2fe] dark:border-[#60a5fa]">
              <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-2 tracking-tight">Description</h2>
              <p className="text-[#2563eb] dark:text-[#2563eb] text-base break-words">
                {prediction.description || "No description available."}
              </p>
            </div>

            {/* Precautions */}
            <div className="glassmorphic bg-[#f3f4f6]/90 dark:bg-[#e0e7ef]/90 rounded-2xl p-8 shadow-2xl col-span-1 md:col-span-2 border border-[#c7d2fe] dark:border-[#60a5fa]">
              <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-2 tracking-tight">Precautions</h2>
              <ul className="list-disc ml-5 text-[#2563eb] dark:text-[#2563eb] space-y-1 text-base">
                {prediction.precautions?.length > 0 ? (
                  prediction.precautions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>

            {/* Medications */}
            <div className="glassmorphic bg-white/90 dark:bg-[#f3f4f6]/90 rounded-2xl p-8 shadow-2xl flex flex-col items-start border border-[#c7d2fe] dark:border-[#60a5fa]">
              <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-2 tracking-tight">Medications</h2>
              <div className="ml-2 text-[#2563eb] dark:text-[#2563eb] space-y-1 text-base">
                {prediction.medications?.length > 0 ? (
                  prediction.medications.flatMap((item, i) =>
                    item
                      .replace(/[\[\]']/g, "")
                      .split(",")
                      .map((subItem, j) => (
                        <div key={`${i}-${j}`}>{subItem.trim()}</div>
                      ))
                  )
                ) : (
                  <div>None</div>
                )}
              </div>
            </div>

            {/* Diet */}
            <div className="glassmorphic bg-white/90 dark:bg-[#f3f4f6]/90 rounded-2xl p-8 shadow-2xl flex flex-col items-start border border-[#c7d2fe] dark:border-[#60a5fa]">
              <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-2 tracking-tight">Diet Recommendations</h2>
              <div className="ml-2 text-[#2563eb] dark:text-[#2563eb] space-y-1 text-base">
                {prediction.diets?.length > 0 ? (
                  prediction.diets.flatMap((item, i) =>
                    item
                      .replace(/[\[\]']/g, "")
                      .split(",")
                      .map((subItem, j) => (
                        <div key={`${i}-${j}`}>{subItem.trim()}</div>
                      ))
                  )
                ) : (
                  <div>None</div>
                )}
              </div>
            </div>

            {/* Workouts */}
            <div className="glassmorphic bg-[#f3f4f6]/90 dark:bg-[#e0e7ef]/90 rounded-2xl p-8 shadow-2xl col-span-1 md:col-span-2 border border-[#c7d2fe] dark:border-[#60a5fa]">
              <h2 className="text-xl font-bold text-[#2563eb] dark:text-[#2563eb] mb-2 tracking-tight">Workout Suggestions</h2>
              <ul className="list-disc ml-5 text-[#2563eb] dark:text-[#2563eb] space-y-1 text-base">
                {prediction.workouts?.length > 0 ? (
                  prediction.workouts.map((item, i) => <li key={i}>{item}</li>)
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>

      <div className="w-full">
        <div className="border-t-2 bg-blue-400 border-blue-200 rounded-full" />
      </div>

      <HealthChatbotSection />
      <UserFooter />
    </div>
  );
}
