"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PharmaNavbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(
        `/pharmacy/medicines?search=${encodeURIComponent(searchTerm)}`
      );
    }
  };

  // Poll cart count every 1.5 seconds
  useEffect(() => {
    if (!user?._id) return;

    const fetchCartCount = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${user._id}`);
        // if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();

        // Assuming `data.items` is an array with { quantity }
        const count = data.totalQuantity || 0;

        setCartCount(count);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount(); // initial fetch
    const interval = setInterval(fetchCartCount, 1100);

    return () => clearInterval(interval); // cleanup
  }, [user?._id]);

  return (
    <header className="z-50 bg-white/70 backdrop-blur-md shadow-md top-0 sticky">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 gap-2">
        {/* Logo + Menu Button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/pharmacy/home">
            <div className="flex items-center gap-2">
              <Image src="/logo2.jpg" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-blue-700">
                Rakshaa Pharmacy
              </span>
            </div>
          </Link>
          <button
            className="md:hidden text-2xl text-blue-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full md:w-[450px] max-w-lg"
        >
          <input
            type="text"
            placeholder="Search medicine or category"
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
            <Link
              href="/user/home"
              className="text-blue-600 hover:text-blue-800"
            >
              Home
            </Link>
            <Link
              href="/pharmacy/medicines"
              className="text-blue-600 hover:text-blue-800"
            >
              Shop
            </Link>
            <Link
              href="/pharmacy/order"
              className="text-blue-600 hover:text-blue-800"
            >
              Orders
            </Link>
            <Link
              href="/pharmacy/contact"
              className="text-blue-600 hover:text-blue-800"
            >
              Contact
            </Link>
            <Link
              href="/pharmacy/about"
              className="text-blue-600 hover:text-blue-800"
            >
              About
            </Link>
          </nav>
          <Link
            href="/pharmacy/cart"
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            🛒 Cart
            {cartCount >= 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-white shadow-lg transition-all duration-300 ease-in-out">
          <Link
            href="/user/home"
            className="text-blue-600 hover:text-blue-800"
          >
            Home
          </Link>
          <Link
            href="/pharmacy/medicines"
            className="text-blue-600 hover:text-blue-800"
          >
            Shop
          </Link>
          <Link
            href="/pharmacy/order"
            className="text-blue-600 hover:text-blue-800"
          >
            Orders
          </Link>
          <Link
            href="/pharmacy/contact"
            className="text-blue-600 hover:text-blue-800"
          >
            Contact
          </Link>
          <Link
            href="/pharmacy/about"
            className="text-blue-600 hover:text-blue-800"
          >
            About
          </Link>
          <Link
            href="/pharmacy/cart"
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
