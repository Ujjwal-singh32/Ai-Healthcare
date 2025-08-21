"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import HealthChatbotSection from "@/components/Chatbot";

export default function MyBookings() {
  const { user, loading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.post("/api/getAmbulanceBooking", {
          patientId: user._id,
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading || loadingBookings) {
    return (
      <>
        <UserNavbar />
        <div className="flex justify-center items-center py-20 bg-blue-50 dark:bg-[#181c2a] min-h-screen px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#93c5fd] via-[#2563eb] to-[#60a5fa] shadow-lg"></div>
            <p className="text-[#2563eb] dark:text-[#60a5fa] text-xl font-semibold animate-pulse">
              Loading Your Bookings...
            </p>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  if (!bookings.length) {
    return (
      <>
        <UserNavbar />
        <div className="flex justify-center items-center min-h-[70vh] bg-[#e0e7ef] dark:bg-[#232946] animate-fade-in">
          <div className="bg-white dark:bg-[#181c2a] rounded-3xl shadow-2xl px-10 py-8 border-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30">
            <span className="text-xl md:text-2xl font-semibold text-[#2563eb] dark:text-[#60a5fa] flex items-center gap-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M3 17V7a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2v10m-11.5 0a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2m-11.5 0V7m11.5 10V7m0 10h2.5a2 2 0 0 0 2-2v-2.5a2 2 0 0 0-.59-1.41l-2.5-2.5A2 2 0 0 0 17 7.5V7"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              No bookings found.
            </span>
          </div>
        </div>
        <UserFooter />
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="relative min-h-screen pb-10 bg-[#e0e7ef] dark:bg-[#232946] pt-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-[#2563eb] dark:text-[#60a5fa] tracking-tight">
            My Ambulance Bookings
          </h1>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b, idx) => (
              <div
                key={idx}
                className="relative flex flex-col bg-white dark:bg-[#181c2a] rounded-3xl shadow-2xl border border-[#2563eb]/60 dark:border-[#60a5fa]/60 p-0 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-[#2563eb] dark:hover:border-[#60a5fa] group pt-10"
                style={{ minHeight: 270 }}
              >
                <div className="h-2 w-full bg-[#2563eb] dark:bg-[#60a5fa] absolute top-0 left-0" />
                <div className="flex-1 flex flex-col pb-4 px-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-extrabold text-[#2563eb] dark:text-[#60a5fa] tracking-tight">
                      Ambulance #{b.ambulanceNumber}
                    </span>
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-xs shadow-md border animate-pulse-slow ${
                        b.status === "completed"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : b.status === "on the way"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <hr className="my-2 border-t-2 border-[#2563eb] dark:border-[#60a5fa]" />
                  <div className="grid grid-cols-1 gap-2 text-[15px] text-[#1e1b4b] dark:text-[#f3e8ff]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Driver:</span>{" "}
                      <span>{b.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Driver Number:</span>{" "}
                      <span>{b.driverNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Distance:</span>{" "}
                      <span>{b.distance.toFixed(2)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Amount:</span>{" "}
                      <span className="font-bold text-base text-[#2563eb] dark:text-[#60a5fa]">
                        ₹{b.totalAmount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">
                        Estimated Time:
                      </span>{" "}
                      <span>{b.timeReq} mins</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HealthChatbotSection />
      <UserFooter />
    </>
  );
}
