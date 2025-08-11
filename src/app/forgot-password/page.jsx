"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Patient");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/forgot-password", { email, role });
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          router.push("/login");
        }, 1200); // Give time for toast to show
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 text-gray-900 dark:text-white px-2 sm:px-4 md:px-8 overflow-hidden font-sans">
  <div className="absolute w-[520px] h-[520px] bg-gradient-to-br from-blue-300/40 via-blue-200/30 to-white/10 rounded-full blur-3xl top-[-12%] left-[-18%] z-0 animate-pulse-slow" />
  <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-blue-400/30 via-blue-200/20 to-white/10 rounded-full blur-2xl top-[28%] right-[-12%] z-0 animate-pulse-slower" />
  <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 via-blue-50/10 to-white/5 rounded-full blur-2xl bottom-[-18%] left-[22%] z-0 animate-pulse-slowest" />

      {/* Content Card */}
      <div className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/80 dark:bg-blue-950/80 backdrop-blur-2xl border border-blue-300/70 dark:border-blue-800/70 p-4 sm:p-8 md:p-12 flex flex-col items-center gap-8 animate-slide-fade ring-2 ring-blue-200/40 dark:ring-blue-900/40 ring-offset-2 ring-offset-blue-100 dark:ring-offset-blue-950 transition-all duration-300 sm:mx-4 md:mx-6" style={{boxShadow: '0 8px 32px 0 rgba(37,99,235,0.12), 0 1.5px 8px 0 rgba(37,99,235,0.10)'}}>
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="text-4xl sm:text-5xl font-black text-blue-700 dark:text-blue-200 tracking-tight">
            Rakshaa
          </span>
          <span className="text-base sm:text-lg font-medium text-blue-900/80 dark:text-blue-100/80 tracking-widest uppercase letter-spacing-[0.2em] text-center w-full">
            Secure Healthcare Portal
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-center text-blue-900 dark:text-blue-100 mb-2 font-sans tracking-tight animate-fade-in w-full">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block mb-1 font-semibold text-blue-800 dark:text-blue-200">Role</label>
            <div className="relative w-full">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-3 px-4 pr-10 rounded-xl bg-white/90 dark:bg-blue-900/60 text-blue-900 dark:text-white text-base font-semibold border-2 border-blue-400 dark:border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 appearance-none cursor-pointer outline-none hover:bg-blue-50/80 dark:hover:bg-blue-800/60"
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
              <div className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-400 dark:text-blue-200 text-xl">▼</div>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-800 dark:text-blue-200">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-white/90 dark:bg-blue-900/60 text-blue-900 dark:text-white text-base border-2 border-blue-200 dark:border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 outline-none placeholder:text-blue-300 dark:placeholder:text-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-xl py-4 sm:py-6 cursor-pointer text-lg font-bold tracking-wide shadow-lg transition-all duration-200 border border-blue-700/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? "Requesting..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .animate-slide-fade {
          animation: slideFadeIn 0.6s ease forwards;
        }
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulseSlower 10s ease-in-out infinite;
        }
        .animate-pulse-slowest {
          animation: pulseSlowest 12s ease-in-out infinite;
        }
        @keyframes pulseSlow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes pulseSlower {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.08); }
        }
        @keyframes pulseSlowest {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -10px) scale(1.04); }
        }
      `}</style>
    </div>
  );
}
