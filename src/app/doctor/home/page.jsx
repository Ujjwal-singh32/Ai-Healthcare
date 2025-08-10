"use client";

import Link from "next/link";
import {
  ClipboardList,
  LayoutDashboard,
  FileText,
  Activity,
  Bell,
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import { useEffect, useState } from "react";
import { useDoctor } from "@/context/doctorContext";

export default function DoctorHomePage() {
  const { doctor } = useDoctor();
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f0f9ff] to-[#e0f2fe] dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#172554] text-gray-900 dark:text-gray-100">
        {/* Navbar */}
        <DocNav />

        {/* Hero Section with animated gradient background */}
        <section className="relative pt-32 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20"></div>
          
          {/* Animated shapes */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800/50">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Rakshaa Healthcare Platform
              </p>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 mb-6 font-serif leading-tight"
                style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease-out', fontFamily: '"Playfair Display", Georgia, serif' }}>
              Welcome, {doctor?.name || "Doctor"}
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8"
               style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease-out 0.2s' }}>
              Your centralized platform for patient management, AI-powered disease assessment, 
              appointment tracking, and medical report reviews.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center"
                 style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease-out 0.4s' }}>
              <Link href="/doctor/appointments" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> View Appointments
              </Link>
              <Link href="/doctor/ml" 
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium rounded-lg shadow-md hover:shadow-lg border border-blue-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> AI Diagnosis
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics Overview */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-0">
              <span className="text-blue-700 dark:text-blue-400">Health Trends</span> & Outbreaks
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-gray-800 rounded-full">
              <Bell className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Real-time disease monitoring</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between h-full transform transition-transform hover:scale-[1.02] duration-300">
              <div>
                <h3 className="text-xl font-bold mb-1">Patient Statistics</h3>
                <p className="text-blue-100 dark:text-blue-200 text-sm mb-4">Current patient activity overview</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">247</p>
                  <p className="text-xs text-blue-100">Active patients</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>12% increase this month</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full transform transition-transform hover:scale-[1.02] duration-300">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Your Appointments</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Today's schedule</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Remaining today</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Next: Sarah Johnson at 2:30 PM</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full transform transition-transform hover:scale-[1.02] duration-300">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Disease Alerts</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Current outbreaks to monitor</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  <span className="font-medium text-red-700 dark:text-red-400">Dengue Outbreak</span>
                  <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full">High</span>
                </div>
                <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <span className="font-medium text-yellow-700 dark:text-yellow-400">COVID-19 Variants</span>
                  <span className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded-full">Medium</span>
                </div>
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <span className="font-medium text-blue-700 dark:text-blue-400">Seasonal Influenza</span>
                  <span className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full">Moderate</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Disease Monitoring Dashboard</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-700">
              {[
                {
                  title: "Dengue Outbreak",
                  description: "High spike in urban areas",
                  value: "+28%",
                  trend: "up",
                  color: "text-red-600 dark:text-red-400",
                  bgColor: "bg-red-50 dark:bg-red-900/20",
                },
                {
                  title: "Influenza",
                  description: "Seasonal cases on the rise",
                  value: "+15%",
                  trend: "up",
                  color: "text-blue-600 dark:text-blue-400",
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                },
                {
                  title: "COVID-19",
                  description: "New variants detected",
                  value: "+7%",
                  trend: "up",
                  color: "text-yellow-600 dark:text-yellow-400",
                  bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                },
                {
                  title: "Chikungunya",
                  description: "Localized clusters in rural zones",
                  value: "+12%",
                  trend: "up",
                  color: "text-green-600 dark:text-green-400",
                  bgColor: "bg-green-50 dark:bg-green-900/20",
                },
                {
                  title: "Malaria",
                  description: "Rising in monsoon regions",
                  value: "+18%",
                  trend: "up",
                  color: "text-teal-600 dark:text-teal-400",
                  bgColor: "bg-teal-50 dark:bg-teal-900/20",
                },
                {
                  title: "Swine Flu",
                  description: "Spikes in schools reported",
                  value: "+5%",
                  trend: "up",
                  color: "text-pink-600 dark:text-pink-400",
                  bgColor: "bg-pink-50 dark:bg-pink-900/20",
                },
              ].map((disease, index) => (
                <div
                  key={index}
                  className={`p-4 ${disease.bgColor} transition-all duration-300 hover:shadow-md`}
                >
                  <h4 className={`font-medium ${disease.color}`}>{disease.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{disease.description}</p>
                  <div className={`mt-2 flex items-center ${disease.color}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-medium">{disease.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Quick Access <span className="text-blue-700 dark:text-blue-400">Tools</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access your most important tools and features to efficiently manage your practice and provide better care for your patients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                title: "Appointments",
                description: "Manage your schedule and upcoming patient consultations.",
                icon: ClipboardList,
                link: "/doctor/appointments",
                bgGradient: "from-blue-400 to-blue-600",
                textColor: "text-white",
              },
              {
                title: "Disease Prediction",
                description: "Leverage AI tools to predict potential conditions and assist in diagnosis.",
                icon: Activity,
                link: "/doctor/ml",
                bgGradient: "from-indigo-400 to-indigo-600",
                textColor: "text-white",
              },
              {
                title: "Dashboard",
                description: "Get a comprehensive overview of your practice and patient interactions.",
                icon: LayoutDashboard,
                link: "/doctor/dashboard",
                bgGradient: "from-cyan-400 to-cyan-600",
                textColor: "text-white",
              },
              {
                title: "Patient Reports",
                description: "Access and review submitted medical documents and test results.",
                icon: FileText,
                link: "/doctor/reports",
                bgGradient: "from-sky-400 to-sky-600",
                textColor: "text-white",
              },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  href={card.link}
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s ease-out ${0.4 + index * 0.1}s`
                  }}
                  className={`flex flex-col h-full bg-gradient-to-br ${card.bgGradient} ${card.textColor} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group`}
                >
                  {/* Background pattern */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-125"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                        Quick Access
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-sm text-white/90 mb-8">{card.description}</p>
                    <div className="flex items-center font-medium">
                      <span>Get Started</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Resources Section */}
        {/* We will discuss about this feature addition later*/}
        <section className="py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Medical <span className="text-blue-700 dark:text-blue-400">Resources</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Stay updated with the latest medical research and tools
                </p>
              </div>
              <Link href="#" className="px-5 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                View All Resources
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Updated COVID-19 Treatment Guidelines",
                  date: "August 5, 2025",
                  category: "Guidelines",
                  image: "/images/covid.jpg"
                },
                {
                  title: "New AI Tools for Early Cancer Detection",
                  date: "July 28, 2025",
                  category: "Technology",
                  image: "/images/ai-medicine.jpg"
                },
                {
                  title: "Recent Advances in Cardiovascular Medicine",
                  date: "July 15, 2025",
                  category: "Research",
                  image: "/images/heart.jpg"
                }
              ].map((resource, index) => (
                <Link key={index} href="#" className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                    <FileText className="w-12 h-12 opacity-50" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                        {resource.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{resource.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {resource.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        <DoctorFooter />
      </div>
    </TooltipProvider>
  );
}
