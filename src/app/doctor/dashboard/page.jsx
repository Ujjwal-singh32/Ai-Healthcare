"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  CalendarCheck,
  MessageCircle,
  Activity,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import axios from "axios";
import { useDoctor } from "@/context/doctorContext";

const barData = [
  { month: "Jan", value: 70 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 60 },
  { month: "Apr", value: 95 },
  { month: "May", value: 90 },
];

const pieData = [
  { label: "Excellent", value: 65, color: "#2563eb" },
  { label: "Good", value: 25, color: "#60a5fa" },
];

const linePoints = [
  { x: 0, y: 90 },
  { x: 50, y: 40 },
  { x: 100, y: 60 },
  { x: 150, y: 30 },
  { x: 200, y: 50 },
  { x: 250, y: 20 },
  { x: 300, y: 40 },
];

const areaPoints = [
  { x: 0, y: 80 },
  { x: 50, y: 50 },
  { x: 100, y: 70 },
  { x: 150, y: 40 },
  { x: 200, y: 60 },
  { x: 250, y: 30 },
  { x: 300, y: 50 },
];

const createLinePath = (points) =>
  points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

const createAreaPath = (points) =>
  [
    `M${points[0].x},100`,
    ...points.map((p) => `L${p.x},${p.y}`),
    `L${points[points.length - 1].x},100`,
    "Z",
  ].join(" ");

