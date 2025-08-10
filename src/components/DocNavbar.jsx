"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useDoctor } from "@/context/doctorContext";

export default function DocNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { doctor } = useDoctor();

  return (
    <header className="w-full bg-white/90 dark:bg-[#181c2a]/90 backdrop-blur-2xl border-b-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30 shadow-2xl fixed top-0 left-0 z-50 rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/doctor/home"
            className="text-2xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] tracking-tight flex items-center gap-2 drop-shadow-sm hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] transition-colors"
          >
            <span role="img" aria-label="stethoscope">👨‍⚕️</span> Rakshaa
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-[#2563eb] dark:text-[#60a5fa] text-[18px] font-semibold">
          <NavLink href="/doctor/home" label="Home" />
          <NavLink href="/doctor/dashboard" label="Dashboard" />
          <NavLink href="/doctor/appointments" label="Appointments" />
          <NavLink href="/doctor/ml" label="Disease Prediction" />
          <NavLink href="/doctor/reports" label="Reports" />
        </nav>

        {/* Right: Profile + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-[#2563eb] dark:text-[#60a5fa] cursor-pointer hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7" />
          </button>

          <Link href="/doctor/profile">
            <Avatar className="w-10 h-10 border-2 border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] transition-all shadow-md">
              {doctor?.profilePic ? (
                <AvatarImage src={doctor.profilePic} alt="Doctor Profile" />
              ) : (
                <AvatarImage src="/default-avatar.png" alt="Default Avatar" />
              )}
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-4 pb-4 flex flex-col gap-3 text-[#2563eb] dark:text-[#60a5fa] text-[16px] font-semibold bg-white/95 dark:bg-[#181c2a]/95 rounded-2xl shadow-xl border border-[#2563eb]/20 dark:border-[#60a5fa]/20">
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            div {
              animation: fadeIn 0.3s ease forwards;
            }
          `}</style>
          <NavLink href="/doctor/home" label="Home" />
          <NavLink href="/doctor/dashboard" label="Dashboard" />
          <NavLink href="/doctor/appointments" label="Appointments" />
          <NavLink href="/doctor/ml" label="Disease Prediction" />
          <NavLink href="/doctor/reports" label="Reports" />
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
