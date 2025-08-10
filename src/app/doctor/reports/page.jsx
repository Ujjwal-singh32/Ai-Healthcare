"use client";

import { useEffect, useState, useRef } from "react";
import { Download, Eye } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import { useDoctor } from "@/context/doctorContext";
import axios from "axios";

export default function DoctorDashboard() {
  const { doctorId } = useDoctor();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("drtoken");
        const res = await axios.get(
          `/api/doctor/all-reports?doctorId=${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setReports(res.data.reports);
          // console.log("reports pringting", res.data.reports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [doctorId]);

  // Group reports by patient name
  const groupedReports = reports.reduce((acc, report) => {
    acc[report.patientName] = acc[report.patientName] || [];
    acc[report.patientName].push(report);
    return acc;
  }, {});

  // Scroll to patient section when dropdown changes
  const handleSelectChange = (e) => {
    const patientId = e.target.value;
    if (!patientId) return;

    const el = document.getElementById(patientId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 text-blue-900 dark:text-blue-100">

  <DocNav />
  {/* Spacer to ensure content starts after navbar */}
  <div className="h-16 sm:h-20" />

        <section className="px-4 sm:px-6 lg:px-10 py-12 max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-10 text-center text-blue-700 dark:text-blue-100 tracking-wide font-sans"
            style={{ fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif', letterSpacing: '0.02em' }}
          >
            Submitted Reports
          </h2>

          {/* Dropdown to select patient */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-full flex justify-center">
              <select
                onChange={handleSelectChange}
                className="border-2 border-blue-400 rounded-2xl px-5 py-3 pr-12 text-blue-900 dark:text-blue-100 bg-white/60 dark:bg-blue-950/60 shadow-lg backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-blue-300/40 transition-all text-lg font-semibold appearance-none hover:border-blue-500 hover:shadow-xl custom-dropdown"
                style={{ minWidth: '120px', maxWidth: '180px', width: '100%', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
                defaultValue=""
              >
                <option value="" disabled className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold">
                  Select Patient
                </option>
                {Object.keys(groupedReports).map((patientName) => (
                  <option
                    key={patientName}
                    value={patientName.replace(/\s+/g, "-")}
                    className="bg-white dark:bg-blue-950 text-blue-900 dark:text-blue-100 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-all"
                  >
                    {patientName}
                  </option>
                ))}
              </select>
              
            </div>
          </div>

          {Object.entries(groupedReports).map(([patientName, reports]) => (
            <div
              key={patientName}
              id={patientName.replace(/\s+/g, "-")}
              className="mb-12 bg-white/70 dark:bg-blue-950/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-200 dark:border-blue-900 transition-all hover:shadow-blue-300/40"
            >
              <h3 className="text-2xl font-bold mb-7 text-center text-blue-700 dark:text-blue-200 tracking-wide">
                {patientName}
              </h3>
              <div className="space-y-7">
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className="bg-blue-50/80 dark:bg-blue-900/60 rounded-xl p-6 shadow border border-blue-100 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-blue-900 dark:text-blue-100 font-medium mb-2 break-words">
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(report.date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-blue-800 dark:text-blue-200 font-semibold break-words">
                        {report.reportName}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:justify-end">
                      {/* Download Image */}
                      <Button
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = report.url;
                          a.download = report.reportName || "report.jpg";
                          a.click();
                        }}
                        variant="link"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-base font-semibold whitespace-nowrap cursor-pointer"
                      >
                        <Download className="w-5 h-5" /> Download
                      </Button>
                      {/* View Image */}
                      <Button
                        onClick={() => {
                          window.open(report.url, "_blank");
                        }}
                        variant="link"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-base font-semibold whitespace-nowrap cursor-pointer"
                      >
                        <Eye className="w-5 h-5" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <DoctorFooter />
      </div>
    </TooltipProvider>
  );
}
