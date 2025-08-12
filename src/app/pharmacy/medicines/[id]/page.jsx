"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PharmaNavbar from "@/components/pharmacyNav";
import Image from "next/image";
import Link from "next/link";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";

export default function MedicineDetails() {
  const { id } = useParams();
  const { user } = useUser();

  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // NEW: track main image

  useEffect(() => {
    if (!id) return;

    const fetchMedicineDetails = async () => {
      try {
        // Fetch single medicine by ID
        const res = await fetch(`/api/medicines/${id}`);
        const data = await res.json();
        setMedicine(data);

        // Default main image
        setSelectedImage(data?.image?.[0] || "/medis.jpg");

        // Fetch related medicines
        if (data?.category) {
          const relatedRes = await fetch(`/api/medicines?category=${data.category}`);
          const relatedData = await relatedRes.json();

          const filtered = relatedData.filter(m => m._id !== id).slice(0, 8);
          setRelated(filtered);
        }
      } catch (error) {
        console.error("Error fetching medicine details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Loading...</div>;
  }

  if (!medicine) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Medicine not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <PharmaNavbar user={user} />

      {/* Main Product Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 mt-8 flex flex-col md:flex-row gap-10 bg-white rounded-lg shadow-lg">
        
        {/* Left: Product Image */}
        <div className="flex flex-col items-center gap-4">
          {/* Main Image */}
          <Image 
            src={selectedImage} 
            alt={medicine.name} 
            width={350} 
            height={350} 
            className="rounded-lg object-contain"
          />

          {/* Thumbnails */}
          <div className="flex gap-2 flex-wrap justify-center">
            {medicine.image?.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                width={60}
                height={60}
                className={`border rounded-lg object-contain cursor-pointer transition ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-800">{medicine.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{medicine.manufacturer || "Rakshaa Pharmaceuticals"}</p>

          {medicine.description?.map((desc, idx) => (
            <p key={idx} className="mt-4 text-gray-700">{desc}</p>
          ))}

          <div className="mt-6 bg-blue-50 p-4 rounded-lg w-fit">
            <p className="text-2xl font-semibold text-blue-600">₹{medicine.price}</p>
            <p className="text-green-600 text-sm">Inclusive of all taxes</p>
          </div>

          <button
            className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            onClick={async () => {
              if (!user?._id) return alert("Please log in to add to cart");
              try {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: user._id,
                    medicineId: medicine._id,
                    quantity: 1
                  })
                });
                alert("Added to cart");
              } catch (error) {
                console.error("Add to cart failed", error);
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Related Medicines</h2>
          <Link href="/pharmacy/medicines" className="text-blue-600 hover:underline">
            More →
          </Link>
        </div>

        {related.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((med) => (
              <div key={med._id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 hover:shadow-xl transition flex flex-col">
                <div className="w-full h-40 bg-blue-50 flex justify-center items-center p-4">
                  <Image src={med.image?.[0] || "/medis.jpg"} alt={med.name} width={200} height={150} className="object-contain" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-blue-700 truncate">{med.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{med.category || "No category"}</p>
                  <p className="text-blue-600 font-bold mb-3">₹{med.price}</p>
                  <Link
                    href={`/pharmacy/medicines/${med._id}`}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm text-center hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No related medicines found.</p>
        )}
      </div>

      <PharmaFooter />
    </div>
  );
}
