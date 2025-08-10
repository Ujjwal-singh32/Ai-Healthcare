"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Brain } from "lucide-react";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";

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
            Leverage our machine learning model to analyze symptoms and receive data-driven 
            disease predictions with corresponding medical recommendations.
          </p>
          
          <div className="mt-8 p-6 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50">
            <div className="text-left mb-6">
              <label className="flex items-center gap-2 text-[#1e40af] dark:text-[#60a5fa] text-lg font-medium mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Select Patient Symptoms
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Search and select all symptoms the patient is experiencing
              </p>
              <Select
                isMulti
                name="symptoms"
                options={options}
                className="basic-multi-select text-left"
                classNamePrefix="select"
                placeholder="Start typing to search symptoms..."
                onChange={setSelectedSymptoms}
                value={selectedSymptoms}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 14,
                  colors: {
                    ...theme.colors,
                    primary25: "#e0e7ff",
                    primary: "#2563eb",
                    neutral0: "rgba(255,255,255,0.85)",
                    neutral10: "#dbeafe",
                    neutral20: "#93c5fd",
                    neutral30: "#60a5fa",
                    neutral40: "#3b82f6",
                    neutral80: "#1e40af",
                  },
                })}
                styles={{
                  container: (base) => ({
                    ...base,
                    width: '100%',
                  }),
                  control: (base, state) => ({
                    ...base,
                    minHeight: '3rem',
                    borderWidth: '2px',
                    borderColor: state.isFocused ? '#2563eb' : '#c7d2fe',
                    borderRadius: '0.9rem',
                    boxShadow: state.isFocused ? '0 0 0 2px #2563eb33' : '0 1px 4px rgba(30,64,175,0.06)',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                    "&:hover": {
                      borderColor: '#2563eb',
                    },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0.5rem 1rem',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#64748b',
                    fontSize: '1rem',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    background: 'linear-gradient(90deg,#dbeafe 60%,#e0e7ff 100%)',
                    borderRadius: '0.6rem',
                    padding: '0.1rem 0.2rem',
                    margin: '0.2rem',
                    boxShadow: '0 1px 2px rgba(30,64,175,0.04)',
                    border: '1px solid #c7d2fe',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#1e40af',
                    fontWeight: 500,
                    fontSize: '0.97rem',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#2563eb',
                    borderRadius: '0 0.4rem 0.4rem 0',
                    '&:hover': {
                      backgroundColor: '#c7d2fe',
                      color: '#1e3a8a',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0.9rem',
                    boxShadow: '0 10px 24px -5px #2563eb22',
                    border: '1px solid #c7d2fe',
                    overflow: 'hidden',
                  }),
                  menuList: (base) => ({
                    ...base,
                    padding: '0.5rem',
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isSelected
                      ? 'linear-gradient(90deg,#2563eb 60%,#60a5fa 100%)'
                      : state.isFocused
                        ? '#e0e7ff'
                        : 'transparent',
                    color: state.isSelected ? 'white' : '#1e293b',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    margin: '0.2rem 0',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }),
                  noOptionsMessage: (base) => ({
                    ...base,
                    color: '#64748b',
                    fontSize: '1rem',
                    padding: '1rem',
                  }),
                  input: (base) => ({
                    ...base,
                    color: '#1e293b',
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    "& > div": {
                      padding: '0.5rem',
                    },
                  }),
                  dropdownIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? '#2563eb' : '#93c5fd',
                    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
                    transition: 'all 0.2s',
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: '#93c5fd',
                    '&:hover': {
                      color: '#2563eb',
                    },
                  }),
                }}
              />
            </div>

            <div className="flex justify-center">
              <button
                className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-semibold rounded-lg shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                onClick={handlePrediction}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Generate Prediction
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Result Sections */}
        {prediction && (
          <div className="relative mt-16 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#1e40af] dark:text-[#60a5fa]">
              Diagnostic Results
            </h2>
            
            <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disease */}
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
                  <div className="bg-[#dbeafe]/50 dark:bg-[#1e3a8a]/50 p-4 rounded-lg flex-grow">
                    <p className="text-[#1e40af] dark:text-white text-lg font-medium">
                      {prediction.disease || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Description */}
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
                  <div className="bg-[#dbeafe]/50 dark:bg-[#1e3a8a]/50 p-4 rounded-lg flex-grow">
                    <p className="text-gray-700 dark:text-gray-200">
                      {prediction.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Precautions */}
            <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 mb-8">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Medications */}
              <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                    Medications
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {prediction.medications?.length > 0 ? (
                    prediction.medications.flatMap((item, i) =>
                      item
                        .replace(/[\[\]']/g, "") // remove brackets and quotes
                        .split(",")
                        .map((subItem, j) => (
                          <div key={`${i}-${j}`} className="flex items-start gap-2">
                            <div className="mt-1 text-[#2563eb] dark:text-[#60a5fa]">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-200">{subItem.trim()}</span>
                          </div>
                        ))
                    )
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No medications recommended.</div>
                  )}
                </div>
              </div>

              {/* Diet */}
              <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                    Diet Recommendations
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {prediction.diets?.length > 0 ? (
                    prediction.diets.flatMap((item, i) =>
                      item
                        .replace(/[\[\]']/g, "") // remove brackets and quotes
                        .split(",")
                        .map((subItem, j) => (
                          <div key={`${i}-${j}`} className="flex items-start gap-2">
                            <div className="mt-1 text-[#2563eb] dark:text-[#60a5fa]">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-200">{subItem.trim()}</span>
                          </div>
                        ))
                    )
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No specific diet recommendations.</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Workouts */}
            <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#dbeafe] dark:bg-[#1e3a8a] rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563eb] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                  Workout Suggestions
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction.workouts?.length > 0 ? (
                  prediction.workouts.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-1 text-[#2563eb] dark:text-[#60a5fa]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">No specific workout suggestions.</div>
                )}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setPrediction(null)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#1e40af] dark:text-[#60a5fa] rounded-lg transition-colors"
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
