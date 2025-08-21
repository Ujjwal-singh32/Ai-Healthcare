"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-blue-600 shadow-md">
        <h1 className="text-2xl font-bold text-white">DemoSite</h1>
        <div className="space-x-6">
          <a href="#" className="text-white hover:text-blue-200">
            Home
          </a>
          <a href="#" className="text-white hover:text-blue-200">
            Features
          </a>
          <a href="#" className="text-white hover:text-blue-200">
            Contact
          </a>
        </div>
      </nav>

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

      {/* Floating Chatbot Icon + Tooltip */}
      <div className="fixed bottom-20 right-6 flex flex-row items-end gap-2">
        <div className="bg-white px-4 py-2 rounded-lg shadow-md text-gray-700 animate-bounce">
          👋 Need Help? Ask me!
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition animate-bounce"
        >
          🤖
        </button>
      </div>

      {/* Chat Popup */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>

          {/* Chatbox */}
          <div className="relative bg-white rounded-xl shadow-lg w-[600px] h-[550px] flex flex-col z-10 animate-slideUp">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <h2 className="font-bold">Your Navigation Assistant 🧭</h2>
              <button onClick={() => setOpen(false)}>✖</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[75%] animate-fadeIn ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                    {msg.options && (
                      <div className="mt-2 flex flex-col gap-2">
                        {msg.options.map((opt, j) => (
                          <button
                            key={j}
                            onClick={() => router.push(opt.path)}
                            className="px-3 py-1 text-sm bg-white border rounded-lg hover:bg-blue-100 transition"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border px-3 py-2 rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    handleSend(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                  const input = document.querySelector("input");
                  if (input.value.trim() !== "") {
                    handleSend(input.value);
                    input.value = "";
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
       
      `}</style>
    </div>
  );
}
