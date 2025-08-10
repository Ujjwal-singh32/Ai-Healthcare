
"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePathlab } from "@/context/pathlabContext";


export default function Navbar() {
  const Lab = usePathlab();
  const pathlab = Lab.pathlab;
  const loading = Lab.loading;
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <header className="w-full bg-white/90 dark:bg-[#181c2a]/90 backdrop-blur-2xl border-b-2 border-[#2563eb]/30 dark:border-[#60a5fa]/30 shadow-2xl fixed top-0 left-0 z-50 rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/pathlab/home"
            className="text-2xl font-black text-[#2563eb] dark:text-[#60a5fa] tracking-tight flex items-center gap-2 drop-shadow-sm hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] transition-colors font-sans"
            style={{ fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif', letterSpacing: '0.01em' }}
          >
            Rakshaa Labs
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex gap-6 text-[#2563eb] dark:text-[#60a5fa] text-[18px] font-semibold">
          <NavLink href="/pathlab/pending-reports" label="Pending Reports" />
          <NavLink href="/pathlab/completed-reports" label="Submitted Reports" />
          <NavLink href="/pathlab/tests" label="Test Offered" />
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

          <Link href="/pathlab/profile">
            <Avatar className="w-10 h-10 border-2 border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] transition-all shadow-md">
              {pathlab?.profilePic ? (
                <AvatarImage src={pathlab.profilePic} alt="Profile" />
              ) : (
                <AvatarImage src="/default-avatar.png" alt="Default Avatar" />
              )}
              <AvatarFallback>LB</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#181c2a]/95 border-b-2 border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-xl rounded-b-2xl px-6 py-6 flex flex-col gap-4 text-[#2563eb] dark:text-[#60a5fa] text-lg font-semibold animate-fade-in-down">
          <NavLink href="/pathlab/pending-reports" label="Pending Reports" />
          <NavLink href="/pathlab/completed-reports" label="Submitted Reports" />
          <NavLink href="/pathlab/tests" label="Test Offered" />
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="transition-colors hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] px-2 py-1 rounded"
    >
      {label}
    </Link>
  );
}