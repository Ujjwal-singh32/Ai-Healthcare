"use client";

import { Bot, SendHorizonal } from "lucide-react";
import { useState, useEffect } from "react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import axios from "axios";

export default function HealthChatbotSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Hi! I’m Saksham, your AI Health Assistant 🤖. How can I help you today?",
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim() === "" || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const botReply = await getBotReply(userMessage);

    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getBotReply = async (userInput) => {
    try {
      const response = await axios.post("/api/gemini", {
        prompt: `You are Saksham, a friendly health assistant chatbot. Reply in a short, simple, helpful, and casual way (8-10 lines max). User asked: "${userInput}"`,
      });
      return response.data.botReply;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to get response";
      return `Error: ${message}`;
    }
  };

  return (
    <>
      <UserNavbar />
      <main className="h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-gradient-to-br from-[#e0e7ef] via-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:via-[#334155] dark:to-[#232946] px-4 py-6 overflow-hidden relative pt-24 sm:pt-28 font-sans">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-[#2563eb] dark:text-[#60a5fa] flex items-center gap-3 z-10 drop-shadow-lg animate-fade-in">
          <span className="relative">
            <Bot className="w-8 h-8 animate-bounce text-[#2563eb] dark:text-[#60a5fa]" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-tr from-[#60a5fa] to-[#2563eb] rounded-full blur-sm opacity-70 animate-ping"></span>
          </span>
          Saksham – AI Health Assistant
        </h2>
        {/* Chat container */}
        <div className="relative w-full max-w-2xl h-[500px] bg-white/70 dark:bg-[#232946]/80 shadow-2xl rounded-3xl overflow-hidden flex flex-col border border-[#2563eb]/40 dark:border-[#60a5fa]/40 z-10 backdrop-blur-2xl animate-fade-in ring-1 ring-white/40 dark:ring-[#232946]/40">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3 bg-[#e0e7ef]/80 dark:bg-[#232946]/80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-5 py-2.5 rounded-2xl shadow-md text-base transition-all duration-300 leading-relaxed tracking-tight ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-[#2563eb] to-[#60a5fa] text-white rounded-br-2xl animate-fade-in"
                      : "bg-white/90 dark:bg-[#334155]/90 text-[#2563eb] dark:text-[#e0e7ef] border border-[#2563eb]/10 dark:border-[#60a5fa]/10 rounded-bl-2xl animate-fade-in"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#60a5fa]/80 text-[#232946] dark:bg-[#334155] dark:text-[#e0e7ef] px-4 py-2 rounded-lg shadow-md text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border-t border-[#2563eb]/20 dark:border-[#60a5fa]/20 bg-[#e0e7ef]/80 dark:bg-[#232946]/80">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... 💬"
              className="w-full bg-white/90 dark:bg-[#232946]/80 text-[#232946] dark:text-[#e0e7ef] rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563eb] border border-[#2563eb]/10 dark:border-[#60a5fa]/10 shadow-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 flex justify-center items-center gap-2 bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#2563eb] text-white rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50 shadow-lg shadow-blue-500/30 cursor-pointer focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 font-semibold text-base tracking-tight"
              aria-label="Send message"
            >
              <SendHorizonal className="w-5 h-5 animate-pulse" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </main>
      <div className="w-full">
        <div className="border-t-2 bg-[#2563eb] border-[#60a5fa] rounded-full shadow-md shadow-[#2563eb]/10" />
      </div>
      <UserFooter />
    </>
  );
}
