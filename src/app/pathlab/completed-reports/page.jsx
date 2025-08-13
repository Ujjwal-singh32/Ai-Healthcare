"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LabFooter from "@/components/LabFooter";
import LabNavbar from "@/components/LabNavbar";
import { usePathlab } from "@/context/pathlabContext";

const Page = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathlabId } = usePathlab();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/pathlab/booking/get-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ labId: pathlabId }),
        });

        const data = await res.json();
        if (data.success) {
          setReports(data.reports);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [pathlabId]);

  const completedReports = reports
    .filter((report) => report.status === "completed")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <LabNavbar />
      {/* Spacer to ensure content starts after navbar */}
      <div className="h-16 sm:h-20" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 py-12 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2563eb] dark:text-[#60a5fa] mb-10 tracking-tight font-sans">
          Reports Submitted
        </h1>

        {loading ? (
          <p className="text-center text-blue-700 dark:text-blue-200 text-lg font-semibold">
            Loading reports...
          </p>
        ) : completedReports.length === 0 ? (
          <p className="text-blue-400 dark:text-blue-300 text-center text-lg">
            No completed reports yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {completedReports.map((report) => (
              <Link
                key={report._id}
                href={{
                  pathname: `/pathlab/completed-reports/${report._id}`,
                  query: {
                    id: report._id,
                    patientName: report.patientId?.name,
                    patientId: report.patientId?._id,
                    tests: report.tests.join(","),
                    fee: report.fee,
                    date: report.date,
                    status: report.status,
                  },
                }}
                className="bg-white/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 space-y-4 cursor-pointer backdrop-blur-md"
              >
                <div className="text-2xl font-extrabold text-blue-800 dark:text-blue-100 truncate font-sans tracking-tight">
                  {report.patientId?.name}
                </div>
                <div className="text-lg text-blue-700 dark:text-blue-200">
                  <span className="font-semibold">Test:</span> {report.tests.join(", ")}
                </div>
                <div className="text-lg text-blue-700 dark:text-blue-200">
                  <span className="font-semibold">Fee:</span> <span className="text-blue-900 dark:text-blue-100 font-bold">₹ {report.fee}</span>
                </div>
                <div className="text-lg text-blue-700 dark:text-blue-200">
                  <span className="font-semibold">Date:</span> <span className="text-blue-900 dark:text-blue-100 font-medium">{new Date(report.date).toLocaleDateString()}</span>
                </div>
                <div className="inline-block text-base px-4 py-1 rounded-full bg-green-100 text-green-800 font-semibold border border-green-200">
                  {report.status}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <LabFooter />
    </>
  );
};

export default Page;
