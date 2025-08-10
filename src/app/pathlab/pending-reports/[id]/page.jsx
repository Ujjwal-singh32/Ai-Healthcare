"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import LabFooter from "@/components/LabFooter";
import LabNavbar from "@/components/LabNavbar";
import { toast } from "react-toastify";

const Page = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  // Extract from query params
  const bookingId = searchParams.get("id");
  const patientName = searchParams.get("patientName");
  const testsFromQuery = searchParams.get("tests")?.split(",") || [];
  const fee = searchParams.get("fee");
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  // Editable results
  const [tests, setTests] = useState(
    testsFromQuery.map((t) => ({
      name: t.trim(),
      result: "",
      normalRange: "",
      units: "",
      remarks: "",
    }))
  );

  const handleFieldChange = (index, field, value) => {
    const updated = [...tests];
    updated[index][field] = value;
    setTests(updated);
  };

  const handleSendReport = async () => {
    if (!bookingId) {
      alert("Booking ID missing. Cannot send report.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/pathlab/booking/update-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, tests }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Report sent to patient successfully.");
      } else {
        toast.error("Failed to send report: " + data.message);
      }
    } catch (err) {
      console.error("Error sending report:", err);
      alert("Something went wrong while sending the report.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <LabNavbar />
      {/* Spacer to ensure content starts after navbar */}
      <div className="h-16 sm:h-20" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 py-12 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2563eb] dark:text-[#60a5fa] mb-10 tracking-tight font-sans">
          Report Details
        </h1>

        <div className="max-w-2xl mx-auto bg-white/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-xl p-8 space-y-10 backdrop-blur-md">
          {/* Patient Info */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 font-sans tracking-tight">
              {patientName}
            </h2>
            <p className="text-lg text-blue-700 dark:text-blue-200">
              <span className="font-semibold">Fee:</span> ₹{fee}
            </p>
            <p className="text-lg text-blue-700 dark:text-blue-200">
              <span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}
            </p>
            <p
              className={`text-lg font-semibold ${status === "Pending" ? "text-yellow-600" : "text-green-600"}`}
            >
              Status: {status}
            </p>
          </div>

          {/* Tests */}
          <div className="space-y-8">
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-blue-100 dark:bg-blue-900 p-6 rounded-xl space-y-4 shadow border border-blue-200 dark:border-blue-800"
              >
                <p className="font-semibold text-xl text-blue-900 dark:text-blue-100 font-sans tracking-tight">
                  {test.name}
                </p>

                <textarea
                  value={test.result}
                  onChange={(e) =>
                    handleFieldChange(index, "result", e.target.value)
                  }
                  placeholder="Enter result value or description..."
                  className="w-full p-3 bg-white dark:bg-blue-950 text-blue-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
                  rows={2}
                />

                <input
                  type="text"
                  value={test.normalRange}
                  onChange={(e) =>
                    handleFieldChange(index, "normalRange", e.target.value)
                  }
                  placeholder="Normal Range (e.g. 70-110 mg/dL)"
                  className="w-full p-3 bg-white dark:bg-blue-950 text-blue-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
                />

                <input
                  type="text"
                  value={test.units}
                  onChange={(e) =>
                    handleFieldChange(index, "units", e.target.value)
                  }
                  placeholder="Units (e.g. mg/dL)"
                  className="w-full p-3 bg-white dark:bg-blue-950 text-blue-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
                />

                <textarea
                  value={test.remarks}
                  onChange={(e) =>
                    handleFieldChange(index, "remarks", e.target.value)
                  }
                  placeholder="Remarks / Interpretation"
                  className="w-full p-3 bg-white dark:bg-blue-950 text-blue-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* Single Centered Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleSendReport}
              disabled={loading}
              className={`flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              <Send size={22} />
              {loading ? "Sending..." : "Send Report"}
            </button>
          </div>
        </div>
      </div>
      <LabFooter />
    </>
  );
};

export default Page;
