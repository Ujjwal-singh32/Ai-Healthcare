"use client";
import Image from "next/image";
import Link from "next/link";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";

export default function HomePage() {
  const medicines = [
    { id: 1, name: "Paracetamol", desc: "Pain reliever & fever reducer", price: "₹20", img: "/medis.jpg" },
    { id: 2, name: "Amoxicillin", desc: "Antibiotic for infections", price: "₹50", img: "/medis.jpg" },
    { id: 3, name: "Cetirizine", desc: "Allergy relief", price: "₹15", img: "/medis.jpg" },
    { id: 4, name: "Vitamin C", desc: "Boost immunity", price: "₹100", img: "/medis.jpg" },
    { id: 5, name: "Ibuprofen", desc: "Pain reliever & anti-inflammatory", price: "₹30", img: "/medis.jpg" },
    { id: 6, name: "Azithromycin", desc: "Antibiotic for bacterial infections", price: "₹60", img: "/medis.jpg" },
    { id: 7, name: "Dolo 650", desc: "Fever and mild pain relief", price: "₹25", img: "/medis.jpg" },
    { id: 8, name: "ORS Sachets", desc: "Oral rehydration salts", price: "₹12", img: "/medis.jpg" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-white text-gray-900">
      <PharmaNavbar />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-[60vh] px-8">
        {/* Left Text */}
        <div className="flex-1 md:pr-12 text-right">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-blue-800">
            Your medication delivered
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Say goodbye to all your healthcare worries with us
          </p>
        </div>

        {/* Right Image */}
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
      {/* General Medicine Section */}
      <section className="px-8 py-12">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">General Medicines</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {medicines.map((med) => (
            <Link
              key={med.id}
              href={`/pharmacy/medicines/${med.id}`}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 hover:shadow-xl transition flex flex-col cursor-pointer"
            >
              {/* Product Image */}
              <div className="w-full h-40 bg-gray-50 flex justify-center items-center p-4">
                <Image
                  src={med.img}
                  alt={med.name}
                  width={250}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-blue-700 truncate">{med.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{med.desc}</p>
                <p className="text-blue-600 font-bold mb-3">{med.price}</p>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">
                    Details
                  </span>
                  <span className="border border-blue-500 text-blue-600 px-4 py-1 rounded-lg text-sm">
                    Add to Cart
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More Medicines Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/pharmacy/medicines"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            More Medicines →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <PharmaFooter />
    </div>
  );
}
