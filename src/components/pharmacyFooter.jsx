"use client";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function PharmaFooter() {
  return (
    <footer className="bg-blue-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold">Rakshaa Pharmacy</h2>
          <p className="mt-3 text-sm text-blue-100">
            Your trusted online pharmacy delivering quality medicines at your doorstep with care.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-blue-100">
            <li><Link href="/pharmacy/home" className="hover:text-white">Home</Link></li>
            <li><Link href="/pharmacy/medicines" className="hover:text-white">Shop</Link></li>
            <li><Link href="/pharmacy/order" className="hover:text-white">Orders</Link></li>
            <li><Link href="/pharmacy/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-blue-100">
            <li>📍 123 Health Street, New Delhi, India</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@rakshaapharmacy.com</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"><FaFacebookF /></a>
            <a href="#" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"><FaInstagram /></a>
            <a href="#" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"><FaTwitter /></a>
            <a href="#" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-900 text-center py-4 text-sm text-blue-200">
        © {new Date().getFullYear()} Rakshaa Pharmacy. All rights reserved.
      </div>
    </footer>
  );
}
