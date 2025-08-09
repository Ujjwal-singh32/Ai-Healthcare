"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DoctorSection() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [loading, setLoading] = useState(true);
  const specializations = [
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];

  const toggleSpecialization = (spec) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(
        selectedSpecializations.filter((s) => s !== spec)
      );
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/user/all-doctors");
        if (response.data.success) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    const interval = setInterval(fetchDoctors, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let filteredDoctors = doctors.filter((doc) =>
    selectedSpecializations.length === 0
      ? true
      : selectedSpecializations.includes(doc.specialization)
  );

  if (sortBy === "price") {
    filteredDoctors.sort((a, b) => a.price - b.price);
  } else if (sortBy === "rating") {
    filteredDoctors.sort((a, b) => b.rating - a.rating);
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Gradient Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] shadow-lg"></div>

          {/* Animated Loading Text */}
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-xl font-semibold animate-pulse">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <section className="pt-32 py-12 min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946]">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] drop-shadow-lg mb-8 text-center">
            Meet Our Expert Doctors
          </h1>
          <div className="w-full flex justify-center my-8">
            <div className="h-1 w-32 bg-[#2563eb] rounded-full shadow-md" />
          </div>
          <div className="mb-8 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center relative z-10">
            {/* Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"
                  />
                </svg>
                Filter by Specialization
                <span className="text-sm">⏷</span>
              </button>
              {dropdownOpen && (
                <div className="absolute z-50 mt-3 bg-white dark:bg-[#232946] border border-[#2563eb]/20 dark:border-[#60a5fa]/20 rounded-2xl shadow-2xl p-4 max-h-60 overflow-y-auto w-64 backdrop-blur-xl">
                  <h3 className="font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-3 text-center">
                    Specializations
                  </h3>
                  {specializations.map((spec) => (
                    <label
                      key={spec}
                      className="flex items-center gap-3 p-2 hover:bg-[#2563eb]/5 dark:hover:bg-[#60a5fa]/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="w-4 h-4 accent-[#2563eb] rounded"
                      />
                      <span className="text-[#2563eb] dark:text-[#60a5fa] font-medium">
                        {spec}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-[#232946] border-2 border-[#2563eb] dark:border-[#60a5fa] rounded-xl text-[#2563eb] dark:text-[#60a5fa] font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 dark:focus:ring-[#60a5fa]/20 transition-all duration-300 cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>
          </div>
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="group backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] cursor-pointer"
                onClick={() => router.push(`/user/doctor/${doctor._id}`)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Doctor Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-[#2563eb] dark:border-[#60a5fa] shadow-lg overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#60a5fa] p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#232946]">
                        <Image
                          src={doctor.profilePic}
                          alt={doctor.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-[#232946] rounded-full"></div>
                  </div>
                  {/* Doctor Info */}
                  <div className="space-y-2 w-full">
                    <h3 className="text-xl font-bold text-[#2563eb] dark:text-[#60a5fa] group-hover:text-[#1d4ed8] dark:group-hover:text-[#3b82f6] transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#6366f1] dark:text-[#a78bfa] bg-[#2563eb]/10 dark:bg-[#60a5fa]/10 px-3 py-1 rounded-full">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-[#1e1b4b] dark:text-[#f3e8ff] flex items-center justify-center gap-1">
                      {doctor.experience}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(3)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                      >
                        <path d="M12 .587l3.668 7.571 8.332 1.151-6.064 5.916 1.428 8.294L12 18.896l-7.364 4.623 1.428-8.294-6.064-5.916 8.332-1.151z" />
                      </svg>
                    ))}
                  </div>
                  {/* Price */}
                  <div className="flex items-center gap-2 text-[#059669] dark:text-[#34d399] font-bold">
                    <span>₹{doctor.consultationFees}</span>
                  </div>
                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/doctor/${doctor._id}`);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Empty State */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-[#2563eb] dark:text-[#60a5fa] mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14v7m0 0H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2h-7z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-2">
                No doctors found
              </h3>
              <p className="text-[#1e1b4b] dark:text-[#f3e8ff]">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </section>
      <UserFooter />
    </>
  );
}