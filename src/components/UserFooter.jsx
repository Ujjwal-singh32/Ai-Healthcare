"use client";

import Link from "next/link";
import { Github, Linkedin, Instagram, Facebook, Users, TwitterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FaReddit } from "react-icons/fa";

export default function Footer() {
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    async function updateAndFetchStats() {
      try {
        // Increment count for this role
        await fetch("/api/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "patient" }),
        });

        const res = await fetch("/api/refresh");
        const data = await res.json();

        if (data.success) {
          setPatientCount(data.data.patientRefresh);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    updateAndFetchStats();
  }, []);

  // Intersection observer hook
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.3,
  });

  return (
    <footer className="bg-white/95 dark:bg-[#181c2a]/95 backdrop-blur-2xl border-t-2 border-[#2563eb]/20 dark:border-[#60a5fa]/20 shadow-2xl text-[#2563eb] dark:text-[#60a5fa] pb-0 mt-0">
      <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col sm:flex-row items-center justify-center gap-12 text-center">

        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-black flex items-center gap-2 text-[#2563eb] dark:text-[#60a5fa] drop-shadow-md tracking-tight">
            🩺 Rakshaa
          </h2>
          <p className="text-base mt-3 font-medium text-[#2563eb]/80 dark:text-[#60a5fa]/80">
            Your AI-powered healthcare companion for smarter living.
          </p>
        </div>

        {/* Nav Links */}
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

        {/* Social + Counter */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          {/* Social */}
          <div className="flex flex-col gap-3 items-center">
            <span className="font-bold text-[#2563eb] dark:text-[#60a5fa]">
              Connect with us
            </span>
            <div className="flex gap-5 mt-1">
              <FooterIcon href="https://github.com" icon={<Github className="w-6 h-6" />} />
              <FooterIcon href="https://linkedin.com" icon={<Linkedin className="w-6 h-6" />} />
              <FooterIcon href="https://instagram.com" icon={<Instagram className="w-6 h-6" />} />

            </div>
            <div className="flex gap-5 mt-1">
              <FooterIcon href="https://facebook.com" icon={<Facebook className="w-6 h-6" />} />
              <FooterIcon href="https://twitter.com" icon={<TwitterIcon className="w-6 h-6" />} />
              <FooterIcon href="https://reddit.com" icon={<FaReddit className="w-6 h-6" />} />

            </div>
          </div>

          {/* Counter */}
          <div
            ref={ref}
            className="backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 
                 rounded-xl shadow-lg border border-[#2563eb]/40 
                 dark:border-[#60a5fa]/40 px-6 py-3 text-center 
                 flex flex-col items-center w-56"
          >
            <Users className="w-8 h-8 text-[#2563eb] dark:text-[#60a5fa] mb-1 animate-bounce" />
            <h3 className="text-md font-semibold text-[#2563eb] dark:text-[#60a5fa] mb-0.5">
              Patients Visited
            </h3>
            <p className="text-3xl font-bold text-[#1d4ed8] dark:text-[#3b82f6]">
              {inView ? (
                <CountUp key={patientCount + "-" + Date.now()} // 👈 force re-render
                  start={0}
                  end={patientCount}
                  duration={2}
                  separator=","
                />
              ) : (
                0
              )}
            </p>
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
