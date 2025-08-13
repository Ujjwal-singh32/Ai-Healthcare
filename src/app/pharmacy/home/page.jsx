"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";

export default function HomePage() {
  const [medicines, setMedicines] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Show 20 initially
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const currentUserId = user?._id;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("/api/medicines");
        const data = await res.json();
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleAddToCart = async (medicineId) => {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          medicineId,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Added to cart!");
      } else {
        alert(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-blue-50 dark:bg-[#181c2a] min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2563eb] border-l-[#60a5fa] rounded-full animate-spin bg-gradient-to-r from-[#93c5fd] via-[#2563eb] to-[#60a5fa] shadow-lg"></div>
          <p className="text-[#2563eb] dark:text-[#60a5fa] text-xl font-semibold animate-pulse">
            Loading Medicines...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-white text-gray-900">
      <PharmaNavbar user={user} />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-[60vh] px-8">
        <div className="flex-1 md:pr-12 text-right">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-blue-800">
            Your medication delivered
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Say goodbye to all your healthcare worries with us
          </p>
        </div>

        <div className="flex-1 md:pl-12 flex justify-center">
          <Image
            src="/med.png"
            alt="Pharmacy Background"
            width={400}
            height={400}
            className="object-contain"
            priority
          />
        </div>
      </main>

      {/* General Medicine Section */}
      <section className="px-8 py-12">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          General Medicines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {medicines.slice(0, visibleCount).map((med) => (
            <div
              key={med._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 hover:shadow-xl transition flex flex-col"
            >
              {/* Product Image */}
              <Link
                href={`/pharmacy/medicines/${med._id}`}
                className="w-full h-40 bg-gray-50 flex justify-center items-center p-4 overflow-hidden"
              >
                <Image
                  src={med.image?.[0] || "/medis.jpg"}
                  alt={med.name}
                  width={250}
                  height={150}
                  className="object-contain max-h-36"
                />
              </Link>

              {/* Product Details */}
              <div className="p-4 flex flex-col flex-1">
                <Link href={`/pharmacy/medicines/${med._id}`}>
                  <h3 className="text-lg font-semibold text-blue-700 truncate">
                    {med.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{med.category}</p>
                <p className="text-blue-600 font-bold mb-3">₹{med.price}</p>

                {/* Buttons */}
                <div className="flex justify-between mt-auto">
                  <Link
                    href={`/pharmacy/medicines/${med._id}`}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(med._id)}
                    className="border border-blue-500 text-blue-600 px-4 py-1 rounded-lg text-sm hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < medicines.length && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 20)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Show More 
            </button>
          </div>
        )}
      </section>

      <PharmaFooter />
    </div>
  );
}
