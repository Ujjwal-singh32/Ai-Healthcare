"use client";
import Image from "next/image";
import Link from "next/link";
import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";

export default function MedicinesPage() {
  const medicines = [
    { id: 1, name: "Paracetamol", desc: "Pain reliever & fever reducer", price: "₹20", img: "/medis.jpg" },
    { id: 2, name: "Amoxicillin", desc: "Antibiotic for infections", price: "₹50", img: "/medis.jpg" },
    { id: 3, name: "Cetirizine", desc: "Allergy relief", price: "₹15", img: "/medis.jpg" },
    { id: 4, name: "Vitamin C", desc: "Boost immunity", price: "₹100", img: "/medis.jpg" },
    { id: 5, name: "Ibuprofen", desc: "Pain reliever & anti-inflammatory", price: "₹30", img: "/medis.jpg" },
    { id: 6, name: "Azithromycin", desc: "Antibiotic for bacterial infections", price: "₹60", img: "/medis.jpg" },
    { id: 7, name: "Dolo 650", desc: "Fever and mild pain relief", price: "₹25", img: "/medis.jpg" },
    { id: 8, name: "ORS Sachets", desc: "Oral rehydration salts", price: "₹12", img: "/medis.jpg" },
    { id: 9, name: "Calcium Tablets", desc: "Bone health supplement", price: "₹80", img: "/medis.jpg" },
    { id: 10, name: "Zinc Capsules", desc: "Boost immunity", price: "₹45", img: "/medis.jpg" },
    { id: 11, name: "Cetirizine", desc: "Allergy relief", price: "₹15", img: "/medis.jpg" },
    { id: 12, name: "Vitamin C", desc: "Boost immunity", price: "₹100", img: "/medis.jpg" },
    { id: 13, name: "Ibuprofen", desc: "Pain reliever & anti-inflammatory", price: "₹30", img: "/medis.jpg" },
    { id: 14, name: "Azithromycin", desc: "Antibiotic for bacterial infections", price: "₹60", img: "/medis.jpg" },
    { id: 15, name: "Dolo 650", desc: "Fever and mild pain relief", price: "₹25", img: "/medis.jpg" },
    { id: 16, name: "ORS Sachets", desc: "Oral rehydration salts", price: "₹12", img: "/medis.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-50 text-gray-900">
      <PharmaNavbar />

      <section className="px-8 py-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800">Medicines</h1>
        <p className="text-lg text-blue-700 mt-2">Find the best medicines for your health needs</p>
      </section>

      <section className="px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {medicines.map((med) => (
            <Link key={med.id} href={`/pharmacy/medicines/${med.id}`} passHref>
              <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 hover:shadow-xl transition flex flex-col cursor-pointer">
                <div className="w-full h-40 bg-blue-50 flex justify-center items-center p-4">
                  <Image src={med.img} alt={med.name} width={250} height={150} className="object-contain" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-blue-700 truncate">{med.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{med.desc}</p>
                  <p className="text-blue-600 font-bold mb-3">{med.price}</p>
                  <div className="flex justify-between mt-auto">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">Details</span>
                    <span className="border border-blue-500 text-blue-600 px-4 py-1 rounded-lg text-sm">Add to Cart</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <PharmaFooter/>
    </div>
  );
}
