"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40">
        <button
          onClick={() => setOpen(true)}
          className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white border-2 border-[#2563eb] text-[#2563eb] flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-[#2563eb] hover:text-white"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </button>
      </div>

      {/* Chat Window */}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}