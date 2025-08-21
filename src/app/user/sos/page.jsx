"use client"; // <-- Add this at the very top
import dynamic from "next/dynamic";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";

const AmbulanceMap = dynamic(() => import("src/components/AmbulanceMap.jsx"), { ssr: false });
export default function SOS() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="mb-4">
                <UserNavbar />
            </header>

            {/* Main content */}
            <main className="flex-1 px-4 py-6">
                <h1 className="text-3xl font-bold mb-6 text-center">🚨 Emergency SOS</h1>

                {/* Ambulance Map */}
                <div className="rounded-lg overflow-hidden shadow-lg">
                    <AmbulanceMap />
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-4">
                <UserFooter />
            </footer>
        </div>
    );
}
