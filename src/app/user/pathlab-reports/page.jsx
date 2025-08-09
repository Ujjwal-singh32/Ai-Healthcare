"use client";

import React, { useState, useEffect } from "react";
import UserNavbar from "@/components/UserNavbar";
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


  // Show loading or message if userId not available yet
  if (!patientId) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen flex items-center justify-center bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-white">
          <p>Loading user information...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-purple-50 dark:bg-purple-900 py-10 px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center text-purple-800 dark:text-white mb-6">
          Pathlab Reports
        </h1>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by pathlab or test name..."
            className="w-full px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-950 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
        </div>

        {loading ? (
          <p className="text-center text-purple-700 dark:text-purple-200">
            Loading reports...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        ) : filteredReports.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 rounded-2xl shadow-md p-6 transition hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-100">
                    {report.labId.labName}
                  </h2>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${report.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                        }`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      📅 {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h6 className="text-xl font-semibold text-gray-800 dark:text-purple-100 mb-2">
                 Patient: {patientName}
                </h6>
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                  <span className="font-medium">Tests:</span>{" "}
                  {report.tests.join(", ")}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                  <span className="font-medium">Fee:</span>{" "}
                  ₹ {report.fee}
                </div>
                {report.status === "completed" && (
                  <button
                    onClick={() => handleView(report)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition text-sm cursor-pointer"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No reports found.
          </p>
        )}
      </div>
    </>
  );
};

export default PathlabReportsPage;
