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
      <main className="min-h-screen bg-purple-50 dark:bg-purple-900 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Welcome Section */}
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 dark:text-white mb-4">
            Welcome to Rakshaa Lab Portal
          </h1>
          <p className="text-purple-700 dark:text-purple-200 text-lg mb-8">
            Manage your lab reports, submit tests, and keep track of diagnostics
            with ease.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <HomeCard
              title="Pending Reports"
              description="Upload and manage reports for booked lab tests."
              icon={<ClipboardList className="w-10 h-10 text-purple-600" />}
              href="/pathlab/pending-reports"
            />
            <HomeCard
              title="Reports Submitted"
              description="View reports that have already been uploaded."
              icon={<FileCheck className="w-10 h-10 text-green-600" />}
              href="/pathlab/completed-reports"
            />
            <HomeCard
              title="Test Offered"
              description="Update or review the diagnostic tests you offer."
              icon={<FlaskConical className="w-10 h-10 text-blue-600" />}
              href="/pathlab/tests"
            />
          </div>

          {/* Call to Action */}
          {/* Info / Motivation Section */}
          <div className="mt-12 bg-purple-100 dark:bg-purple-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-purple-900 dark:text-white mb-2">
              🧪 Always Improving Diagnostics
            </h2>
            <p className="text-purple-700 dark:text-purple-200 mb-1">
              Accuracy and timely reporting are the backbone of great
              healthcare.
            </p>
            <p className="text-purple-700 dark:text-purple-200">
              Keep doing your best — every test you process helps someone heal
              faster. 💜
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
    className="bg-white dark:bg-purple-950 border border-purple-200 dark:border-purple-700 p-6 rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col items-center text-center gap-4"
  >
    {icon}
    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-100">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
  </Link>
);