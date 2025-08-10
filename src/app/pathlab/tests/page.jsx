"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import LabFooter from "@/components/LabFooter";
import LabNavbar from "@/components/LabNavbar";
import { usePathlab } from "@/context/pathlabContext";
import { toast } from "react-toastify";
const Page = () => {
  const { pathlabId, setPathlab } = usePathlab();
  // console.log("pathlabId" , pathlabId)
  const [testName, setTestName] = useState("");
  const [price, setPrice] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch lab tests on load
  const fetchTests = async () => {
    try {
      const res = await axios.post('/api/pathlab/test/show', {
        pathlabId,
      });
      if (res.data.success) {
        // console.log("res" , res.data.tests)
        setTests(res.data.tests || []);
      }
    } catch (err) {
      console.error("Fetch tests error:", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Add Test
  const handleAddTest = async () => {
    if (!testName.trim() || !price.trim() || !pathlabId) return;

    setLoading(true);
    try {
      const res = await axios.put("/api/pathlab/test/add", {
        pathlabId,
        testname: testName.trim(),
        price: parseFloat(price),
      });

      if (res.data.success) {
        toast.success("Test Added Successfully")
        setTests(res.data.updatedLab.test);
        setTestName("");
        setPrice("");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Add test error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Test
  const handleDelete = async (testId) => {
    // if (!confirm("Are you sure you want to delete this test?")) return;

    setLoading(true);
    try {
      const res = await axios.put("/api/pathlab/test/delete", {
        pathlabId,
        testId,
      });

      if (res.data.success) {
        toast.success("Test Deleted")
        setTests(res.data.updatedLab.test);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Delete test error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LabNavbar />
      {/* Spacer to ensure content starts after navbar */}
      <div className="h-16 sm:h-20" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 py-12 px-4 sm:px-8 flex flex-col">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-600 dark:text-blue-200 mb-10 tracking-tight font-sans">
          Lab Test Management
        </h1>

        <div className="max-w-3xl mx-auto space-y-8 bg-white/80 dark:bg-blue-950/80 shadow-2xl border border-blue-200 dark:border-blue-800 rounded-3xl p-8 sm:p-12 backdrop-blur-md">
          {/* Add Test Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Enter test name"
              className="flex-1 px-4 py-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-32 px-4 py-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm"
            />
            <button
              onClick={handleAddTest}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition font-semibold shadow text-base"
            >
              <PlusCircle size={20} />
              {loading ? "Adding..." : "Add Test"}
            </button>
          </div>

          {/* Test List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {tests.length === 0 ? (
              <p className="text-blue-400 text-center">No tests added yet.</p>
            ) : (
              tests.map((test) => (
                <div
                  key={test._id}
                  className="flex items-center justify-between bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white px-4 py-3 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800"
                >
                  <span className="font-semibold text-lg">
                    {test.testname} — <span className="text-blue-700 dark:text-blue-300 font-bold">₹{test.price}</span>
                  </span>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete test"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <LabFooter />
    </>
  );
};

export default Page;
