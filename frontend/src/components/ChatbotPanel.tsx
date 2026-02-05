"use client";

import { useState } from "react";
import { profile } from "@/lib/profile";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: `Hi! I’m ${profile.agentName}, Mohit’s AI sidekick. Ask about his SWE/PM background, projects, or experience.`,
  },
];

export default function ChatbotPanel({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiBaseUrl = "https://mohit-unecha-s-portfolio-website.vercel.app";

      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data?.reply ||
            "Thanks for reaching out! We’ll wire this to a trained model soon.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, the chatbot is offline right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="relative w-[320px] overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 p-5 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                {profile.agentName}
              </h3>
              <p className="text-xs text-slate-300">
                AI career assistant (beta)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-200 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-2 text-sm text-slate-100">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  message.role === "user"
                    ? isDarkMode
                      ? "ml-auto bg-emerald-500/20 text-emerald-50"
                      : "ml-auto bg-blue-500/20 text-blue-50"
                    : "bg-white/10"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Ask about Mohit..."
              className={`flex-1 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-200/70 focus:outline-none focus:ring-2 ${
                isDarkMode ? "focus:ring-emerald-300/60" : "focus:ring-blue-300/60"
              }`}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading}
              className={`rounded-full px-4 py-2 text-xs font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isDarkMode
                  ? "bg-emerald-400 hover:bg-emerald-300"
                  : "bg-blue-400 hover:bg-blue-300"
              }`}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>

          <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 rounded-sm border border-white/10 bg-slate-950/95" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition ${
          isDarkMode
            ? "bg-emerald-400/90 hover:bg-emerald-300"
            : "bg-blue-400/90 hover:bg-blue-300"
        }`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
          {profile.agentName.charAt(0)}
        </span>
        <span>Chat with {profile.agentName}</span>
      </button>
    </div>
  );
}
