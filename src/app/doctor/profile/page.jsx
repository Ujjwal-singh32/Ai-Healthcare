"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDoctor } from "@/context/doctorContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import DocNav from "@/components/DocNavbar";
import { Button } from "@/components/ui/button";
import DoctorFooter from "@/components/DocFooter";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { doctor, loding } = useDoctor();
  const [isEditing, setIsEditing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    if (doctor) {
      setDoctorInfo({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        qualification: doctor.qualification || "",
        experience: doctor.experience || "",
        hospital: doctor.hospital || "",
        address: doctor.address || "",
        languages: doctor.languages || "",
        consultationFees: doctor.consultationFees || "",
        achievements: doctor.achievements || "",
        college: doctor.college || "",
        pastHospitals: doctor.pastHospitals || "",
        profilePic: doctor.profilePic || "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("/api/doctor/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          ...doctorInfo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An error occurred. Try again.");
    }
  };

  if (loding || !doctorInfo) {
    return (
      <div className="flex justify-center items-center py-20 bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#dbeafe] dark:from-[#0f172a] dark:via-[#1e3a8a] dark:to-[#1e40af] min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Modern Blue Gradient Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-l-blue-400 rounded-full animate-spin bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 shadow-xl"></div>
          {/* Animated Text */}
          <p className="text-blue-700 dark:text-blue-200 text-xl font-semibold animate-pulse">
            Loading Profile Details...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("drtoken");
    router.push("/login"); // redirect to login
    toast.success("Logged out successfully!");
  };

  const renderField = (label, name) => (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-1">
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={doctorInfo[name]}
          onChange={handleChange}
          className="p-2 rounded-lg border border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white bg-white dark:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      ) : (
        <p className="text-md text-gray-800 dark:text-gray-200 font-medium">
          {doctorInfo[name]}
        </p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#dbeafe] dark:from-[#0f172a] dark:via-[#1e3a8a] dark:to-[#1e40af] text-gray-900 dark:text-gray-100">
        <DocNav />
        <section className="max-w-5xl mx-auto px-4 py-10 pt-28 space-y-10">
          {/* Profile Header */}
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white/80 dark:bg-blue-900/60 shadow-xl rounded-2xl p-8 border border-blue-100 dark:border-blue-900/40 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-blue-400 shadow-lg">
                <AvatarImage src={doctorInfo.profilePic} alt="Doctor" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-[#1e40af] dark:text-[#60a5fa]">
                  {doctorInfo.name}
                </h2>
                <p className="text-base text-blue-700 dark:text-blue-300 font-medium mt-1">
                  {doctorInfo.specialization}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  {doctorInfo.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
              {isEditing ? (
                <>
                  <Button
                    className="bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-semibold shadow-md hover:from-[#1d4ed8] hover:to-[#2563eb]"
                    onClick={handleSaveChanges}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    className="border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-950 hover:bg-blue-50 dark:hover:bg-blue-900"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-semibold shadow-md hover:from-[#1d4ed8] hover:to-[#2563eb]"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="bg-white/80 dark:bg-blue-900/60 border border-blue-100 dark:border-blue-900/40 rounded-2xl shadow-xl p-7 backdrop-blur-md flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-2">
                Basic Information
              </h3>
              {renderField("Name", "name")}
              {renderField("Phone", "phone")}
              {renderField("Hospital", "hospital")}
              {renderField("Address", "address")}
              {renderField("Languages", "languages")}
              {renderField("Consultation Fees", "consultationFees")}
            </div>

            {/* Professional Info */}
            <div className="bg-white/80 dark:bg-blue-900/60 border border-blue-100 dark:border-blue-900/40 rounded-2xl shadow-xl p-7 backdrop-blur-md flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-2">
                Professional Details
              </h3>
              {renderField("Specialization", "specialization")}
              {renderField("Qualification", "qualification")}
              {renderField("Experience", "experience")}
              {renderField("Achievements", "achievements")}
              {renderField("College Studied", "college")}
              {renderField("Past Hospital Experience", "pastHospitals")}
            </div>
          </div>
        </section>
        <DoctorFooter />
      </div>
    </TooltipProvider>
  );
}
