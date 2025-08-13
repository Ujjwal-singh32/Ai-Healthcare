"use client";

import { useState } from "react";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";
import { toast } from "react-toastify";

export default function PharmacyContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });
  const [errors, setErrors] = useState({});
  const { user } = useUser();

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.issue.trim()) {
      newErrors.issue = "Issue is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", formData);
      toast.success("Your issue has been submitted. We’ll get back to you soon!");
      setFormData({ name: "", email: "", issue: "" });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#181c2a] flex flex-col">
      <PharmaNavbar user={user} />

      {/* Add top padding to avoid content hidden under navbar */}
      <main className="flex-grow flex justify-center items-center px-4 pt-32 pb-10 md:pt-36 md:pb-16">
        <div className="w-full max-w-2xl bg-white/95 dark:bg-[#181c2a]/95 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#2563eb]/20 dark:border-[#60a5fa]/20">
          <h1 className="text-3xl md:text-4xl font-black text-[#2563eb] dark:text-[#60a5fa] text-center mb-8 drop-shadow-md tracking-tight">
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label className="block text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 text-lg bg-white dark:bg-[#181c2a] text-[#2563eb] dark:text-[#60a5fa] focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-[#2563eb]/40 dark:border-[#60a5fa]/40 focus:ring-[#2563eb] dark:focus:ring-[#60a5fa]"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 text-lg bg-white dark:bg-[#181c2a] text-[#2563eb] dark:text-[#60a5fa] focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-[#2563eb]/40 dark:border-[#60a5fa]/40 focus:ring-[#2563eb] dark:focus:ring-[#60a5fa]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Issue */}
            <div>
              <label className="block text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-2">
                Issue
              </label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                rows="5"
                className={`w-full border rounded-lg p-3 text-lg bg-white dark:bg-[#181c2a] text-[#2563eb] dark:text-[#60a5fa] focus:outline-none focus:ring-2 ${
                  errors.issue ? "border-red-500 focus:ring-red-500" : "border-[#2563eb]/40 dark:border-[#60a5fa]/40 focus:ring-[#2563eb] dark:focus:ring-[#60a5fa]"
                }`}
              />
              {errors.issue && (
                <p className="text-red-500 text-sm mt-1">{errors.issue}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2563eb] dark:bg-[#60a5fa] text-white py-4 rounded-lg text-lg font-bold hover:bg-[#1d4ed8] dark:hover:bg-[#3b82f6] transition-colors shadow-md"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <PharmaFooter />
    </div>
  );
}
