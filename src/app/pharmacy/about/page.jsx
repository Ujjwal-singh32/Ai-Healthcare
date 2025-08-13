"use client";

import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";

export default function AboutPage() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-white dark:bg-[#181c2a] flex flex-col">
      <PharmaNavbar user={user} />

      {/* Add top padding to avoid content hidden under navbar */}
      <main className="flex-grow px-4  pb-10 md:pt-10 md:pb-16">
        <div className="max-w-5xl mx-auto bg-white/95 dark:bg-[#181c2a]/95 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#2563eb]/20 dark:border-[#60a5fa]/20">
          <h1 className="text-4xl font-black text-[#2563eb] dark:text-[#60a5fa] mb-8 text-center drop-shadow-md tracking-tight">
            About Rakshaa
          </h1>

          <p className="text-lg text-[#2563eb]/90 dark:text-[#60a5fa]/90 mb-8 leading-relaxed font-medium">
            <strong>Rakshaa</strong> is an AI-powered healthcare platform designed to make healthcare accessible, efficient, and connected for everyone. Our mission is to create a seamless digital ecosystem where patients, doctors, and pathlabs can interact, share reports, and manage healthcare needs from one unified platform.
          </p>

          <h2 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] mb-4 mt-8">Key Features of Rakshaa</h2>
          <ul className="list-disc list-inside text-[#2563eb]/80 dark:text-[#60a5fa]/80 mb-8 space-y-2">
            <li>Role-based authentication for Doctors, Patients, and Pathlabs.</li>
            <li>Book and manage appointments online.</li>
            <li>Upload and share lab reports between patients and doctors.</li>
            <li>Receive and download doctor-prescribed medications as PDFs.</li>
            <li>AI health assistant “Saksham” for instant medical guidance.</li>
            <li>Secure data storage with end-to-end encryption.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] mb-4 mt-8">Rakshaa E-Pharmacy</h2>
          <p className="text-lg text-[#2563eb]/90 dark:text-[#60a5fa]/90 mb-8 leading-relaxed font-medium">
            Our integrated <strong>E-Pharmacy</strong> service allows patients to order medicines online with doorstep delivery. Users can browse medicines, add them to the cart, and proceed with a secure checkout process. With Rakshaa E-Pharmacy, we ensure:
          </p>
          <ul className="list-disc list-inside text-[#2563eb]/80 dark:text-[#60a5fa]/80 mb-8 space-y-2">
            <li>Fast and reliable medicine delivery across India.</li>
            <li>Verified and genuine medicines from trusted suppliers.</li>
            <li>Easy prescription upload for prescription-based medicines.</li>
            <li>Order tracking and real-time updates.</li>
            <li>Dedicated customer support for medicine-related queries.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] mb-4 mt-8">Our Vision</h2>
          <p className="text-lg text-[#2563eb]/90 dark:text-[#60a5fa]/90 mb-8 leading-relaxed font-medium">
            Rakshaa aims to be more than just a healthcare platform — we envision a connected healthcare network where technology bridges the gap between patients and quality healthcare, no matter where they are.
          </p>

          <div className="bg-[#2563eb]/10 dark:bg-[#60a5fa]/10 border-l-4 border-[#2563eb] dark:border-[#60a5fa] p-6 rounded-2xl">
            <p className="text-[#2563eb] dark:text-[#60a5fa] font-semibold text-lg">
              Together, we can build a healthier, safer, and more connected world.<br />– The Rakshaa Team
            </p>
          </div>
        </div>
      </main>

      <PharmaFooter />
    </div>
  );
}
