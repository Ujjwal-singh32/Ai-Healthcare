"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (!token) {
      setMessage("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/reset-password", {
        token,
        newPassword,
        role,
      });
      setMessage(res.data.message);
      if (res.data.success) {
        toast.success("Password Changed Successfully");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
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

      <div className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/80 dark:bg-blue-950/80 backdrop-blur-2xl border border-blue-300/70 dark:border-blue-800/70 p-4 sm:p-8 md:p-12 flex flex-col items-center gap-8 animate-slide-fade ring-2 ring-blue-200/40 dark:ring-blue-900/40 ring-offset-2 ring-offset-blue-100 dark:ring-offset-blue-950 transition-all duration-300 sm:mx-4 md:mx-6" style={{boxShadow: '0 8px 32px 0 rgba(37,99,235,0.12), 0 1.5px 8px 0 rgba(37,99,235,0.10)'}}>
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="text-4xl sm:text-5xl font-black text-blue-700 dark:text-blue-200 tracking-tight">
            Rakshaa
          </span>
          <span className="text-base sm:text-lg font-medium text-blue-900/80 dark:text-blue-100/80 tracking-widest uppercase letter-spacing-[0.2em] text-center w-full">
            Secure Healthcare Portal
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-center text-blue-900 dark:text-blue-100 mb-2 font-sans tracking-tight animate-fade-in w-full">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block mb-1 font-semibold text-blue-800 dark:text-blue-200">New Password</label>
            <div className="relative w-full">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-3 px-4 pr-12 rounded-xl bg-white/90 dark:bg-blue-900/60 text-blue-900 dark:text-white text-base border-2 border-blue-200 dark:border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 outline-none placeholder:text-blue-300 dark:placeholder:text-blue-500"
                placeholder="Enter new password"
                minLength={6}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.36 2.64A9.77 9.77 0 0021 12c-1.73-4-5.33-7-9-7-1.47 0-2.87.32-4.13.89M6.18 6.18A9.77 9.77 0 003 12c1.73 4 5.33 7 9 7 1.47 0 2.87-.32 4.13-.89" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-blue-800 dark:text-blue-200">Confirm Password</label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 pr-12 rounded-xl bg-white/90 dark:bg-blue-900/60 text-blue-900 dark:text-white text-base border-2 border-blue-200 dark:border-blue-700 shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 outline-none placeholder:text-blue-300 dark:placeholder:text-blue-500"
                placeholder="Confirm new password"
                minLength={6}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.36 2.64A9.77 9.77 0 0021 12c-1.73-4-5.33-7-9-7-1.47 0-2.87.32-4.13.89M6.18 6.18A9.77 9.77 0 003 12c1.73 4 5.33 7 9 7 1.47 0 2.87-.32 4.13-.89" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm transition-opacity duration-500 opacity-100 text-blue-700 dark:text-blue-300">
            {message}
          </p>
        )}
      </div>

      <style jsx>{`
        .animate-slide-fade {
          animation: slideFadeIn 0.6s ease forwards;
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
          animation: blob1 8s ease-in-out infinite;
        }
        .animate-blob2 {
          animation: blob2 10s ease-in-out infinite;
        }
        .animate-blob3 {
          animation: blob3 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
