"use client";

import React, { useState, useEffect } from "react";
import { LogOut, Pencil, Save, X } from "lucide-react";
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

      // If there's a new file selected
      if (tempLab.profilePic instanceof File) {
        formData.append("profilePic", tempLab.profilePic);
      }

      const res = await axios.put("/api/pathlab/update", formData, {
        headers: {
          Authorization: `Bearer ${pttoken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("profile updated")
        setPathlab(res.data.updatedLab);
        setEditMode(false);
      } else {
        alert("Failed to update pathlab profile.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error updating profile.");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("pttoken");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700 dark:text-purple-200 text-xl">
        Loading profile...
      </div>
    );
  }

  if (!pathlab) {
    return <div className="p-10 text-center">No pathlab data found.</div>;
  }

  return (
    <>
      <LabNavbar />
      <div className="min-h-[80vh] bg-purple-50 dark:bg-purple-950 p-6 sm:p-10 flex items-center justify-center">
        <div className="bg-white dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={tempLab.profilePic || "https://via.placeholder.com/150"}
              alt="Lab"
              className="w-32 h-32 rounded-full border-4 border-purple-300 dark:border-purple-700 object-cover shadow-md"
            />
            <div className="text-center sm:text-left space-y-2 w-full">
              {["labName", "email", "labAddress", "phone"].map((field) => (
                <div key={field}>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 capitalize">
                    {field === "labName"
                      ? "Name"
                      : field === "labAddress"
                        ? "Address"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    :
                  </p>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempLab[field] || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full mt-1 p-2 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      {pathlab[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                >
                  <Save size={18} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditProfile}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition font-medium"
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
      <LabFooter />
    </>
  );
};

export default PathlabProfilePage;