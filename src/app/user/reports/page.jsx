"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useUser } from "@/context/userContext";
import ChatButton from "@/components/chatbutton";
import axios from "axios";
const tabs = ["started", "upcoming", "completed"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("started");
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  const { user, userId } = useUser();
  useEffect(() => {
    if (!userId) router.push("/login");
    const fetchAppointments = async () => {
      try {
        const res = await axios.post("/api/booking/all-doct-book-details", {
          patientId: userId,
        });
        if (res.data.success) {
          // console.log("bookings" , res.data.bookings)
          setAppointments(res.data.bookings);
        } else {
          console.error("Failed to fetch bookings:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [userId]);

  // console.log("appointments", appointments);

  const filteredAppointments = appointments
    .filter((a) => a.status === activeTab)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <UserNavbar />
      <section className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] py-12 px-4 relative pt-28">
        {/* Decorative SVG background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" className="opacity-10 dark:opacity-10">
            <defs>
              <radialGradient id="reports-bg" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#reports-bg)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2563eb] dark:text-[#60a5fa] mb-10 tracking-tight drop-shadow-glow">
            Your Appointments
          </h2>

          <div className="flex flex-col sm:flex-row justify-center mb-10 gap-4 items-center cursor-pointer">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-6 py-2 rounded-full text-base font-semibold capitalize w-40 text-center cursor-pointer transition transform duration-200 hover:scale-105 active:scale-95 shadow-md border",
                  {
                    "bg-[#2563eb] text-white border-[#2563eb]": activeTab === tab,
                    "bg-white/80 text-[#2563eb] border-[#c7d2fe] dark:bg-[#f3f4f6]/80 dark:text-[#2563eb] dark:border-[#60a5fa]":
                      activeTab !== tab,
                  }
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAppointments.map((appt) => (
              <div
                key={appt._id}
                onClick={
                  appt.type === "started"
                    ? () => router.push(`/user/reports/${appt._id}`)
                    : undefined
                }
                className={clsx(
                  "glassmorphic bg-white/90 dark:bg-[#f3f4f6]/90 shadow-xl rounded-3xl p-7 border border-[#c7d2fe] dark:border-[#60a5fa] transition transform duration-200 flex flex-col gap-2 relative group hover:shadow-2xl hover:scale-[1.03] cursor-pointer",
                  {
                    "ring-2 ring-[#2563eb]": appt.type === "started",
                  }
                )}
              >
                {appt.type === "started" && (
                  <span className="absolute top-4 right-4 w-3 h-3 bg-[#2563eb] rounded-full shadow-md" />
                )}
                <h3 className="text-lg font-bold text-[#2563eb] dark:text-[#2563eb] mb-1">
                  Doctor: {appt.doctorName}
                </h3>
                <p className="text-sm text-[#2563eb] dark:text-[#2563eb] opacity-80">
                  Patient: {user ? user.name : "patient name loading...."}
                </p>
                <p className="text-sm text-[#2563eb] dark:text-[#2563eb] opacity-80">
                  Disease: {appt.disease}
                </p>
                <p className="text-sm text-[#2563eb] dark:text-[#2563eb] font-medium mt-2">
                  Date:{" "}
                  {new Date(appt.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {appt.status === "started" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/reports/${appt._id}`);
                    }}
                    className="mt-4 px-5 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm rounded-full font-semibold shadow transition"
                  >
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="my-10 border-t border-[#c7d2fe] dark:border-[#60a5fa]" />
        </div>
      </section>
      <ChatButton />
      <UserFooter />
    </>
  );
}
