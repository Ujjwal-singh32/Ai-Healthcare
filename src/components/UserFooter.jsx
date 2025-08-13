"use client";

import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
  <footer className="bg-white/95 dark:bg-[#181c2a]/95 backdrop-blur-2xl border-t-2 border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-2xl text-[#2563eb] dark:text-[#60a5fa] pb-0 mt-0">
      <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col sm:flex-row items-center justify-center gap-12 text-center">
        {/* Logo and Tagline */}
  <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-black flex items-center gap-2 text-[#2563eb] dark:text-[#60a5fa] drop-shadow-md tracking-tight">🩺 Rakshaa</h2>
          <p className="text-base mt-3 font-medium text-[#2563eb]/80 dark:text-[#60a5fa]/80">
            Your AI-powered healthcare companion for smarter living.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-8 mx-auto">
          <div className="flex flex-col gap-3 items-center">
            <FooterLink href="/user/pathlab-reports" label="Reports" />
            <FooterLink href="/user/ocr" label="OCR" />
            <FooterLink href="/user/doctor" label="Doctors" />
            <FooterLink href="/user/pathlabs" label="Path Labs" />
          </div>
          <div className="flex flex-col gap-3 items-center">
            <FooterLink href="/user/ai" label="Ask Saksham" />
            <FooterLink href="/pharmacy/home" label="Pharmacy" />
            <FooterLink href="/user/reports" label="Appointments" />
            <FooterLink href="/user/ml" label="Predict Disease" />
          </div>
        </div>

        {/* Social / Contact */}
  <div className="flex flex-col gap-3 items-center justify-center">
          <span className="font-bold text-[#2563eb] dark:text-[#60a5fa]">Connect with us</span>
          <div className="flex gap-5 mt-1">
            <FooterIcon href="https://github.com" icon={<Github className="w-7 h-7" />} />
            <FooterIcon href="https://linkedin.com" icon={<Linkedin className="w-7 h-7" />} />
            <FooterIcon href="https://instagram.com" icon={<Instagram className="w-7 h-7" />} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t-2 border-dashed border-[#2563eb]/20 dark:border-[#60a5fa]/20 py-5 text-center text-base font-semibold text-[#2563eb] dark:text-[#60a5fa] bg-white/90 dark:bg-[#181c2a]/90 rounded-b-3xl tracking-wide">
        &copy; {new Date().getFullYear()} Rakshaa. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-md text-[#2563eb] dark:text-[#60a5fa] hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] hover:underline transition-colors rounded px-1 py-0.5"
    >
      {label}
    </Link>
  );
}

function FooterIcon({ href, icon }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#2563eb] dark:text-[#60a5fa] hover:text-[#1d4ed8] dark:hover:text-[#3b82f6] bg-[#2563eb]/5 dark:bg-[#60a5fa]/5 hover:bg-[#2563eb]/10 dark:hover:bg-[#60a5fa]/10 transition-colors rounded-full p-2"
    >
      {icon}
    </Link>
  );
}
