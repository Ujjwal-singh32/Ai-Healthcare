"use client";

import React, { useState, useEffect } from "react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

const PathlabReportsPage = () => {
  const { user, patientName } = useUser();

  // Safely get patientId only if user and user._id exist
  const patientId = user?._id || null;
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!patientId) {
      // Don't fetch yet, wait for patientId to be available
      setLoading(false);
      setReports([]);
      setError("");
      return;
    }

    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/user/all-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId }),
        });
        const data = await res.json();
        if (data.success) {
          setReports(data.bookings);
        } else {
          setError(data.message || "Failed to fetch reports.");
          setReports([]);
        }
      } catch (err) {
        setError("Server error while fetching reports.");
        setReports([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  const filteredReports = reports.filter((report) => {
    const searchLower = search.toLowerCase();
    const labName = report.labId?.name?.toLowerCase() || "";
    return (
      labName.includes(searchLower) ||
      report.tests.some((test) => test.toLowerCase().includes(searchLower))
    );
  });


  const handleView = (report) => {
    const query = new URLSearchParams({
      id: report._id,
      patientName: patientName,
      fee: report.fee?.toString() || "0",
      tests: report.tests.join(","),
      date: new Date(report.date).toISOString(),
      labname : report.labId.labName
    }).toString();

    router.push(`/user/pathlab-reports/${report._id}/?${query}`);
  };


  // CSS animation classes
  const fadeInAnimation = "animate-fadeIn";
  const slideUpAnimation = "animate-slideUp";
  
  // Custom styles for animations
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease forwards;
    }
    .animate-slideUp {
      animation: slideUp 0.5s ease forwards;
    }
  `;

  // Loading animation
  const LoadingAnimation = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path
              fill="currentColor"
              d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        </div>
      </div>
    </div>
  );

  // Show loading or message if userId not available yet
  if (!patientId) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] text-blue-700 dark:text-blue-300 pt-24">
          <div className="p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl border border-white/30">
            <LoadingAnimation />
            <p className="text-center mt-4 font-medium">Loading user information...</p>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="relative min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] pt-28 pb-10 px-4 sm:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="blob-blue-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15">
                  <animate attributeName="stopOpacity" values="0.15;0.05;0.15" dur="5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.08">
                  <animate attributeName="stopOpacity" values="0.08;0.15;0.08" dur="5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <g>
              <ellipse cx="400" cy="400" rx="340" ry="220" fill="url(#blob-blue-1)">
                <animate attributeName="rx" values="340;370;340" dur="8s" repeatCount="indefinite" />
                <animate attributeName="ry" values="220;250;220" dur="7s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="1100" cy="700" rx="260" ry="160" fill="url(#blob-blue-1)" opacity="0.7">
                <animate attributeName="rx" values="260;290;260" dur="10s" repeatCount="indefinite" />
                <animate attributeName="ry" values="160;190;160" dur="9s" repeatCount="indefinite" />
              </ellipse>
            </g>
          </svg>
        </div>

        <div className={`${fadeInAnimation} max-w-5xl mx-auto`}>
          <style jsx>{animationStyles}</style>
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-300 mb-2">
                Pathlab Reports
              </h1>
              <div className="h-1 w-32 bg-blue-500 mx-auto rounded-full"></div>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by pathlab or test name..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-200 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-950/40 bg-white/70 backdrop-blur-sm dark:text-white shadow-md transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
              <svg 
                className="absolute left-3 top-3.5 h-4 w-4 text-blue-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <LoadingAnimation />
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-xl text-center max-w-lg mx-auto backdrop-blur-sm">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn" style={{animationDelay: "0.2s"}}>
              {filteredReports.map((report, index) => (
                <div
                  key={report._id}
                  className="bg-white/70 dark:bg-blue-950/40 backdrop-blur-sm border border-blue-100 dark:border-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-slideUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="border-b border-blue-100 dark:border-blue-800 px-6 py-4 flex flex-col sm:flex-row justify-between">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                        {report.labId.labName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full flex items-center ${
                          report.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                        }`}
                      >
                        {report.status === "completed" ? (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                        <p className="text-xs uppercase text-blue-600 dark:text-blue-400 font-medium mb-1">Patient</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{patientName}</p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                        <p className="text-xs uppercase text-blue-600 dark:text-blue-400 font-medium mb-1">Fee</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">₹ {report.fee}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-3 rounded-lg mb-4">
                      <p className="text-xs uppercase text-blue-600 dark:text-blue-400 font-medium mb-1">Tests</p>
                      <div className="flex flex-wrap gap-2">
                        {report.tests.map((test, index) => (
                          <span key={index} className="bg-white dark:bg-blue-800 px-2 py-1 rounded text-xs font-medium text-blue-800 dark:text-blue-200 shadow-sm">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>

                    {report.status === "completed" && (
                      <button
                        onClick={() => handleView(report)}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Report</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-blue-950/40 backdrop-blur-sm border border-blue-100 dark:border-blue-800 rounded-xl p-8 text-center max-w-lg mx-auto shadow-lg">
              <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-300 text-lg">No reports found.</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Your lab test reports will appear here once they are available.</p>
            </div>
          )}
        </div>
      </div>
      <UserFooter />
    </>
  );
};

export default PathlabReportsPage;
