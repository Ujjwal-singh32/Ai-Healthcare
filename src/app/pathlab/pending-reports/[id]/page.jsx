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
      <div className="min-h-screen bg-purple-50 dark:bg-purple-950 p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-center text-purple-900 dark:text-purple-100 mb-10">
          🧾 Report Details
        </h1>

        <div className="max-w-2xl mx-auto bg-white dark:bg-purple-900 border border-purple-300 dark:border-purple-700 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Patient Info */}
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-100">
              {patientName}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Fee:</strong> ₹{fee}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Date:</strong> {new Date(date).toLocaleDateString()}
            </p>
            <p
              className={`text-sm font-semibold ${status === "Pending" ? "text-yellow-600" : "text-green-500"
                }`}
            >
              Status: {status}
            </p>
          </div>

          {/* Tests */}
          <div className="space-y-6">
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-purple-100 dark:bg-purple-800 p-5 rounded-lg space-y-3 shadow-sm"
              >
                <p className="font-medium text-lg text-purple-900 dark:text-purple-100">
                  {test.name}
                </p>

                <textarea
                  value={test.result}
                  onChange={(e) =>
                    handleFieldChange(index, "result", e.target.value)
                  }
                  placeholder="Enter result value or description..."
                  className="w-full p-2 bg-white dark:bg-purple-700 text-purple-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />

                <input
                  type="text"
                  value={test.normalRange}
                  onChange={(e) =>
                    handleFieldChange(index, "normalRange", e.target.value)
                  }
                  placeholder="Normal Range (e.g. 70-110 mg/dL)"
                  className="w-full p-2 bg-white dark:bg-purple-700 text-purple-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                  type="text"
                  value={test.units}
                  onChange={(e) =>
                    handleFieldChange(index, "units", e.target.value)
                  }
                  placeholder="Units (e.g. mg/dL)"
                  className="w-full p-2 bg-white dark:bg-purple-700 text-purple-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <textarea
                  value={test.remarks}
                  onChange={(e) =>
                    handleFieldChange(index, "remarks", e.target.value)
                  }
                  placeholder="Remarks / Interpretation"
                  className="w-full p-2 bg-white dark:bg-purple-700 text-purple-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition
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
