"use client";
import { useState } from "react";
import { Bot, User, X, Send, Stethoscope, Pill, Brain, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  // Call backend (route.js) with conversation history
  const sendMessage = async (text) => {
    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply, options: data.actions || [] },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Chat Box */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md h-[90vh] sm:h-[650px] flex flex-col z-10 border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-lg text-slate-800">Saksham AI</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/30">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  msg.sender === "user" ? "bg-[#2563eb]" : "bg-white border"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-[#2563eb]" />
                )}
              </div>
              <div className="max-w-[75%]">
                <div
                  className={`px-3 py-2 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#2563eb] text-white rounded-xl rounded-tr-md"
                      : "bg-white border text-slate-800 rounded-xl rounded-tl-md"
                  }`}
                >
                  <p className="text-sm font-medium">{msg.text}</p>

                  {/* Render options (actions) */}
                  {msg.options && (
                    <div className="mt-3 space-y-2">
                      {msg.options.map((opt, j) => {
                        const getIcon = (label) => {
                          if (label.includes("Doctor"))
                            return <Stethoscope className="w-4 h-4" />;
                          if (label.includes("Medicine"))
                            return <Pill className="w-4 h-4" />;
                          if (label.includes("disease"))
                            return <Brain className="w-4 h-4" />;
                          return <Calendar className="w-4 h-4" />;
                        };

                        return (
                          <button
                            key={j}
                            onClick={() => {
                              router.push(opt.route);
                              onClose(); // <-- close chatbox automatically
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 border-2 border-[#2563eb] text-[#2563eb] rounded-lg hover:bg-[#2563eb] hover:text-white transition-all"
                          >
                            {getIcon(opt.label)}
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your health concern..."
              className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#2563eb]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage(input);
                }
              }}
            />
            <button
              onClick={() => input.trim() && sendMessage(input)}
              className="w-10 h-10 bg-[#2563eb] text-white rounded-lg flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
