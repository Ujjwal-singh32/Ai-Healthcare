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
      <div className="min-h-screen bg-purple-50 dark:bg-purple-950 p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-center text-purple-900 dark:text-purple-100 mb-10">
          🧪 Lab Test Management
        </h1>

        <div className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-purple-900 shadow-xl border border-purple-200 dark:border-purple-700 rounded-2xl p-8">
          {/* Add Test Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Enter test name"
              className="flex-1 px-4 py-2 rounded-lg border border-purple-300 dark:border-purple-600 bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-28 px-4 py-2 rounded-lg border border-purple-300 dark:border-purple-600 bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddTest}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              <PlusCircle size={18} />
              {loading ? "Adding..." : "Add Test"}
            </button>
          </div>

          {/* Test List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {tests.length === 0 ? (
              <p className="text-gray-500 text-center">No tests added yet.</p>
            ) : (
              tests.map((test) => (
                <div
                  key={test._id}
                  className="flex items-center justify-between bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white px-4 py-2 rounded-lg shadow-sm"
                >
                  <span className="font-medium">
                    {test.testname} — ₹{test.price}
                  </span>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete test"
                  >
                    <Trash2 size={18} />
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
