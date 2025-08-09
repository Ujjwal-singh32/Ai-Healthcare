"use client";

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
  return (
    <header className="w-full bg-purple-100 dark:bg-purple-900 shadow-sm top-0 sticky z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/pathlab/home"
            className="text-xl font-bold text-purple-700 dark:text-purple-200"
          >
            🩺 Rakshaa
          </Link>
        </div>

        {/* Center: Links */}
        <nav className="hidden md:flex gap-6 ">
          <NavLink href="/pathlab/pending-reports" label="Pending Report" />
          <NavLink href="/pathlab/completed-reports" label="Submitted Reports" />
          <NavLink href="/pathlab/tests" label="Test Offered" />
        </nav>

        {/* Right: Profile + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <Link href="/pathlab/profile">
            <Avatar className="w-9 h-9 border-2 border-purple-400 hover:border-purple-600 transition">
              {pathlab?.profilePic ? (
                <AvatarImage src={pathlab.profilePic} alt="Profile" />
              ) : (
                <AvatarImage src="/default-avatar.png" alt="Default Avatar" />
              )}
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-purple-700 dark:text-purple-200">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-white dark:bg-purple-950"
              >
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6 ml-5 text-purple-800 dark:text-purple-100">

                  <NavLink href="/pathlab/pending-reports" label="Pending Report" />
                  <NavLink href="/pathlab/completed-reports" label="Submitted Reports" />
                  <NavLink href="/pathlab/tests" label="Test Offered" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-[20px] font-medium transition-colors hover:text-black dark:hover:text-purple-300"
    >
      {label}
    </Link>
  );
}