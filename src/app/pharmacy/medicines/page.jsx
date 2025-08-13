"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";
import { toast } from "react-toastify";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  // Fetch medicines
  useEffect(() => {
    async function fetchMedicines() {
      setLoading(true);
      try {
        const apiUrl = search
          ? `/api/medicines/search?search=${encodeURIComponent(search)}`
          : `/api/medicines`;

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch medicines");

        const data = await res.json();
        setMedicines(data);
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, [search]);

  // Add to cart
  async function handleAddToCart(medicineId) {
    try {
      if (!user?._id) {
        toast.error("Please log in to add items to cart");
        return;
      }

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          medicineId,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      toast.success("✅ Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("❌ Failed to add to cart");
    }
  }

  // Loader
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-50 text-gray-900">
      <PharmaNavbar user={user} />

      <section className="px-8 py-8 text-center">
        {search ? (
          <>
            <h1 className="text-3xl font-bold text-blue-800">
              Search Results for "{search}"
            </h1>
            <p className="text-lg text-blue-700 mt-2">
              {medicines.length} medicine(s) found
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-blue-800">Medicines</h1>
            <p className="text-lg text-blue-700 mt-2">
              Find the best medicines for your health needs
            </p>
          </>
        )}
      </section>

      <section className="px-8 pb-12">
        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {medicines.map((med) => (
              <div
                key={med._id}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-blue-100 hover:shadow-2xl hover:scale-[1.02] transition transform flex flex-col cursor-pointer"
                onClick={() => router.push(`/pharmacy/medicines/${med._id}`)}
              >
                {/* Image container */}
                <div className="w-full h-48 bg-blue-50 flex justify-center items-center p-4 overflow-hidden">
                  <Image
                    src={med.image?.[0] || "/medis.jpg"}
                    alt={med.name}
                    width={250}
                    height={180}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-blue-700 truncate">
                    {med.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {med.category || "No category"}
                  </p>
                  <p className="text-blue-600 font-bold mb-4 text-lg">
                    ₹{med.price}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/pharmacy/medicines/${med._id}`);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(med._id);
                      }}
                      className="flex-1 border border-blue-500 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No medicines found.</p>
        )}
      </section>

      <PharmaFooter />
    </div>
  );
}
