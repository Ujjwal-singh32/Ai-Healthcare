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
          //console.log("printing all data of labs", res.data.labs)
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
        (lab.test || []).some((t) =>
          t.testname?.toLowerCase().includes(search.toLowerCase())
        )
    )
    .sort((a, b) => {
      const minPriceA = Math.min(...(a.test || []).map(t => t.price || 0));
      const minPriceB = Math.min(...(b.test || []).map(t => t.price || 0));

      return sortOrder === "asc"
        ? minPriceA - minPriceB
        : minPriceB - minPriceA;
    });


  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleChange = (id) => {
    router.push(`/user/pathlabs/${id}`);
  };

  return (
    <>
      <UserNavbar />
      <section className="py-8 px-3 min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] relative pt-24 sm:py-12 sm:px-4 sm:pt-28">
        {/* Decorative SVG background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            className="opacity-10 dark:opacity-10"
          >
            <defs>
              <radialGradient id="pathlab-bg" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#pathlab-bg)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#2563eb] dark:text-[#60a5fa] tracking-tight px-2">
            Book Pathology Tests at Trusted Labs
          </h2>

          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search by lab name or test"
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-[#c7d2fe] dark:border-[#60a5fa] bg-white/80 dark:bg-[#f3f4f6]/80 text-[#2563eb] dark:text-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] font-medium shadow-sm transition text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={toggleSortOrder}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-full font-semibold shadow-md transition cursor-pointer border border-[#2563eb] dark:border-[#60a5fa] text-sm sm:text-base whitespace-nowrap"
            >
              Sort by Price: {sortOrder === "asc" ? "Low → High" : "High → Low"}
            </button>
          </div>

          {loading ? (
            <p className="text-center text-[#2563eb] dark:text-[#60a5fa] font-medium text-sm sm:text-base">
              Loading pathlabs...
            </p>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredLabs.map((lab) => (
                <div
                  key={lab._id}
                  className="bg-white dark:bg-[#232946] backdrop-blur-2xl rounded-2xl sm:rounded-[24px] border-2 border-[#2563eb] shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#60a5fa] w-full max-w-none mx-auto"
                  style={{
                    fontFamily: "Inter, Poppins, sans-serif",
                    boxShadow: "0 4px 32px 0 rgba(37,99,235,0.10)",
                  }}
                >
                  <div className="p-4 sm:p-6">
                    {/* Header with image and title */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Pathlab image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1a1a1a] rounded-xl flex items-center justify-center overflow-hidden border-2 border-[#232946]/10">
                          <Image
                            src={lab.profilePic}
                            alt={lab.labName}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Title and verified badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#2563eb] leading-tight tracking-tight break-words">
                            {lab.labName && lab.labName.toUpperCase()}
                          </h3>
                          <span className="flex-shrink-0 h-5 px-2 sm:h-6 sm:px-3 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                            VERIFIED
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-[#4a5568] dark:text-[#cbd5e1] text-sm sm:text-base">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 opacity-70 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <span className="break-all">{lab.email}</span>
                      </div>
                      <div className="flex items-center text-[#4a5568] dark:text-[#cbd5e1] text-sm sm:text-base">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 opacity-70 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <span>{lab.phone}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 mb-4">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb] flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span className="text-[#2563eb] font-semibold text-sm sm:text-base lg:text-lg break-words">
                        {lab.labAddress}
                      </span>
                    </div>

                    {/* Book Test Button */}
                    <button
                      onClick={() => handleChange(lab._id)}
                      className="w-full flex items-center justify-center gap-2 bg-[#2563eb] text-white border-none py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-[16px] font-bold text-base sm:text-lg lg:text-xl shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
                      </svg>
                      Book Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <UserFooter />
    </>
  );
}
