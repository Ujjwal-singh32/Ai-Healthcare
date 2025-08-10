"use client";

import React, { useState, useEffect } from "react";
import { LogOut, Pencil, Save, X, FlaskConical } from "lucide-react";
import { usePathlab } from "@/context/pathlabContext";
import LabNavbar from "@/components/LabNavbar";
import LabFooter from "@/components/LabFooter";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PathlabProfilePage = () => {
  const { pathlab, setPathlab, loading } = usePathlab();
  const [editMode, setEditMode] = useState(false);
  const [tempLab, setTempLab] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (pathlab) {
      setTempLab(pathlab);
    }
  }, [pathlab]);

  const handleChange = (field, value) => {
    setTempLab((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };


  const handleCancel = () => {
    setTempLab(pathlab);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      const pttoken = localStorage.getItem("pttoken");
      const formData = new FormData();
      formData.append("id", tempLab._id);
      formData.append("labName", tempLab.labName);
      formData.append("phone", tempLab.phone);
      formData.append("labAddress", tempLab.labAddress);

      const res = await axios.put("/api/pathlab/update", formData, {
        headers: {
          Authorization: `Bearer ${pttoken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        toast.success("profile updated");
        setPathlab(res.data.updatedLab);
        setEditMode(false);
      } else {
        alert("Failed to update pathlab profile.");
      }
    } catch (err) {
      alert("An error occurred while updating the profile.");
    }
  };


  const handleLogout = () => {
    // Implement logout logic here, e.g., clear tokens and redirect
    localStorage.removeItem("pttoken");
    router.push("/login");
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-blue-700 dark:text-blue-200 text-xl font-semibold">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!pathlab) {
    return <div className="p-10 text-center">No pathlab data found.</div>;
  }

  return (
    <>
      <LabNavbar />
      {/* Spacer to ensure content starts after navbar */}
      <div className="h-16 sm:h-20" />
      <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center py-10 px-2 sm:px-6">
        <section className="w-full max-w-2xl">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-0 sm:p-0 overflow-hidden">
            {/* Profile Header */}
            <div className="px-8 py-8 flex flex-col items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950">
              <img
                src={tempLab.profilePic || 'https://via.placeholder.com/150'}
                alt="Lab"
                className="w-28 h-28 rounded-full border-2 border-blue-300 dark:border-blue-700 object-cover shadow bg-white"
              />
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 tracking-tight font-sans">
                {tempLab.labName || 'Lab Name'}
              </h2>
              <p className="text-blue-600 dark:text-blue-300 text-base font-medium">{tempLab.email}</p>
            </div>
            {/* Profile Details Card */}
            <div className="px-8 py-10 sm:py-12 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Address */}
                <div className="flex flex-col gap-2">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs uppercase tracking-wider">Address</span>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempLab.labAddress || ''}
                      onChange={(e) => handleChange('labAddress', e.target.value)}
                      className="w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
                    />
                  ) : (
                    <span className="text-base text-blue-900 dark:text-blue-100 font-medium">{pathlab.labAddress}</span>
                  )}
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs uppercase tracking-wider">Phone</span>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempLab.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
                    />
                  ) : (
                    <span className="text-base text-blue-900 dark:text-blue-100 font-medium">{pathlab.phone}</span>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-semibold shadow text-base"
                    >
                      <Save size={20} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-400 hover:bg-neutral-500 text-white rounded-xl transition font-semibold shadow text-base"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-semibold shadow text-base"
                  >
                    <Pencil size={20} />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-semibold shadow text-base"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <LabFooter />
    </>
  );
};

export default PathlabProfilePage;