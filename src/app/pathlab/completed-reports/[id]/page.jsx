"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LabNavbar from "@/components/LabNavbar";
import LabFooter from "@/components/LabFooter";

const CompletedReportDetails = () => {
    const searchParams = useSearchParams();

    // Extract data from query params
    const bookingId = searchParams.get("id");
    const patientName = searchParams.get("patientName");
    const patientId = searchParams.get("patientId");
    const fee = searchParams.get("fee");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    // tests param is comma-separated test names (not detailed),
    // so we fetch detailed test info from backend using bookingId
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;

        const fetchTests = async () => {
            try {
                const res = await fetch("/api/pathlab/completed-reports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId }),
                });
                const data = await res.json();
                if (data.success) {
                    setTests(data.tests);
                } else {
                    console.error("Failed to fetch tests:", data.message);
                    setTests([]);
                }
            } catch (error) {
                console.error("Error fetching tests:", error);
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [bookingId]);

    return (
        <>
            <LabNavbar />
            <div className="min-h-screen bg-purple-50 dark:bg-purple-900 p-6 sm:p-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-8 text-center">
                    Report Details
                </h1>

                {/* Patient Info */}
                <section className="mb-8 bg-white dark:bg-purple-950 rounded-xl p-6 shadow">
                    <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
                        Patient Information
                    </h2>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p>
                            <strong>Name:</strong> {patientName || "N/A"}
                        </p>
                        <p>
                            <strong>Patient ID:</strong> {patientId || "N/A"}
                        </p>
                        <p>
                            <strong>Booking ID:</strong> {bookingId}
                        </p>
                        <p>
                            <strong>Fee:</strong> ₹ {fee || "N/A"}
                        </p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {date ? new Date(date).toLocaleDateString() : "N/A"}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`inline-block text-xs px-3 py-1 rounded-full ${status === "pending"
                                        ? "bg-yellow-200 text-yellow-800"
                                        : status === "completed"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-blue-200 text-blue-800"
                                    }`}
                            >
                                {status || "N/A"}
                            </span>
                        </p>
                    </div>
                </section>

                {/* Tests Details */}
                <section className="bg-white dark:bg-purple-950 rounded-xl p-6 shadow">
                    <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
                        Test Results
                    </h2>

                    {loading ? (
                        <p className="text-center text-purple-700 dark:text-purple-200">
                            Loading test details...
                        </p>
                    ) : tests.length === 0 ? (
                        <p className="text-center text-gray-600 dark:text-gray-300">
                            No test details found.
                        </p>
                    ) : (
                        <table className="w-full border-collapse text-gray-700 dark:text-gray-300">
                            <thead>
                                <tr className="border-b border-purple-300 dark:border-purple-700">
                                    <th className="text-left p-2">Test Name</th>
                                    <th className="text-left p-2">Result</th>
                                    <th className="text-left p-2">Normal Range</th>
                                    <th className="text-left p-2">Units</th>
                                    <th className="text-left p-2">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.map((test, i) => (
                                    <tr
                                        key={i}
                                        className={i % 2 === 0 ? "bg-purple-50 dark:bg-purple-900" : ""}
                                    >
                                        <td className="p-2">{test.name}</td>
                                        <td className="p-2">{test.result || "-"}</td>
                                        <td className="p-2">{test.normalRange || "-"}</td>
                                        <td className="p-2">{test.units || "-"}</td>
                                        <td className="p-2">{test.remarks || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
            <LabFooter />
        </>
    );
};

export default CompletedReportDetails;
