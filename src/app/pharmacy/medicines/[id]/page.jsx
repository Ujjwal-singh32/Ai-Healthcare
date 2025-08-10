"use client";
import { useParams } from "next/navigation";
import PharmaNavbar from "@/components/pharmacyNav";
import Image from "next/image";
import Link from "next/link";
import PharmaFooter from "@/components/pharmacyFooter";

export default function MedicineDetails() {
  const { id } = useParams();

  // Dummy data
  const medicines = [
    { id: 1, name: "Paracetamol", desc: "Pain reliever & fever reducer", price: "₹20", img: "/medis.jpg" },
    { id: 2, name: "Amoxicillin", desc: "Antibiotic for infections", price: "₹50", img: "/medis.jpg" },
    { id: 3, name: "Cetirizine", desc: "Allergy relief", price: "₹15", img: "/medis.jpg" },
    { id: 4, name: "Vitamin C", desc: "Boost immunity", price: "₹100", img: "/medis.jpg" },
    { id: 5, name: "Ibuprofen", desc: "Pain reliever & anti-inflammatory", price: "₹30", img: "/medis.jpg" },
  ];

  const medicine = medicines.find((m) => m.id === parseInt(id));
  if (!medicine) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Medicine not found</div>;
  }

  // Related products (excluding current)
  const related = medicines.filter((m) => m.id !== parseInt(id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <PharmaNavbar />

      {/* Main Product Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 mt-8 flex flex-col md:flex-row gap-10 bg-white rounded-lg shadow-lg">

        
        {/* Left: Product Image */}
        <div className="flex flex-col items-center gap-4">
          <Image src={medicine.img} alt={medicine.name} width={350} height={350} className="rounded-lg object-contain" />
          {/* Small Thumbnails (can be replaced with multiple images later) */}
          <div className="flex gap-2">
            <Image src={medicine.img} alt="thumb" width={60} height={60} className="border rounded-lg" />
            <Image src={medicine.img} alt="thumb" width={60} height={60} className="border rounded-lg" />
            <Image src={medicine.img} alt="thumb" width={60} height={60} className="border rounded-lg" />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-800">{medicine.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Rakshaa Pharmaceuticals</p>
          <p className="mt-4 text-gray-700">{medicine.desc}</p>

          {/* Price Section */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg w-fit">
            <p className="text-2xl font-semibold text-blue-600">{medicine.price}</p>
            <p className="text-green-600 text-sm">Inclusive of all taxes</p>
          </div>

          {/* Add to Cart Button */}
          <button className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Related Medicines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((med) => (
            <div key={med.id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 hover:shadow-xl transition flex flex-col">
              <div className="w-full h-40 bg-blue-50 flex justify-center items-center p-4">
                <Image src={med.img} alt={med.name} width={200} height={150} className="object-contain" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-blue-700 truncate">{med.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{med.desc}</p>
                <p className="text-blue-600 font-bold mb-3">{med.price}</p>
                <Link
                  href={`/pharmacy/medicines/${med.id}`}
                  className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm text-center hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
        {/* Footer */}
        <PharmaFooter />
    </div>
  );
}
