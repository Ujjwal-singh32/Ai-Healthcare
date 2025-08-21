"use client";

import { Bot, SendHorizonal, MessageCircle, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import axios from "axios";

export default function HealthChatbotSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // ✅ controls popup open/close
  const messagesEndRef = useRef(null);

  // Load previous session messages
  useEffect(() => {
    const stored = getCookie("healthChatMessages");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        } else {
          throw new Error("Invalid format");
        }
      } catch {
        console.warn("Invalid cookie, resetting...");
        deleteCookie("healthChatMessages");
      }
    } else {
      // First time load → initial bot greeting
      const initialMessage = {
        sender: "bot",
        text: "👋 Hi! I’m Saksham, your AI Health Assistant 🤖. How can I help you today?",
        actions: [],
      };
      setMessages([initialMessage]);
      setCookie("healthChatMessages", JSON.stringify([initialMessage]), {
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }
  }, []);

  // Scroll to bottom and save to cookie
  useEffect(() => {
    if (messages.length > 0) {
      setCookie("healthChatMessages", JSON.stringify(messages), {
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const updatedMessages = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const botResponse = await getBotReply(updatedMessages);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: botResponse.reply,
        actions: botResponse.actions || [],
      },
    ]);

    setLoading(false);
  };

  const getBotReply = async (fullMessages) => {
    try {
      const response = await axios.post("/api/gemini", {
        messages: fullMessages,
      });
      return response.data; // { reply: "...", actions: [...] }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to get response";
      return { reply: `Error: ${message}`, actions: [] };
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!open && (
        <div 
          className="fixed bottom-24 right-6 z-40"
          style={{
            animation: 'bounce-tooltip 2s ease-in-out infinite'
          }}
        >
          <style>
            {`
              @keyframes bounce-tooltip {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
              }
            `}
          </style>
          <div className="relative bg-white dark:bg-[#232946] rounded-2xl shadow-lg border border-[#2563eb]/20 dark:border-[#60a5fa]/20 px-3 py-2 max-w-[180px]">
            <div className="flex items-center gap-2 text-sm font-medium text-[#2563eb] dark:text-[#60a5fa]">
              <Bot className="w-4 h-4 flex-shrink-0" />
              <span>Need help? Ask me!</span>
            </div>
            <div className="absolute top-full right-6 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white dark:border-t-[#232946]"></div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Popup Chat Window */}
      {open && (
        <div className="fixed inset-x-4 bottom-4 top-20 md:inset-auto md:bottom-20 md:right-6 md:w-[350px] lg:w-[400px] md:h-[550px] bg-white/90 dark:bg-[#232946]/95 shadow-2xl rounded-3xl overflow-hidden flex flex-col border border-[#2563eb]/40 dark:border-[#60a5fa]/40 z-50 backdrop-blur-xl animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white font-bold">
            <span className="flex items-center gap-2 text-sm md:text-base">
              <Bot className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">
                Saksham – Health Assistant
              </span>
              <span className="sm:hidden">Saksham</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] px-3 md:px-4 py-2 rounded-2xl text-xs md:text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-white rounded-br-2xl"
                      : "bg-white dark:bg-[#334155]/90 text-[#2563eb] dark:text-[#e0e7ef] border border-[#2563eb]/10 dark:border-[#60a5fa]/10 rounded-bl-2xl"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {msg.actions?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 md:gap-2">
                      {msg.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => (window.location.href = action.route)}
                          className="px-2 md:px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white shadow hover:scale-105 transition"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#60a5fa]/80 text-[#232946] px-3 py-1 rounded-lg text-xs animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-2 md:p-3 border-t border-[#2563eb]/20 dark:border-[#60a5fa]/20">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-white/90 dark:bg-[#232946]/80 text-xs md:text-sm text-[#232946] dark:text-[#e0e7ef] rounded-full px-3 md:px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] text-white shadow-md hover:scale-110 transition disabled:opacity-50"
            >
              <SendHorizonal className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