export default function DoctorDashboard() {
  const { doctor } = useDoctor();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!doctor || !doctor._id) {
        setLoading(false);
        return;
      }

      setAnimate(true);
      try {
        const response = await axios.post("/api/doctor/dashboard", {
          doctorId: doctor._id,
        });
        const data = response.data;
        setDashboardData(data);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [doctor]);

  // Pie chart circumference
  const circumference = 2 * Math.PI * 16; // r=16

  // For pie chart slice dash offsets
  let accumulated = 0;
  const stats = [
    {
      icon: <Clock className="text-white w-8 h-8" />,
      title: "Pending Appointments",
      value: dashboardData?.pendingAppointments || "0",
      bgGradient: "from-[#2563eb] to-[#1d4ed8]",
      textColor: "text-[#2563eb] dark:text-[#60a5fa]",
    },
    {
      icon: <CalendarCheck className="text-white w-8 h-8" />,
      title: "Completed Appointments",
      value: dashboardData?.completedAppointments || "0",
      bgGradient: "from-[#059669] to-[#047857]",
      textColor: "text-[#059669] dark:text-[#10b981]",
    },
    {
      icon: <CircleDollarSign className="text-white w-8 h-8" />,
      title: "Total Earnings",
      value: `₹${dashboardData?.totalRevenue || "0"}`,
      bgGradient: "from-[#dc2626] to-[#b91c1c]",
      textColor: "text-[#dc2626] dark:text-[#ef4444]",
    },
  ];

  if (loading) {
    return (
      <>
        <DocNav />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#2563eb] dark:border-[#60a5fa]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <DocNav />
      <main className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] text-[#1e1b4b] dark:text-[#f3e8ff] relative overflow-x-hidden pt-24">
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8 space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2563eb] dark:text-[#60a5fa] drop-shadow-lg">
              Doctor's Dashboard
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#2563eb] dark:text-[#60a5fa] max-w-2xl mx-auto">
              Welcome back, Dr. {doctor?.name || "Doctor"}. Here's your practice overview.
            </p>
          </section>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.map((item, i) => (
                <Card
                  key={i}
                  className="group backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] rounded-3xl cursor-default animate-fade-in min-w-0"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <CardHeader className="flex flex-col items-center gap-3 pb-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${item.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <CardTitle className={`text-lg font-bold ${item.textColor} text-center`}>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-4xl font-extrabold text-center ${item.textColor} drop-shadow-sm`}>
                      {item.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Monthly Appointments Chart */}
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] rounded-3xl p-3 sm:p-6 animate-fade-in overflow-hidden min-w-0" style={{ animationDelay: "600ms" }}>
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg">
                      <TrendingUp className="text-white w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg md:text-xl truncate">
                        Monthly Appointments
                      </CardTitle>
                      <p className="text-xs md:text-sm text-[#2563eb]/70 dark:text-[#60a5fa]/70 truncate">
                        Last 5 months overview
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <div className="text-xl md:text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                      {barData.reduce((sum, item) => sum + item.value, 0)}
                    </div>
                    <div className="text-xs text-[#2563eb]/70 dark:text-[#60a5fa]/70">
                      Total Appointments
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative h-56 sm:h-64 min-w-0">
                  <svg viewBox="0 0 400 200" width="100%" height="auto" className="w-full h-full">
                    {/* Grid Lines */}
                    {[0, 20, 40, 60, 80, 100].map((y) => (
                      <line key={y} x1="0" y1={200 - y * 2} x2="400" y2={200 - y * 2} stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
                    ))}
                    {/* Professional Bars */}
                    {barData.map(({ month, value }, i) => {
                      const barWidth = 45;
                      const gap = 25;
                      const x = i * (barWidth + gap) + 30;
                      const barHeight = value * 1.8;
                      const y = 200 - barHeight;
                      return (
                        <g key={month}>
                          {/* Subtle Background Bar */}
                          <rect x={x} y={0} width={barWidth} height={200} fill="rgba(37, 99, 235, 0.03)" rx={8} ry={8} />
                          {/* Main Bar with Professional Gradient */}
                          <rect x={x} y={animate ? y : 200} width={barWidth} height={animate ? barHeight : 0} fill="url(#professionalBarGradient)" rx={8} ry={8} style={{ transition: `height 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 150}ms, y 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 150}ms` }} />
                          {/* Value Label with Professional Styling */}
                          <text x={x + barWidth / 2} y={animate ? y - 12 : 200} textAnchor="middle" className="fill-[#1e40af] dark:fill-[#3b82f6] text-xs font-semibold select-none" style={{ transition: `y 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 150}ms`, fontSize: '11px', fontWeight: '600' }}>{value}</text>
                          {/* Month Label with Better Typography */}
                          <text x={x + barWidth / 2} y="215" textAnchor="middle" className="fill-[#4b5563] dark:fill-[#9ca3af] text-xs font-medium select-none" style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.5px' }}>{month}</text>
                        </g>
                      );
                    })}
                    {/* Professional Gradients */}
                    <defs>
                      <linearGradient id="professionalBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                        <stop offset="50%" stopColor="#2563eb" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Chart Summary */}
                  <div className="mt-4 pt-4 border-t border-[#e5e7eb] dark:border-[#374151]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-3 h-3 rounded-full bg-[#2563eb]"></div>
                        <span className="text-xs text-[#6b7280] dark:text-[#9ca3af] truncate">Appointments</span>
                      </div>
                      <div className="text-right min-w-0">
                        <div className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                          Avg: {Math.round(barData.reduce((sum, item) => sum + item.value, 0) / barData.length)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Professional Patient Feedback Card */}
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] rounded-3xl p-3 sm:p-6 animate-fade-in overflow-hidden min-w-0" style={{ animationDelay: "800ms" }}>
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] shadow-lg">
                      <MessageCircle className="text-white w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg md:text-xl truncate">
                        Patient Feedback
                      </CardTitle>
                      <p className="text-xs md:text-sm text-[#2563eb]/70 dark:text-[#60a5fa]/70 truncate">
                        Satisfaction ratings overview
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <div className="text-xl md:text-2xl font-bold text-[#059669] dark:text-[#10b981]">
                      {pieData.reduce((sum, item) => sum + item.value, 0)}%
                    </div>
                    <div className="text-xs text-[#059669]/70 dark:text-[#10b981]/70">
                      Overall Satisfaction
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative h-56 sm:h-64 min-w-0">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <svg viewBox="0 0 36 36" width="100%" height="auto" className="w-32 sm:w-40 h-auto rotate-[-90deg] drop-shadow-lg" aria-label="Pie chart showing patient feedback">
                        {/* Background circle with subtle shadow */}
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="4" />
                        {/* Main pie slices */}
                        {pieData.map(({ label, value, color }, i) => {
                          const dashArray = `${(value / 100) * circumference} ${circumference}`;
                          accumulated += (value / 100) * circumference;
                          const dashOffset = animate ? circumference - (pieData.slice(0, i).reduce((a, b) => a + b.value, 0) / 100) * circumference : circumference;
                          return (
                            <circle key={label} cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="4" strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 300}ms`, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} />
                          );
                        })}
                      </svg>
                      {/* Center content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                            {Math.round(pieData.reduce((sum, item) => sum + item.value, 0) / pieData.length)}%
                          </div>
                          <div className="text-xs text-[#6b7280] dark:text-[#9ca3af] font-medium">Average</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Compact Professional Legend */}
                  <div className="space-y-2">
                    {pieData.map(({ label, value, color }, index) => (
                      <div key={label} className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-white/50 to-white/30 dark:from-[#232946]/50 dark:to-[#232946]/30 border border-[#e5e7eb] dark:border-[#374151] hover:shadow-sm transition-all duration-200 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                            <div className="absolute inset-0 w-3 h-3 rounded-full animate-pulse opacity-30" style={{ backgroundColor: color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[#1e293b] dark:text-[#f1f5f9] text-xs truncate">{label}</div>
                          </div>
                        </div>
                        <div className="text-right min-w-0">
                          <div className="text-sm font-bold text-[#2563eb] dark:text-[#60a5fa]">{value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Summary Stats */}
                  <div className="mt-4 pt-3 border-t border-[#e5e7eb] dark:border-[#374151]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#059669] to-[#047857]"></div>
                        <span className="text-xs text-[#6b7280] dark:text-[#9ca3af] font-medium truncate">Feedback Analysis</span>
                      </div>
                      <div className="text-right min-w-0">
                        <div className="text-xs text-[#6b7280] dark:text-[#9ca3af]">{pieData.reduce((sum, item) => sum + item.value, 0)}% total</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-8">
              {/* Professional Weekly Patient Visits Chart */}
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] rounded-3xl p-6 animate-fade-in overflow-hidden h-full flex flex-col" style={{ animationDelay: "1000ms" }}>
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-lg">
                      <Activity className="text-white w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg md:text-xl truncate">
                        Weekly Patient Visits
                      </CardTitle>
                      <p className="text-xs md:text-sm text-[#2563eb]/70 dark:text-[#60a5fa]/70 truncate">
                        Last 7 days trend analysis
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <div className="text-xl md:text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                      {Math.round(linePoints.reduce((sum, point) => sum + (100 - point.y), 0) / linePoints.length)}
                    </div>
                    <div className="text-xs text-[#2563eb]/70 dark:text-[#60a5fa]/70">
                      Avg Daily Visits
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative h-56 sm:h-64 min-w-0">
                  <svg viewBox="0 0 400 240" width="100%" height="auto" className="w-full h-full" style={{ padding: "0 10px" }}>
                    {/* Background Grid */}
                    {[0, 20, 40, 60, 80, 100].map((y) => (
                      <line key={y} x1="0" y1={200 - y * 2} x2="400" y2={200 - y * 2} stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
                    ))}
                    {/* Area Fill */}
                    <path d={`M0,200 ${linePoints.map((point, i) => `L${(i * 400) / (linePoints.length - 1)},${200 - (100 - point.y) * 2}`).join(' ')} L400,200 Z`} fill="url(#areaFillGradient)" opacity={animate ? 0.3 : 0} style={{ transition: "opacity 1.5s ease-out 0.5s" }} />
                    {/* Main Line */}
                    <polyline fill="none" stroke="url(#professionalLineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={linePoints.map((point, i) => `${(i * 400) / (linePoints.length - 1)},${200 - (100 - point.y) * 2}`).join(' ')} style={{ strokeDasharray: 1000, strokeDashoffset: animate ? 0 : 1000, transition: "stroke-dashoffset 1.8s ease-out", filter: "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))" }} />
                    {/* Data Points */}
                    {linePoints.map((point, i) => {
                      const x = (i * 400) / (linePoints.length - 1);
                      const y = 200 - (100 - point.y) * 2;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r={8} fill="rgba(37, 99, 235, 0.2)" style={{ animation: animate ? `pulse 2s infinite ${i * 200}ms` : "none" }} />
                          <circle cx={x} cy={y} r={6} fill="url(#pointGradient)" stroke="white" strokeWidth="2" style={{ transformOrigin: "center", animation: animate ? `popIn 0.4s ease-out forwards ${i * 200 + 800}ms` : "none", opacity: animate ? 1 : 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                          <text x={x} y={animate ? y - 25 : y} textAnchor="middle" className="fill-[#2563eb] dark:fill-[#60a5fa] text-xs font-semibold select-none" style={{ transition: `y 0.4s ease-out ${i * 200 + 800}ms`, fontSize: '10px', fontWeight: '600', opacity: animate ? 1 : 0 }}>{Math.round(100 - point.y)}</text>
                        </g>
                      );
                    })}
                    {/* Professional Gradients */}
                    <defs>
                      <linearGradient id="professionalLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="areaFillGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="pointGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-[#2563eb] dark:text-[#60a5fa] mt-7 select-none font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i, arr) => (
                      <span key={d} style={{ minWidth: 24, textAlign: i === 0 ? 'left' : i === arr.length - 1 ? 'right' : 'center' }}>{d}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Active Users Over Time Card */}
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] rounded-3xl p-6 animate-fade-in overflow-hidden h-full flex flex-col" style={{ animationDelay: "1200ms" }}>
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#60a5fa] shadow-lg">
                      <Users className="text-white w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg md:text-xl truncate">
                        Active Users Over Time
                      </CardTitle>
                      <p className="text-xs md:text-sm text-[#2563eb]/70 dark:text-[#60a5fa]/70 truncate">
                        User engagement trend
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <div className="text-xl md:text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                      {areaPoints && areaPoints.length > 0 ? Math.max(...areaPoints.map((p) => p.y)) : 0}
                    </div>
                    <div className="text-xs text-[#2563eb]/70 dark:text-[#60a5fa]/70">
                      Peak Users
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative h-56 sm:h-64 min-w-0">
                  <svg viewBox="0 0 400 220" width="100%" height="auto" className="w-full h-full">
                    {/* Background Grid */}
                    {[0, 20, 40, 60, 80, 100].map((y) => (
                      <line key={y} x1={24} y1={210 - y * 2} x2={400 - 24} y2={210 - y * 2} stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
                    ))}
                    {/* Area Fill */}
                    <path d={`M24,210 ${areaPoints.map((point, i) => `L${24 + (i * (400 - 48)) / (areaPoints.length - 1)},${210 - point.y * 2}`).join(' ')} L${400 - 24},210 Z`} fill="url(#activeUsersAreaGradient)" opacity={animate ? 0.4 : 0} style={{ transition: "opacity 1.5s ease-out 0.5s" }} />
                    {/* Main Line */}
                    <polyline fill="none" stroke="url(#activeUsersLineGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={areaPoints.map((point, i) => `${24 + (i * (400 - 48)) / (areaPoints.length - 1)},${210 - point.y * 2}`).join(' ')} style={{ strokeDasharray: 1000, strokeDashoffset: animate ? 0 : 1000, transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 2px 4px rgba(37,99,235,0.2))" }} />
                    {/* Data Points */}
                    {areaPoints.map((point, i) => {
                      const chartPadding = 24;
                      const chartWidth = 400 - chartPadding * 2;
                      const x = chartPadding + (i * chartWidth) / (areaPoints.length - 1);
                      const y = 210 - point.y * 2;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r={7} fill="rgba(37,99,235,0.12)" />
                          <circle cx={x} cy={y} r={5} fill="url(#activeUsersPointGradient)" stroke="white" strokeWidth="2" style={{ opacity: animate ? 1 : 0, transition: `opacity 0.4s ${i * 100 + 800}ms` }} />
                          <text x={x} y={animate ? y - 18 : y} textAnchor="middle" className="fill-[#2563eb] dark:fill-[#60a5fa] text-xs font-semibold select-none" style={{ transition: `y 0.4s ${i * 100 + 800}ms`, fontSize: '10px', fontWeight: '600', opacity: animate ? 1 : 0 }}>{point.y}</text>
                        </g>
                      );
                    })}
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="activeUsersLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="activeUsersAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="activeUsersPointGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-[#2563eb] dark:text-[#60a5fa] mt-7 select-none font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i, arr) => (
                      <span key={d} style={{ minWidth: 24, textAlign: i === 0 ? 'left' : i === arr.length - 1 ? 'right' : 'center' }}>{d}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Appointment Completion Progress Card */}
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-[#232946]/80 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-[#2563eb] dark:border-[#60a5fa] hover:border-[#1d4ed8] dark:hover:border-[#3b82f6] rounded-3xl p-6 animate-fade-in overflow-hidden h-full flex flex-col" style={{ animationDelay: "1400ms" }}>
                <CardHeader className="flex items-center justify-center gap-3 mb-6">
                  <Activity className="text-[#2563eb] dark:text-[#60a5fa] w-6 h-6" />
                  <CardTitle className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-xl text-center">
                    Appointment Completion Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
                  {[
                    {
                      label: "Completed",
                      value: 75,
                      color: "bg-gradient-to-r from-[#059669] to-[#047857]",
                    },
                    {
                      label: "In Progress",
                      value: 15,
                      color: "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]",
                    },
                    {
                      label: "Cancelled",
                      value: 10,
                      color: "bg-gradient-to-r from-[#dc2626] to-[#b91c1c]",
                    },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between mb-2 font-semibold text-[#2563eb] dark:text-[#60a5fa] select-none">
                        <span>{label}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded-xl overflow-hidden w-full relative">
                        <div 
                          className={`${color} h-3 rounded-xl transition-all duration-1000 ease-out shadow-inner`}
                          style={{ width: animate ? `${value}%` : '0%' }}
                        >
                          <div className="absolute inset-0 opacity-10 bg-white"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      <DoctorFooter />
    </>
  );
}
