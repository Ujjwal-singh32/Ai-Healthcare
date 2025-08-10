"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PharmaNavbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <header className="relative z-50 bg-white/70 backdrop-blur-md shadow-md top-0 sticky">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 gap-2">

        {/* Top Row: Logo + Menu Button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo */}
          <Link href="/pharmacy/home">
            <div className="flex items-center gap-2">
              <Image src="/logo2.jpg" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-blue-700">
                Rakshaa Pharmacy
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-blue-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Search Bar - Wider & Taller */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full md:w-[450px] max-w-lg"
        >
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg border border-blue-400 focus:outline-none focus:border-blue-600 text-base"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 text-lg"
          >
            🔍
          </button>
        </form>

        {/* Desktop Nav + Cart */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 text-lg">
            <Link href="/pharmacy/home" className="text-blue-600 hover:text-blue-800">Home</Link>
            <Link href="/pharmacy/medicines" className="text-blue-600 hover:text-blue-800">Shop</Link>
            <Link href="/pharmacy/orders" className="text-blue-600 hover:text-blue-800">Orders</Link>
            <Link href="/pharmacy/contact" className="text-blue-600 hover:text-blue-800">Contact</Link>
            <Link href="/pharmacy/about" className="text-blue-600 hover:text-blue-800">About</Link>
          </nav>
          <Link
            href="/pharmacy/cart"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            🛒 Cart
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-white shadow-lg transition-all duration-300 ease-in-out">
          <Link href="/pharmacy/home" className="text-blue-600 hover:text-blue-800">Home</Link>
          <Link href="/pharmacy/medicines" className="text-blue-600 hover:text-blue-800">Shop</Link>
          <Link href="/pharmacy/orders" className="text-blue-600 hover:text-blue-800">Orders</Link>
          <Link href="/pharmacy/contact" className="text-blue-600 hover:text-blue-800">Contact</Link>
          <Link href="/pharmacy/about" className="text-blue-600 hover:text-blue-800">About</Link>
          <Link
            href="/pharmacy/cart"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            🛒 Cart
          </Link>
        </div>
      )}
    </header>
  );
}
