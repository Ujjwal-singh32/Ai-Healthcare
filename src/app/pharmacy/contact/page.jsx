"use client";

import { useState } from "react";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";

export default function PharmacyContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });
  const [errors, setErrors] = useState({});

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
      alert("Your issue has been submitted. We’ll get back to you soon!");
      setFormData({ name: "", email: "", issue: "" });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <PharmaNavbar />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 space-y-6 border">
          <h1 className="text-3xl font-bold text-blue-700 text-center mb-4">
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-lg font-medium text-blue-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-medium text-blue-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Issue */}
            <div>
              <label className="block text-lg font-medium text-blue-700 mb-2">
                Issue
              </label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                rows="5"
                className={`w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 ${
                  errors.issue ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.issue && (
                <p className="text-red-500 text-sm mt-1">{errors.issue}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-medium hover:bg-blue-700"
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
