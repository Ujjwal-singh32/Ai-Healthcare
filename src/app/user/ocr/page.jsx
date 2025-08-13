"use client";

import React, { useState } from "react";
import Image from "next/image";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";

export default function OCRPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_OCR_API_URL;
  console.log(API_URL);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError("");
    setResult(null);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };
  async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/extract-text`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }
    return response.json();
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await uploadImage(selectedFile);
      setResult(data);
      if (data?.medicines) {
        const langs = Object.keys(data.medicines);
        setLanguage(
          langs.includes(language.toLowerCase())
            ? language.toLowerCase()
            : langs[0]
        );
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] pt-24 pb-16">
        {/* Header Section */}
        <div className="w-full px-6 lg:px-12 xl:px-20 py-12">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] mb-4 tracking-tight">
              Medicine OCR Scanner
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Upload an image of your medicine to extract detailed information
              using advanced OCR technology
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
            {/* Upload Section */}
            <div className="bg-white/90 dark:bg-[#232946]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 lg:p-12 border border-[#2563eb]/20 dark:border-[#6366f1]/20">
              <h2 className="text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa] mb-8 text-center">
                Upload Medicine Image
              </h2>

              <div className="flex flex-col items-center space-y-8">
                {previewUrl ? (
                  <div className="w-full flex justify-center">
                    <div className="p-4 border-2 border-[#2563eb] rounded-xl bg-white/90 dark:bg-[#334155]/90 backdrop-blur-sm shadow-lg">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={280}
                        height={320}
                        className="rounded-lg object-contain max-h-80 shadow-md"
                      />
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="ocr-file-input"
                    className="w-full p-12 border-2 border-dashed border-[#2563eb] rounded-xl flex flex-col items-center justify-center bg-white/80 dark:bg-[#334155]/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-[#334155]/90 transition-all duration-300 cursor-pointer"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                  >
                    <svg
                      className="w-16 h-16 text-[#2563eb] mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-[#2563eb] text-center font-semibold text-lg">
                      Drop your medicine image here or click to browse
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Supports JPG, PNG, WEBP files
                    </p>
                  </label>
                )}

                <div className="w-full space-y-6">
                  <input
                    id="ocr-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm file:mr-4 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#2563eb] file:text-white hover:file:bg-[#1d4ed8] file:transition-all file:cursor-pointer file:shadow-lg hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label
                      htmlFor="lang"
                      className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg"
                    >
                      Select Language:
                    </label>
                    <select
                      id="lang"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="flex-1 border-2 border-[#2563eb] rounded-lg px-6 py-3 text-[#2563eb] font-semibold bg-white dark:bg-[#1e3a8a] dark:text-white focus:outline-none focus:ring-4 focus:ring-[#60a5fa]/50 transition-all"
                    >
                      <option value="EN">English</option>
                      <option value="HI">Hindi</option>
                      <option value="TA">Tamil</option>
                      <option value="BN">Bengali</option>
                      <option value="GU">Gujarati</option>
                    </select>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className="w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Extracting Information...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Upload & Extract Data
                        <svg
                          className="w-6 h-6 ml-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white/90 dark:bg-[#232946]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 lg:p-12 border border-[#2563eb]/20 dark:border-[#6366f1]/20">
              <h2 className="text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa] mb-8 text-center">
                Extraction Results
              </h2>

              {result && result.medicines && result.medicines[language] ? (
                <div className="space-y-6">
                  {result.medicines[language].map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 dark:bg-[#232946]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-[#2563eb]/20 dark:border-[#6366f1]/20"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e3a8a]/20 dark:to-[#312e81]/20 p-6 rounded-xl border border-[#2563eb]/20">
                          <h3 className="text-sm font-bold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide mb-2">
                            Medicine Name
                          </h3>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {med.medicine_name?.trim() || "Not enough data"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e3a8a]/20 dark:to-[#312e81]/20 p-6 rounded-xl border border-[#2563eb]/20">
                          <h3 className="text-sm font-bold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide mb-2">
                            Dosage
                          </h3>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {med.dosage?.trim() || "Not enough data"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e3a8a]/20 dark:to-[#312e81]/20 p-6 rounded-xl border border-[#2563eb]/20 mb-6">
                        <h3 className="text-sm font-bold text-[#2563eb] dark:text-[#60a5fa] uppercase tracking-wide mb-2">
                          Usage Instructions
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white">
                          {med.usage_instructions?.trim() || "Not enough data"}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                        <h3 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
                          Medicine Use
                        </h3>
                        <p className="text-lg text-green-800 dark:text-green-200">
                          {med.medicine_use?.trim() || "Not enough data"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg
                    className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
                    Upload an image to see extraction results
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 mt-2">
                    Results will appear here after processing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="w-full px-6 lg:px-12 xl:px-20 mt-16">
          <div className="bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 dark:from-[#232946]/50 dark:to-[#334155]/50 backdrop-blur-xl rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] text-center mb-8">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2563eb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Fast Processing
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Extract medicine information in seconds using advanced OCR
                  technology
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2563eb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Multi-language Support
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Supports multiple Indian languages for better accessibility
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2563eb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Accurate Results
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  High accuracy medicine information extraction with detailed
                  analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}
