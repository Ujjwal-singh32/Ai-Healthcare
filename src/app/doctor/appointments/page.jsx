"use client";

import React, { useEffect, useState } from "react";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import Link from "next/link";
import axios from "axios";
import { useDoctor } from "@/context/doctorContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState("started");
  const [appointments, setAppointments] = useState([]);
  const { doctorId } = useDoctor();
  const router = useRouter();
  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.post("/api/booking/all-patient-book-details", {
          doctorId: doctorId,
        });

        if (res.data.success) {
          // console.log("checkingr", res.data.bookings);
          setAppointments(res.data.bookings);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [doctorId]);

  const handleMarkStarted = async (bookingId) => {
    try {
      const res = await axios.post("/api/booking/markstarted", {
        bookingId: bookingId,
      });
      if (res.data.success) {
        toast.success("Status Updated");
        router.push("/doctor/home");
      } else {
        toast.error("Error Occured");
      }
    } catch (error) {
      toast.error("Error Occured");
      console.log(error);
    }
  };

  const filteredAppointments = appointments
    .filter(
      (appt) => appt.status === (activeTab === "started" ? "started" : "upcoming")
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 text-blue-900 dark:text-blue-100">
      <DocNav />
      {/* Spacer to ensure content starts after navbar */}
      <div className="h-16 sm:h-20" />
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-900 dark:text-white mb-10 mt-8">
        Your Appointments
      </h2>
      <div className="px-4 mb-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap gap-4 mb-8 w-full justify-center">
          <button
            onClick={() => setActiveTab("started")}
            className={`px-6 py-2 rounded-full font-semibold text-base shadow transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${activeTab === "started"
                ? "bg-blue-600 text-white border-blue-700 shadow-lg scale-105"
                : "bg-white/60 text-blue-800 border-blue-200 hover:bg-blue-100"
              }`}
          >
            Started Appointments
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2 rounded-full font-semibold text-base shadow transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${activeTab === "upcoming"
                ? "bg-blue-600 text-white border-blue-700 shadow-lg scale-105"
                : "bg-white/60 text-blue-800 border-blue-200 hover:bg-blue-100"
              }`}
          >
            Upcoming Appointments
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAppointments.length === 0 ? (
            <div className="col-span-full text-center text-lg text-blue-700/80 dark:text-blue-200/80 py-12">
              No appointments found in this category.
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white/70 dark:bg-blue-950/70 backdrop-blur-md p-7 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 transition-all hover:shadow-2xl hover:-translate-y-1 relative"
              >
                {/* Date at top right */}
                <span className="absolute top-5 right-7 bg-blue-100 dark:bg-blue-900/60 px-3 py-1 rounded-full text-blue-700 dark:text-blue-200 font-medium text-xs shadow">
                  {new Date(appt.date).toLocaleDateString()} {new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <h4 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">
                  {appt.patient?.name || "Patient"}
                </h4>
                <div className="mb-4">
                  <span className="bg-blue-50 dark:bg-blue-900/40 px-4 py-1 rounded-full text-blue-600 dark:text-blue-300 font-semibold text-base shadow-sm">
                    {appt.disease}
                  </span>
                </div>
                <div className="mb-2 text-blue-900/80 dark:text-blue-100/80">
                  <p className="mb-1">Payment Mode: <span className="font-semibold">{appt.paymentMode}</span></p>
                  <p className="mb-1">Fee: <span className="font-semibold">₹{appt.consultationFee}</span></p>
                </div>
                {appt.status === "started" && (
                  <Link
                    href={`/doctor/appointments/${appt._id}`}
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                )}
                {appt.status === "upcoming" && (
                  <button
                    onClick={() => handleMarkStarted(appt._id)}
                    className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  >
                    Start Appointment
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <DoctorFooter />
    </div>
  );
}
