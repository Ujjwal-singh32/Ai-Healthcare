"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/userContext";
import {
  Ambulance,
} from "lucide-react";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userData = useUser();
  const user = userData.user;

  return (
    <header className="w-full bg-white/90 dark:bg-[#181c2a]/90 backdrop-blur-2xl border-b-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30 shadow-2xl fixed top-0 left-0 z-50 rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/user/home"
            className="text-2xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] tracking-tight flex items-center gap-2 drop-shadow-sm hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] transition-colors"
          >
            <span role="img" aria-label="stethoscope">🩺</span> Rakshaa
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex gap-6 text-[#2563eb] dark:text-[#60a5fa] text-[18px] font-semibold">
          <NavLink href="/user/doctor" label="Doctors" />
          <NavLink href="/user/pathlabs" label="Path Labs" />
          <NavLink href="/user/ai" label="Ask Sakhsam" />
          <NavLink href="/user/ml" label="Predict Disease" />
          <NavLink href="/user/reports" label="Appointments" />
          <NavLink href="/user/ambulance" label="Ambulance" />
          <NavLink href="/pharmacy/home" label="Pharmacy" />
        </nav>

        {/* Right: Avatar & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-[#2563eb] dark:text-[#60a5fa] cursor-pointer hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7" />
          </button>

          <div className="fixed z-50 bottom-6 right-6 flex items-end justify-end pointer-events-none select-none">
            <Link
              href="/user/sos"
              className="relative pointer-events-auto group"
              aria-label="Emergency SOS"
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-16 h-16 flex flex-col items-center justify-center rounded-full shadow-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300">
                <Ambulance className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">SOS</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-4 pb-4 flex flex-col gap-3 text-[#2563eb] dark:text-[#60a5fa] text-[16px] font-semibold bg-white/95 dark:bg-[#181c2a]/95 rounded-2xl shadow-xl border border-[#2563eb]/20 dark:border-[#60a5fa]/20 animate-fade-in">
          <NavLink href="/user/doctor" label="Doctors" />
          <NavLink href="/user/pathlabs" label="Path Labs" />
          <NavLink href="/user/ai" label="Ask Sakhsam" />
          <NavLink href="/user/ml" label="Predict Disease" />
          <NavLink href="/user/reports" label="Appointments" />
          <NavLink href="/user/ambulance" label="Ambulance" />
          <NavLink href="/pharmacy/home" label="Pharmacy" />
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] hover:bg-[#2563eb]/10 dark:hover:bg-[#60a5fa]/10 transition-colors px-2 py-1 rounded-lg duration-200"
    >
      {label}
    </Link>
  );
}
