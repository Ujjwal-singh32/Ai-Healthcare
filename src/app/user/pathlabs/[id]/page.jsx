"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useUser } from "@/context/userContext";
import ChatButton from "@/components/chatbutton";



const timeSlots = {
  "9:00 AM": 3,
  "10:30 AM": 2,
  "12:00 PM": 4,
  "2:00 PM": 1,
  "4:00 PM": 5,
};

const PathlabDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user } = useUser();
  const [lab, setLab] = useState(null);
  const [testsList, setTestsList] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showSlots, setShowSlots] = useState(false);

  // Fetch lab details from backend
  useEffect(() => {
    if (!id) return;
    const fetchLabDetails = async () => {
      try {
        const res = await axios.post("/api/user/pathlab-detailsbyId", {
          pathlabId: id,
        });
        if (res.data.success) {
          setLab({
            id: res.data.labId,
            name: res.data.labName,
            location: res.data.address || "Not Available", 
            timings: "Mon - Sat, 8:00 AM - 6:00 PM", 
            bio: res.data.bio || "It is the best pathlab",
            image: res.data.image || "/globe.svg",
            email: res.data.email || "info@pathlab.com",
            phone: res.data.phone || "+91 9876543210",
            rating: 4.7, 
          });
          setTestsList(
            (res.data.tests || []).map((test) => ({
              name: test.testname,
              price: test.price,
            }))
          );
        }
      } catch (err) {
        console.error("Fetch lab details error:", err);
      }
    };
    fetchLabDetails();
  }, [id]);

  const handleTestChange = (testName) => {
    setSelectedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    );
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot("");
    setShowSlots(false);
  };

  const handleBooking = () => {
    if (selectedTests.length === 0 || !date || !selectedSlot) {
      alert("Please select at least one test, a date, and a time slot.");
      return;
    }
    const bookingData = {
      labId: lab.id,
      date,
      patientId: user._id,
      tests: selectedTests,
      fee: getTotalPrice(),
    };
    const queryParams = new URLSearchParams(bookingData).toString();
    router.push(`/user/pathlabs/${lab.id}/booking/?${queryParams}`);
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((total, testName) => {
      const test = testsList.find((t) => t.name === testName);
      return total + (test?.price || 0);
    }, 0);
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] py-12 px-4 pt-28">
        <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/90 dark:bg-[#232946]/90 rounded-xl shadow-2xl p-8 md:p-10 border-2 border-[#2563eb] dark:border-[#60a5fa]">
          {/* Lab Info */}
          {lab ? (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#2563eb]/20 rounded-xl blur-md transform -rotate-3"></div>
                <div className="relative overflow-hidden rounded-xl border-2 border-[#2563eb] shadow-lg w-[180px] h-[180px]">
                  <Image
                    src={lab.image}
                    alt={lab.name}
                    width={180}
                    height={180}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#2563eb] text-white px-2 py-1 text-xs font-bold rounded-tl-md">
                    VERIFIED
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left space-y-3 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-3xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] tracking-tight">
                    {lab.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-end gap-1 text-[#2563eb] dark:text-[#60a5fa] mt-2 md:mt-0">
                    {[...Array(Math.round(lab.rating))].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.571 8.332 1.151-6.064 5.916 1.428 8.294L12 18.896l-7.364 4.623 1.428-8.294-6.064-5.916 8.332-1.151z" />
                      </svg>
                    ))}
                    <span className="text-sm font-bold ml-1">
                      {lab.rating}/5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                  <div className="flex items-center gap-2 text-[#4b5563] dark:text-[#cbd5e1]">
                    <svg
                      className="w-5 h-5 text-[#2563eb]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{lab.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4b5563] dark:text-[#cbd5e1]">
                    <svg
                      className="w-5 h-5 text-[#2563eb]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{lab.timings}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4b5563] dark:text-[#cbd5e1]">
                    <svg
                      className="w-5 h-5 text-[#2563eb]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{lab.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4b5563] dark:text-[#cbd5e1]">
                    <svg
                      className="w-5 h-5 text-[#2563eb]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{lab.phone}</span>
                  </div>
                </div>

                <p className="text-[#4b5563] dark:text-[#cbd5e1] text-sm mt-2 bg-[#f3f4f6] dark:bg-[#1f2937] p-3 rounded-lg border border-[#e5e7eb] dark:border-[#374151]">
                  {lab.bio}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb]"></div>
            </div>
          )}

          {/* Test Selection */}
          {testsList.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1.5 bg-[#2563eb] rounded-full"></div>
                <h3 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                  Available Tests
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testsList.map((test, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl text-base font-medium cursor-pointer transition-all duration-200 border-2 ${
                      selectedTests.includes(test.name)
                        ? "border-[#2563eb] bg-[#2563eb]/10 dark:bg-[#2563eb]/20 shadow-md"
                        : "border-[#e5e7eb] dark:border-[#374151] bg-white/60 dark:bg-[#1f2937]/60 hover:border-[#93c5fd] dark:hover:border-[#60a5fa]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded flex items-center justify-center border-2 ${
                          selectedTests.includes(test.name)
                            ? "bg-[#2563eb] border-[#2563eb]"
                            : "border-[#cbd5e1] dark:border-[#64748b]"
                        }`}
                      >
                        {selectedTests.includes(test.name) && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        value={test.name}
                        checked={selectedTests.includes(test.name)}
                        onChange={() => handleTestChange(test.name)}
                        className="hidden"
                      />
                      <span className="text-[#1f2937] dark:text-[#f3f4f6]">
                        {test.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[#2563eb] dark:text-[#60a5fa] font-bold">
                        ₹{test.price}
                      </span>
                      <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                        {selectedTests.includes(test.name)
                          ? "Selected"
                          : "Click to select"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {selectedTests.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-[#dbeafe] dark:bg-[#1e3a8a]/50 border border-[#93c5fd] dark:border-[#3b82f6] text-[#2563eb] dark:text-[#60a5fa] text-sm">
                  <span className="font-bold">{selectedTests.length}</span> test
                  {selectedTests.length !== 1 ? "s" : ""} selected
                </div>
              )}
            </div>
          )}

          {/* Booking Section */}
          <div className="mt-12 bg-[#f8fafc] dark:bg-[#0f172a] rounded-xl border-2 border-[#e2e8f0] dark:border-[#1e293b] p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1.5 bg-[#2563eb] rounded-full"></div>
              <h3 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                Schedule Appointment
              </h3>
            </div>

            {/* Date Picker */}
            <div className="mb-6">
              <label className="block text-base font-semibold mb-2 text-[#1f2937] dark:text-[#f3f4f6]">
                Select Date
                <span className="text-[#2563eb]">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563eb]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-[#374151] bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f3f4f6] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                />
              </div>
            </div>

            {/* Slot Selection */}
            {date && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-base font-semibold text-[#1f2937] dark:text-[#f3f4f6]">
                    Available Time Slots
                    <span className="text-[#2563eb]">*</span>
                  </label>
                  {!showSlots && (
                    <button
                      onClick={() => setShowSlots(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-all shadow-md"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Show Available Slots
                    </button>
                  )}
                </div>

                {showSlots && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Object.entries(timeSlots).map(([slot, count]) => (
                      <label
                        key={slot}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl text-center font-medium border-2 cursor-pointer transition-all ${
                          selectedSlot === slot
                            ? "bg-[#2563eb] text-white border-[#2563eb]"
                            : count === 0
                            ? "bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] dark:bg-[#1e293b] dark:text-[#64748b] dark:border-[#334155] cursor-not-allowed opacity-60"
                            : "bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f3f4f6] border-[#e5e7eb] dark:border-[#374151] hover:border-[#93c5fd] dark:hover:border-[#60a5fa]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot}
                          checked={selectedSlot === slot}
                          onChange={() => setSelectedSlot(slot)}
                          disabled={count === 0}
                          className="hidden"
                        />
                        <div className="text-base mb-1">{slot}</div>
                        <div
                          className={`text-xs font-normal rounded-full px-2 py-0.5 ${
                            selectedSlot === slot
                              ? "bg-white/20 text-white"
                              : count === 0
                              ? "bg-[#e2e8f0] dark:bg-[#334155] text-[#94a3b8] dark:text-[#64748b]"
                              : count <= 2
                              ? "bg-[#fee2e2] dark:bg-[#7f1d1d]/40 text-[#ef4444] dark:text-[#f87171]"
                              : "bg-[#dcfce7] dark:bg-[#14532d]/40 text-[#22c55e] dark:text-[#4ade80]"
                          }`}
                        >
                          {count === 0 ? "Full" : `${count} slots left`}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Total Price & Book Button */}
            {selectedSlot && (
              <div className="mt-8 border-t-2 border-[#e5e7eb] dark:border-[#374151] pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-[#2563eb]/10 dark:bg-[#2563eb]/20">
                      <svg
                        className="w-6 h-6 text-[#2563eb]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
                        Total Amount
                      </div>
                      <div className="text-2xl font-bold text-[#1f2937] dark:text-white">
                        ₹{getTotalPrice()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book Lab Test
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatButton />
      <UserFooter />
    </>
  );
};

export default PathlabDetailsPage;
