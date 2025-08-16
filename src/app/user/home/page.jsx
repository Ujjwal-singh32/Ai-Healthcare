"use client";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Bot,
  Activity,
  FileText,
  FlaskConical,
  FileBarChart,
  ShoppingBag,
  ScanText,
} from "lucide-react";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] text-[#1e1b4b] dark:text-[#f3e8ff] relative overflow-x-hidden pt-24">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-10 dark:opacity-5">
          <defs>
            <radialGradient id="bg-grad" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-grad)" />
        </svg>
      </div>
      <UserNavbar />
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center py-20 px-4">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-[#232946]/80 rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-[#c7d2fe] dark:border-[#6366f1] mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#2563eb] dark:text-[#60a5fa] drop-shadow-lg text-center">
            Welcome to Rakshaa AI
          </h1>
          <div className="flex justify-center mb-6">
            <Button
              asChild
              size="lg"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-xl font-semibold px-8 py-4 rounded-full transition-all duration-300"
            >
              <Link href="/user/ai">Ask Our AI Doctor</Link>
            </Button>
          </div>
          <p className="text-lg md:text-xl max-w-xl mx-auto text-[#2563eb] dark:text-[#60a5fa] text-center">
            Your smart assistant for health tracking, disease prediction, and
            medical guidance.
          </p>
        </div>
        {/* Animated floating icons */}
        <div className="absolute left-8 top-8 animate-float-slow hidden md:block">
          <HeartPulse className="w-12 h-12 text-[#2563eb] opacity-70" />
        </div>
        <div className="absolute right-12 top-24 animate-float-fast hidden md:block">
          <Bot className="w-10 h-10 text-[#2563eb] opacity-60" />
        </div>
        <div className="absolute left-24 bottom-8 animate-float-medium hidden md:block">
          <Activity className="w-10 h-10 text-[#2563eb] opacity-60" />
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center my-8 z-10 relative">
        <div className="h-1 w-32 bg-[#2563eb] rounded-full shadow-md" />
      </div>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#2563eb] dark:text-[#60a5fa] drop-shadow-lg">
          What You Can Do
        </h2>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <FeatureCard
            icon={
              <HeartPulse className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-pulse" />
            }
            title="Consult Doctors"
            description="Find and connect with medical professionals easily."
            href="/user/doctor"
          />
          <FeatureCard
            icon={
              <Bot className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-bounce" />
            }
            title="Ask AI"
            description="Get instant answers to your health-related queries."
            href="/user/ai"
          />
          <FeatureCard
            icon={
              <Activity className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-spin-slow" />
            }
            title="Predict Disease"
            description="Use machine learning to assess potential health risks."
            href="/user/ml"
          />
          <FeatureCard
            icon={
              <FileText className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-fade-in" />
            }
            title="Appointments"
            description="View and manage your medical history and reports."
            href="/user/reports"
          />
        </div>
        {/* Second row of features */}
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-12">
          <FeatureCard
            icon={
              <FlaskConical className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-float-slow" />
            }
            title="Pathlabs"
            description="Book and view your pathology lab tests."
            href="/user/pathlabs"
          />
          <FeatureCard
            icon={
              <FileBarChart className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-fade-in" />
            }
            title="Reports"
            description="Access all your medical reports in one place."
            href="/user/pathlab-reports"
          />
          <FeatureCard
            icon={
              <ShoppingBag className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-bounce" />
            }
            title="Pharmacy"
            description="Order medicines and manage your prescriptions."
            href="/pharmacy/home"
          />
          <FeatureCard
            icon={
              <ScanText className="w-10 h-10 text-[#2563eb] dark:text-[#60a5fa] animate-spin-slow" />
            }
            title="OCR"
            description="Scan and digitize your medical documents."
            href="/user/ocr"
          />
        </div>
      </section>

      <UserFooter />
      {/*SOS Button*/}
      <div className="fixed z-50 bottom-2 right-2 md:bottom-6 md:right-6 flex items-end justify-end pointer-events-none select-none">
        <Link
          href="/user/sos"
          className="relative pointer-events-auto w-[52px] h-[52px] md:w-[70px] md:h-[70px] flex flex-col items-center justify-center rounded-full shadow-2xl bg-[#d42d2d] text-white text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-red-300"
          style={{ boxShadow: "0 8px 32px 0 rgba(185,28,28,0.25)" }}
          aria-label="SOS Emergency"
        >
          <span
            className="sos-text text-[1.1rem] md:text-[1.5rem] font-black leading-none font-mono tracking-widest"
            style={{
              letterSpacing: "0.08em",
              fontFamily: "monospace, Arial, sans-serif",
            }}
          >
            SOS
          </span>
        </Link>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description, href }) {
  return (
    <Link
      href={href}
      className="group p-7 rounded-3xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] backdrop-blur-xl flex flex-col items-center min-h-[220px]"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-[#2563eb] dark:text-[#60a5fa] group-hover:text-[#1d4ed8] dark:group-hover:text-[#3b82f6] transition-colors">
          {title}
        </h3>
        <p className="text-base text-[#2563eb] dark:text-[#60a5fa] text-center">
          {description}
        </p>
      </div>
    </Link>
  );
}
