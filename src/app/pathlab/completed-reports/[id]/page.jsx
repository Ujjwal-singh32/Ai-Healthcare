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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900">
                <LabNavbar />
                <div className="h-16 sm:h-20" />
                <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2563eb] dark:text-[#60a5fa] mb-10 tracking-tight font-sans">
                        Report Details
                    </h1>

                    {/* Patient Info */}
                    <section className="mb-10 bg-white/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 shadow-xl backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 font-sans tracking-tight">
                            Patient Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-blue-900 dark:text-blue-100 text-lg">
                            <p><span className="font-semibold text-blue-700 dark:text-blue-300">Name:</span> {patientName || "N/A"}</p>
                            <p><span className="font-semibold text-blue-700 dark:text-blue-300">Patient ID:</span> {patientId || "N/A"}</p>
                            <p><span className="font-semibold text-blue-700 dark:text-blue-300">Booking ID:</span> {bookingId}</p>
                            <p><span className="font-semibold text-blue-700 dark:text-blue-300">Fee:</span> ₹ {fee || "N/A"}</p>
                            <p><span className="font-semibold text-blue-700 dark:text-blue-300">Date:</span> {date ? new Date(date).toLocaleDateString() : "N/A"}</p>
                            <p>
                                <span className="font-semibold text-blue-700 dark:text-blue-300">Status:</span> 
                                <span
                                    className={`inline-block text-base px-4 py-1 rounded-full ml-2 font-semibold border 
                                        ${status === "pending"
                                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                            : status === "completed"
                                                ? "bg-green-100 text-green-800 border-green-200"
                                                : "bg-blue-100 text-blue-800 border-blue-200"
                                        }`}
                                >
                                    {status || "N/A"}
                                </span>
                            </p>
                        </div>
                    </section>

                    {/* Tests Details */}
                    <section className="bg-white/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 shadow-xl backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 font-sans tracking-tight">
                            Test Results
                        </h2>

                        {loading ? (
                            <p className="text-center text-blue-700 dark:text-blue-200 text-lg font-semibold">
                                Loading test details...
                            </p>
                        ) : tests.length === 0 ? (
                            <p className="text-center text-blue-400 dark:text-blue-300 text-lg">
                                No test details found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-blue-900 dark:text-blue-100 text-lg">
                                <thead>
                                    <tr className="border-b border-blue-300 dark:border-blue-800">
                                        <th className="text-left p-3 font-bold">Test Name</th>
                                        <th className="text-left p-3 font-bold">Result</th>
                                        <th className="text-left p-3 font-bold">Normal Range</th>
                                        <th className="text-left p-3 font-bold">Units</th>
                                        <th className="text-left p-3 font-bold">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tests.map((test, i) => (
                                        <tr
                                            key={i}
                                            className={i % 2 === 0 ? "bg-blue-50 dark:bg-blue-900" : ""}
                                        >
                                            <td className="p-3 font-semibold">{test.name}</td>
                                            <td className="p-3">{test.result || "-"}</td>
                                            <td className="p-3">{test.normalRange || "-"}</td>
                                            <td className="p-3">{test.units || "-"}</td>
                                            <td className="p-3">{test.remarks || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        )}
                    </section>
                </div>
                <LabFooter />
            </div>
        </>
    );
};

export default CompletedReportDetails;
