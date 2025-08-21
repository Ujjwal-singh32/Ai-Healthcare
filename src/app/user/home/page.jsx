"use client";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  HeartPulse,
  Bot,
  Activity,
  FileText,
  FlaskConical,
  FileBarChart,
  ShoppingBag,
  ScanText,
  Ambulance,
  Shield,
  Users,
  TrendingUp,
  Award,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
} from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    reports: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const animateStats = () => {
      const targets = {
        patients: 10000,
        doctors: 500,
        reports: 25000,
        satisfaction: 98,
      };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStats({
          patients: Math.floor(targets.patients * progress),
          doctors: Math.floor(targets.doctors * progress),
          reports: Math.floor(targets.reports * progress),
          satisfaction: Math.floor(targets.satisfaction * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(targets);
        }
      }, stepDuration);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] text-[#1e293b] dark:text-[#f1f5f9] pt-16 flex flex-col">
      <UserNavbar />

      <section className="relative w-full max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 dark:bg-[#60a5fa]/20 text-[#2563eb] dark:text-[#60a5fa] px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Trusted Healthcare Platform
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#2563eb] dark:text-[#60a5fa]">
                  Transforming
                </span>
                <br />
                <span className="text-[#1e293b] dark:text-[#f1f5f9]">
                  Healthcare
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] dark:from-[#60a5fa] dark:to-[#3b82f6] bg-clip-text text-transparent">
                  with AI
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-[#64748b] dark:text-[#94a3b8] max-w-xl leading-relaxed">
                Experience the future of healthcare with our comprehensive
                AI-powered platform. Connect with doctors, predict diseases,
                manage reports, and access emergency services—all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link href="/user/ai" className="flex items-center gap-2">
                  Start AI Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
              >
                <Link href="/user/doctor">Find Doctors</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <StatCard
                number={stats.patients.toLocaleString()}
                label="Patients Served"
                suffix="+"
              />
              <StatCard
                number={stats.doctors}
                label="Expert Doctors"
                suffix="+"
              />
              <StatCard
                number={stats.reports.toLocaleString()}
                label="Reports Generated"
                suffix="+"
              />
              <StatCard
                number={stats.satisfaction}
                label="Satisfaction Rate"
                suffix="%"
              />
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <FeatureCard
                icon={<HeartPulse className="w-8 h-8" />}
                title="Expert Doctors"
                description="Connect with certified medical professionals"
                href="/user/doctor"
              />
              <FeatureCard
                icon={<Bot className="w-8 h-8" />}
                title="AI Assistant"
                description="24/7 intelligent health guidance"
                href="/user/ai"
              />
              <FeatureCard
                icon={<Activity className="w-8 h-8" />}
                title="Disease Prediction"
                description="Advanced ML health assessment"
                href="/user/ml"
              />
              <FeatureCard
                icon={<FileText className="w-8 h-8" />}
                title="Appointments"
                description="Seamless booking & management"
                href="/user/reports"
              />
              <FeatureCard
                icon={<FlaskConical className="w-8 h-8" />}
                title="Lab Tests"
                description="Comprehensive pathology services"
                href="/user/pathlabs"
              />
              <FeatureCard
                icon={<FileBarChart className="w-8 h-8" />}
                title="Health Reports"
                description="Centralized medical records"
                href="/user/pathlab-reports"
              />
              <FeatureCard
                icon={<ShoppingBag className="w-8 h-8" />}
                title="Pharmacy"
                description="Online medicine ordering"
                href="/pharmacy/home"
              />
              <FeatureCard
                icon={<ScanText className="w-8 h-8" />}
                title="Smart OCR"
                description="Digital document processing"
                href="/user/ocr"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-4">
            Why Healthcare Professionals Trust Rakshaa
          </h2>
          <p className="text-lg text-[#64748b] dark:text-[#94a3b8] max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with medical expertise
            to deliver exceptional healthcare experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TrustCard
            icon={
              <Shield className="w-8 h-8 text-[#2563eb] dark:text-[#60a5fa]" />
            }
            title="HIPAA Compliant"
            description="Bank-level security for all medical data"
          />
          <TrustCard
            icon={
              <Award className="w-8 h-8 text-[#2563eb] dark:text-[#60a5fa]" />
            }
            title="Certified Platform"
            description="ISO 27001 certified healthcare platform"
          />
          <TrustCard
            icon={
              <Clock className="w-8 h-8 text-[#2563eb] dark:text-[#60a5fa]" />
            }
            title="24/7 Availability"
            description="Round-the-clock healthcare support"
          />
          <TrustCard
            icon={
              <Users className="w-8 h-8 text-[#2563eb] dark:text-[#60a5fa]" />
            }
            title="Expert Network"
            description="500+ verified medical professionals"
          />
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 dark:from-[#2563eb]/10 dark:to-[#1d4ed8]/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-lg text-[#64748b] dark:text-[#94a3b8] max-w-3xl mx-auto">
              Experience healthcare innovation with our AI-driven solutions and
              seamless digital infrastructure.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <TechCard
              icon={
                <Bot className="w-12 h-12 text-[#2563eb] dark:text-[#60a5fa]" />
              }
              title="AI-Powered Diagnostics"
              description="Advanced machine learning algorithms analyze symptoms and provide preliminary assessments with 95% accuracy."
              features={[
                "Natural Language Processing",
                "Pattern Recognition",
                "Continuous Learning",
              ]}
            />
            <TechCard
              icon={
                <Globe className="w-12 h-12 text-[#2563eb] dark:text-[#60a5fa]" />
              }
              title="Telemedicine Platform"
              description="Secure, high-quality video consultations with integrated health monitoring and prescription management."
              features={[
                "HD Video Calls",
                "Digital Prescriptions",
                "Real-time Monitoring",
              ]}
            />
            <TechCard
              icon={
                <Smartphone className="w-12 h-12 text-[#2563eb] dark:text-[#60a5fa]" />
              }
              title="Mobile-First Design"
              description="Responsive platform optimized for all devices with offline capabilities and sync across platforms."
              features={[
                "Cross-platform Sync",
                "Offline Mode",
                "Progressive Web App",
              ]}
            />
          </div>
        </div>
      </section>

      <UserFooter />

      <div className="fixed z-50 bottom-6 right-6 flex items-end justify-end pointer-events-none select-none">
        <Link
          href="/user/sos"
          className="relative pointer-events-auto group"
          aria-label="Emergency SOS"
        >
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
          <div className="relative w-16 h-16 flex flex-col items-center justify-center rounded-full shadow-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300">
            <Ambulance className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </Link>
      </div>
    </main>
  );
}

function StatCard({ number, label, suffix = "" }) {
  return (
    <div className="text-center">
      <div className="text-2xl lg:text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
        {number}
        {suffix}
      </div>
      <div className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  priority = false,
  urgent = false,
}) {
  const cardClasses = `
    group relative p-4 lg:p-6 rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2563eb] min-h-[140px] lg:min-h-[160px] flex flex-col items-center justify-center text-center
    ${
      priority
        ? "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-xl hover:shadow-2xl"
        : urgent
        ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl hover:shadow-2xl"
        : "bg-white/90 dark:bg-[#1e293b]/90 border border-[#e2e8f0] dark:border-[#334155] shadow-lg hover:shadow-xl hover:border-[#2563eb]/50 dark:hover:border-[#60a5fa]/50"
    }
  `;

  const iconClasses = `
    w-8 h-8 mb-3 transition-transform group-hover:scale-110
    ${priority || urgent ? "text-white" : "text-[#2563eb] dark:text-[#60a5fa]"}
  `;

  const titleClasses = `
    text-sm lg:text-base font-bold mb-2
    ${priority || urgent ? "text-white" : "text-[#1e293b] dark:text-[#f1f5f9]"}
  `;

  const descClasses = `
    text-xs lg:text-sm leading-relaxed
    ${
      priority || urgent
        ? "text-white/90"
        : "text-[#64748b] dark:text-[#94a3b8]"
    }
  `;

  return (
    <Link href={href} className={cardClasses}>
      <div className={iconClasses}>{icon}</div>
      <h3 className={titleClasses}>{title}</h3>
      <p className={descClasses}>{description}</p>
      {(priority || urgent) && (
        <div className="absolute top-2 right-2">
          {urgent ? (
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          ) : (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          )}
        </div>
      )}
    </Link>
  );
}

function TrustCard({ icon, title, description }) {
  return (
    <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm border border-[#e2e8f0] dark:border-[#334155] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TechCard({ icon, title, description, features }) {
  return (
    <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm border border-[#e2e8f0] dark:border-[#334155] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="flex justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-[#1e293b] dark:text-[#f1f5f9] mb-4 text-center">
        {title}
      </h3>
      <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed mb-6 text-center">
        {description}
      </p>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa] flex-shrink-0" />
            <span className="text-sm text-[#64748b] dark:text-[#94a3b8]">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
