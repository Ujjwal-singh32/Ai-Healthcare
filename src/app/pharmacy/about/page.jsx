"use client";

import PharmaNavbar from "@/components/pharmacyNav";
import PharmaFooter from "@/components/pharmacyFooter";
import { useUser } from "@/context/userContext";

export default function AboutPage() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <PharmaNavbar user={user} />

      <main className="flex-grow px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 border">
          <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
            About Rakshaa
          </h1>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            <strong>Rakshaa</strong> is an AI-powered healthcare platform designed to
            make healthcare accessible, efficient, and connected for everyone.  
            Our mission is to create a seamless digital ecosystem where patients,
            doctors, and pathlabs can interact, share reports, and manage healthcare
            needs from one unified platform.
          </p>

          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Key Features of Rakshaa
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Role-based authentication for Doctors, Patients, and Pathlabs.</li>
            <li>Book and manage appointments online.</li>
            <li>Upload and share lab reports between patients and doctors.</li>
            <li>Receive and download doctor-prescribed medications as PDFs.</li>
            <li>AI health assistant “Saksham” for instant medical guidance.</li>
            <li>Secure data storage with end-to-end encryption.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Rakshaa E-Pharmacy
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Our integrated <strong>E-Pharmacy</strong> service allows patients to order
            medicines online with doorstep delivery. Users can browse medicines,
            add them to the cart, and proceed with a secure checkout process.  
            With Rakshaa E-Pharmacy, we ensure:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Fast and reliable medicine delivery across India.</li>
            <li>Verified and genuine medicines from trusted suppliers.</li>
            <li>Easy prescription upload for prescription-based medicines.</li>
            <li>Order tracking and real-time updates.</li>
            <li>Dedicated customer support for medicine-related queries.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Our Vision
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Rakshaa aims to be more than just a healthcare platform — we envision
            a connected healthcare network where technology bridges the gap
            between patients and quality healthcare, no matter where they are.
          </p>

          <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded-lg">
            <p className="text-blue-700 font-medium">
              Together, we can build a healthier, safer, and more connected world.  
              <br />– The Rakshaa Team
            </p>
          </div>
        </div>
      </main>

      <PharmaFooter />
    </div>
  );
}
