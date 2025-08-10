"use client";

import React from "react";
import LabNavbar from "@/components/LabNavbar";
import Link from "next/link";
import { ClipboardList, FileCheck, FlaskConical } from "lucide-react";
import LabFooter from "@/components/LabFooter";

const PathlabHome = () => {
  return (
    <>
  <LabNavbar />
  {/* Spacer to ensure content starts after navbar */}
  <div className="h-16 sm:h-20" />
  <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Welcome Section */}
          <h1 className="text-4xl sm:text-5xl font-black text-[#2563eb] dark:text-[#60a5fa] mb-5 tracking-tight drop-shadow-lg font-sans">
            Welcome to Rakshaa Lab Portal
          </h1>
          <p className="text-blue-700 dark:text-blue-200 text-xl mb-10 font-medium max-w-2xl mx-auto">
            Manage your lab reports, submit tests, and keep track of diagnostics with ease. Experience seamless, modern healthcare management for your lab.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <HomeCard
              title="Pending Reports"
              description="Upload and manage reports for booked lab tests."
              icon={<ClipboardList className="w-12 h-12 text-[#2563eb] bg-blue-100 rounded-full p-2 shadow" />}
              href="/pathlab/pending-reports"
            />
            <HomeCard
              title="Reports Submitted"
              description="View reports that have already been uploaded."
              icon={<FileCheck className="w-12 h-12 text-green-600 bg-green-100 rounded-full p-2 shadow" />}
              href="/pathlab/completed-reports"
            />
            <HomeCard
              title="Test Offered"
              description="Update or review the diagnostic tests you offer."
              icon={<FlaskConical className="w-12 h-12 text-[#60a5fa] bg-blue-100 rounded-full p-2 shadow" />}
              href="/pathlab/tests"
            />
          </div>

          {/* Info / Motivation Section */}
          <div className="mt-16 bg-white/70 dark:bg-blue-950/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-200 mb-3 font-sans tracking-tight">
              Always Improving Diagnostics
            </h2>
            <p className="text-blue-700 dark:text-blue-200 mb-2 text-lg font-medium">
              Accuracy and timely reporting are the backbone of great healthcare.
            </p>
            <p className="text-blue-700 dark:text-blue-200 text-base">
              Keep doing your best — every test you process helps someone heal faster.
            </p>
          </div>
        </div>
      </main>
      <LabFooter/>
    </>
  );
};

export default PathlabHome;

// Reusable HomeCard component
const HomeCard = ({ title, description, icon, href }) => (
  <Link
    href={href}
    className="bg-white/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-5 backdrop-blur-md"
    style={{ minHeight: 220 }}
  >
    {icon}
    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-100 font-sans">
      {title}
    </h3>
    <p className="text-base text-blue-700 dark:text-blue-200 font-medium max-w-xs mx-auto">{description}</p>
  </Link>
);