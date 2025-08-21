"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Stethoscope,
  Calendar,
  Pill,
  Brain,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  // Predefined bot responses
  const botResponses = {
    "i have fever": [
      { type: "bot", text: "I see you have fever 🤒" },
      {
        type: "bot",
        text: "You can:",
        options: [
          { label: "Book Doctor Appointment", path: "/user/doctor" },
          { label: "Order Medicine", path: "/pharmacy" },
          { label: "Check your disease", path: "/user/ai" },
        ],
      },
    ],
    hii: [{ type: "bot", text: "Hello 👋 How can I assist you today?" }],
  };

  const handleSend = (userMsg) => {
    const newMessages = [...messages, { type: "user", text: userMsg }];
    setMessages(newMessages);

    const lower = userMsg.toLowerCase();
    if (botResponses[lower]) {
      setTimeout(() => {
        setMessages((prev) => [...prev, ...botResponses[lower]]);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Sorry, I didn’t understand 🤔" },
        ]);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
     

      {/* Hero Section */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">DemoSite</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          A clean and minimal homepage built with React + TailwindCSS.
        </p>
      </header>

      {/* Footer */}
      <footer className="bg-blue-600 text-center py-6 text-white text-sm">
        © {new Date().getFullYear()} DemoSite. All rights reserved.
      </footer>

      {/*Chatbot */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-row items-end gap-2 sm:gap-4 z-40">
        <div className="hidden sm:block bg-white text-gray-800 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-2xl border border-gray-200 animate-bounce relative backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-xs sm:text-sm">
              Need assistance? I'm here to help
            </span>
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-6 border-l-white border-t-3 border-t-transparent border-b-3 border-b-transparent drop-shadow-sm"></div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white border-2 border-[#2563eb] text-[#2563eb] flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-[#2563eb] hover:text-white"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] w-full max-w-sm sm:max-w-md h-[90vh] sm:h-[650px] flex flex-col z-10 border border-slate-200 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563eb] rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg sm:text-xl text-slate-800">
                    Saksham AI
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      Healthcare Assistant • Online
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors group border border-slate-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            {messages.length === 0 && (
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2563eb] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-slate-800 font-semibold text-sm sm:text-base">
                          Welcome to Rakshaa Healthcare
                        </h3>
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#2563eb]" />
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                        I'm Saksham, your dedicated healthcare assistant. I can
                        help you with:
                      </p>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></div>
                          <span>Booking doctor appointments</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></div>
                          <span>Symptom assessment and guidance</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></div>
                          <span>Medication and prescription support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/30">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    msg.type === "user" ? "flex-row-reverse" : "flex-row"
                  } animate-fadeIn`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                      msg.type === "user"
                        ? "bg-[#2563eb]"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-[#2563eb]" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] ${
                      msg.type === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 sm:px-4 sm:py-3 shadow-sm ${
                        msg.type === "user"
                          ? "bg-[#2563eb] text-white rounded-xl sm:rounded-2xl rounded-tr-md"
                          : "bg-white text-slate-800 border border-slate-200 rounded-xl sm:rounded-2xl rounded-tl-md"
                      }`}
                    >
                      <p className="leading-relaxed text-xs sm:text-sm font-medium">
                        {msg.text}
                      </p>
                      {msg.options && (
                        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                          {msg.options.map((opt, j) => {
                            const getIcon = (label) => {
                              if (label.includes("Doctor"))
                                return (
                                  <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4" />
                                );
                              if (label.includes("Medicine"))
                                return (
                                  <Pill className="w-3 h-3 sm:w-4 sm:h-4" />
                                );
                              if (label.includes("disease"))
                                return (
                                  <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                                );
                              return (
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              );
                            };

                            return (
                              <button
                                key={j}
                                onClick={() => router.push(opt.path)}
                                className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 bg-white text-[#2563eb] border-2 border-[#2563eb] rounded-lg sm:rounded-xl hover:bg-[#2563eb] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md group font-medium text-xs sm:text-sm"
                              >
                                {getIcon(opt.label)}
                                <span className="flex-1 text-left">
                                  {opt.label}
                                </span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <p
                      className={`text-xs text-slate-500 mt-1 sm:mt-2 font-medium ${
                        msg.type === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 sm:p-5 bg-white border-t border-slate-200">
              <div className="flex gap-2 sm:gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Describe your health concern..."
                    className="w-full border-2 border-slate-200 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 text-xs sm:text-sm font-medium placeholder-slate-400 bg-slate-50 focus:bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim() !== "") {
                        handleSend(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
                <button
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563eb] text-white rounded-lg sm:rounded-xl hover:bg-[#1d4ed8] transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group border-2 border-[#2563eb]"
                  onClick={() => {
                    const input = document.querySelector("input");
                    if (input.value.trim() !== "") {
                      handleSend(input.value);
                      input.value = "";
                    }
                  }}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
