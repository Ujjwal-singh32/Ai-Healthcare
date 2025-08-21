"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/userContext";
import { Calendar, Clock, MapPin, Award, Stethoscope, DollarSign, Heart, Star, ThumbsUp } from "lucide-react";
// Predefined slot times
const timeSlots = {
  "10:00 AM": 3,
  "11:00 AM": 2,
  "12:00 PM": 5,
  "2:00 PM": 4, 
  "3:00 PM": 1,
};

const isWeekday = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Mon to Fri
};

export default function DoctorDetailsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [date, setDate] = useState("");
  const [disease, setDisease] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showSlots, setShowSlots] = useState(false);
  const [isValidDay, setIsValidDay] = useState(false);
  const params = useParams();
  const doctorId = params.id;
  // console.log("doctor id from frontend", doctorId);
  const [doctor, setDoctor] = useState(null);

  const [selectedDateObj, setSelectedDateObj] = useState(null);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);

    const formatted = selectedDate.toLocaleDateString("en-CA");
    setDate(formatted);
    setSelectedDateObj(selectedDate);
    setSelectedSlot("");
    setShowSlots(false);
    setIsValidDay(isWeekday(selectedDate));
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await axios.post(
          "/api/doctor/detailsbyId",
          { doctorId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("data doctor", res.data.doctor);

        if (res.data.success) {
          setDoctor(res.data.doctor);
        } else {
          console.error("Doctor not found");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  if (!doctor) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] px-4">
          {/* Gradient Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] shadow-lg mb-6"></div>

          {/* Animated Text */}
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-xl font-semibold animate-pulse">
            Loading doctor details...
          </p>
        </div>
        <UserFooter />
      </>
    );
  }

  const handleAppointment = () => {
    if (!date || !selectedSlot) {
      alert("Please select a date and a valid slot.");
      return;
    }

    const queryParams = new URLSearchParams({
      doctorId: doctorId,
      patientId: user._id,
      doctorName: doctor.name,
      date: selectedDateObj.toISOString(),
      disease: disease,
      consultationFee: doctor.consultationFees,
      paymentMode: "online",
      patientName: user.name,
    });

    router.push(`/user/doctor/${doctorId}/booking?${queryParams.toString()}`);
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] py-10 pt-24 relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" className="opacity-10 dark:opacity-5">
            <defs>
              <radialGradient id="bg-grad" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg-grad)" />
          </svg>
        </div>
        
        {/* Animated floating icons */}
        <div className="absolute left-8 top-32 animate-float-slow hidden md:block">
          <Stethoscope className="w-12 h-12 text-[#2563eb] opacity-70" />
        </div>
        <div className="absolute right-12 top-48 animate-float-fast hidden md:block">
          <Heart className="w-10 h-10 text-[#2563eb] opacity-60" />
        </div>
        <div className="absolute left-24 bottom-32 animate-float-medium hidden md:block">
          <Star className="w-10 h-10 text-[#2563eb] opacity-60" />
        </div>
        
        <div className="max-w-5xl mx-auto bg-white/80 dark:bg-[#232946]/80 rounded-3xl shadow-2xl p-8 md:p-12 border border-[#2563eb]/30 dark:border-[#60a5fa]/30 backdrop-blur-xl relative z-10">
          {/* Doctor Info */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src={doctor.profilePic}
              alt={doctor.name}
              width={160}
              height={160}
              className="rounded-full border-4 border-[#2563eb] dark:border-[#60a5fa] shadow-xl"
            />
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa] drop-shadow-sm">
                {doctor.name}
              </h2>
              <p className="text-xl font-medium text-[#2563eb]/80 dark:text-[#60a5fa]/80">
                {doctor.specialization}
              </p>
              <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f3e8ff]">
                {doctor.qualification}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                ₹{doctor.consultationFees} per consultation
              </p>
              <div className="flex items-center gap-1 justify-center md:justify-start text-yellow-400">
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
            </div>
          </div>

          {/* Divider */}
          <div className="w-full flex justify-center my-8">
            <div className="h-1 w-32 bg-[#2563eb]/50 dark:bg-[#60a5fa]/50 rounded-full shadow-md" />
          </div>
          
          {/* About Section */}
          <div className="mt-6 space-y-4 text-[#2563eb] dark:text-[#60a5fa]">
            <h3 className="text-2xl font-bold border-b border-[#2563eb]/30 dark:border-[#60a5fa]/30 pb-2">
              About Doctor
            </h3>
            <p className="text-sm leading-relaxed text-[#1e1b4b] dark:text-[#f3e8ff]">
              {doctor.qualification}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/80 dark:bg-[#232946]/80 p-5 rounded-xl shadow-lg border border-[#2563eb]/30 dark:border-[#60a5fa]/30 hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-[#2563eb] dark:text-[#60a5fa]">Experience</p>
                </div>
                <p className="text-sm text-[#1e1b4b] dark:text-[#f3e8ff]">
                  {doctor.experience}
                </p>
              </div>
              <div className="bg-white/80 dark:bg-[#232946]/80 p-5 rounded-xl shadow-lg border border-[#2563eb]/30 dark:border-[#60a5fa]/30 hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-[#2563eb] dark:text-[#60a5fa]">Clinic Location</p>
                </div>
                <p className="text-sm text-[#1e1b4b] dark:text-[#f3e8ff]">
                  {doctor.address}
                </p>
              </div>
              <div className="bg-white/80 dark:bg-[#232946]/80 p-5 rounded-xl shadow-lg border border-[#2563eb]/30 dark:border-[#60a5fa]/30 hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-[#2563eb] dark:text-[#60a5fa]">Availability</p>
                </div>
                <p className="text-sm text-[#1e1b4b] dark:text-[#f3e8ff]">
                  Mon-Fri (10 am - 6 Pm)
                </p>
              </div>
              <div className="bg-white/80 dark:bg-[#232946]/80 p-5 rounded-xl shadow-lg border border-[#2563eb]/30 dark:border-[#60a5fa]/30 hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-[#2563eb] dark:text-[#60a5fa]">Consultation Fee</p>
                </div>
                <p className="text-sm text-[#1e1b4b] dark:text-[#f3e8ff]">
                  ₹{doctor.consultationFees}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full flex justify-center my-8">
            <div className="h-1 w-32 bg-[#2563eb]/50 dark:bg-[#60a5fa]/50 rounded-full shadow-md" />
          </div>
          
          {/* Date & Slot Selection */}
          <div className="mt-8 space-y-6 bg-white/90 dark:bg-[#232946]/90 p-6 rounded-2xl shadow-xl border border-[#2563eb]/30 dark:border-[#60a5fa]/30">
            <h3 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] mb-6 text-center">
              Book an Appointment
            </h3>
            
            {/* Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-[#2563eb] dark:text-[#60a5fa]">
                <Calendar className="w-5 h-5" />
                Select Appointment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border border-[#2563eb]/30 dark:border-[#60a5fa]/30 bg-white/70 dark:bg-[#232946]/70 text-[#1e1b4b] dark:text-[#f3e8ff] focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#60a5fa] focus:border-transparent outline-none transition-all shadow-md"
              />
            </div>
            
            {/* Disease Input */}
            <div className="mt-8">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-[#2563eb] dark:text-[#60a5fa]">
                <Stethoscope className="w-5 h-5" />
                Describe Your Health Issue / Disease
              </label>
              <textarea
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#2563eb]/30 dark:border-[#60a5fa]/30 bg-white/70 dark:bg-[#232946]/70 text-[#1e1b4b] dark:text-[#f3e8ff] focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#60a5fa] focus:border-transparent outline-none transition-all shadow-md"
                placeholder="E.g., Fever, Cough, Headache..."
              ></textarea>
            </div>

            {/* Slot Reveal Button */}
            {date && (
              <div className="text-center">
                <button
                  onClick={() => setShowSlots(true)}
                  className="px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl font-semibold"
                >
                  View Available Slots
                </button>
              </div>
            )}

            {/* Slot Selector */}
            {showSlots && (
              <div className="mt-8 animate-fade-in">
                {isValidDay ? (
                  <>
                    <p className="flex items-center gap-2 text-sm font-semibold mb-3 text-[#2563eb] dark:text-[#60a5fa]">
                      <Clock className="w-5 h-5" />
                      Available Time Slots
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(timeSlots).map(([slot, count]) => (
                        <label
                          key={slot}
                          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium border shadow-md transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? "bg-green-500 text-white border-green-600 shadow-lg scale-105"
                              : count === 0
                              ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-50"
                              : "bg-white/80 dark:bg-[#232946]/80 text-[#2563eb] dark:text-[#60a5fa] border-[#2563eb]/30 dark:border-[#60a5fa]/30 hover:bg-[#2563eb]/10 dark:hover:bg-[#60a5fa]/10"
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
                          {slot}{" "}
                          <span className={`text-xs ml-1 font-normal ${
                            selectedSlot === slot ? "text-white" : "text-[#2563eb]/70 dark:text-[#60a5fa]/70"
                          }`}>
                            ({count} left)
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-4 text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                      Doctor is not available on weekends. Please select a weekday.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Appointment Button */}
          {selectedSlot && (
            <div className="mt-10 text-center animate-fade-in">
              <button
                onClick={handleAppointment}
                className="px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                Take Appointment
              </button>
            </div>
          )}
        </div>
      </div>
      <UserFooter />
    </>
  );
}
