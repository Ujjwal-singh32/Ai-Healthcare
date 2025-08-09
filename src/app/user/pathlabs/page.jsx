"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PathlabSection() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pathlabs, setPathlabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch pathlabs from backend
  useEffect(() => {
    const fetchPathlabs = async () => {
      try {
        const res = await axios.get("/api/user/all-pathlab");
        if (res.data.success) {
          setPathlabs(res.data.labs);
        }
      } catch (error) {
        console.error("Error fetching pathlabs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPathlabs();
  }, []);

  const filteredLabs = pathlabs
    .filter(
      (lab) =>
        lab.labName.toLowerCase().includes(search.toLowerCase()) ||
        (lab.tests || []).some((test) =>
          test.testname?.toLowerCase().includes(search.toLowerCase())
        )
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleChange = (id) => {
    router.push(`/user/pathlabs/${id}`);
  };

  return (
    <>
      <UserNavbar />
      <section className="py-12 px-4 bg-purple-50 dark:bg-purple-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800 dark:text-purple-100">
            Book Pathology Tests at Trusted Labs
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <input
              type="text"
              placeholder="Search by lab name or test"
              className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
            >
              Sort by Price: {sortOrder === "asc" ? "Low → High" : "High → Low"}
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading pathlabs...</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {filteredLabs.map((lab) => (
                <div
                  key={lab._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="min-w-[300px] max-w-[300px]">
                      <Image
                        src={lab.profilePic}
                        alt={lab.labName}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-100">
                          {lab.labName}
                        </h3>
                        <p className="text-sm text-green-600 font-medium mt-1">
                          {lab.email}
                        </p>
                        <p className="text-gray-600 dark:text-purple-300 mt-2 text-sm">
                          {lab.phone}
                        </p>
                        <ul className="text-sm mt-2 text-gray-700 dark:text-purple-200 list-disc list-inside">
                          {(lab.tests || []).map((test) => (
                            <li key={test._id}>{test.testname}</li>
                          ))}
                        </ul>
                        <p className="mt-2 font-semibold text-purple-700 dark:text-purple-100">
                          At {lab.labAddress}
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange(lab._id)}
                        className="mt-4 w-fit px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition cursor-pointer"
                      >
                        Book Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredLabs.length === 0 && (
                <p className="text-center text-gray-600 dark:text-purple-300 col-span-2">
                  No labs found for your search.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <UserFooter />
    </>
  );
}
