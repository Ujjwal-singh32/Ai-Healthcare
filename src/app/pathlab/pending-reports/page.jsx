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
  const pendingReports = reports.filter(report => report.status === "pending");
  return (
    <>
      <LabNavbar />
      <div className="min-h-screen bg-purple-50 dark:bg-purple-900 p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-white mb-6 text-center">
          Pending Lab Tests
        </h1>

        {loading ? (
          <p className="text-center text-purple-700 dark:text-purple-200">
            Loading reports...
          </p>
        ) : pendingReports.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No pending tests found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pendingReports.map((report) => (
              <Link
                key={report._id}
                href={{
                  pathname: `/pathlab/pending-reports/${report._id}`,
                  query: {
                    id: report._id,
                    patientName: report.patientId?.name,
                    patientId: report.patientId?._id,
                    tests: report.tests.join(","),
                    fee: report.fee,
                    date: report.date,
                    status: report.status
                  }
                }}
                className="bg-white dark:bg-purple-950 border border-purple-200 dark:border-purple-700 rounded-xl shadow hover:shadow-lg transition p-5 space-y-2"
              >
                <div className="text-lg font-semibold text-purple-800 dark:text-purple-100">
                  {report.patientId?.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Test:{" "}
                  <span className="font-medium">
                    {report.tests.join(", ")}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Fee:{" "}
                  <span className="font-medium">
                    ₹ {report.fee}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`inline-block text-xs px-3 py-1 rounded-full ${report.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : report.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-blue-200 text-blue-800"
                    }`}
                >
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
