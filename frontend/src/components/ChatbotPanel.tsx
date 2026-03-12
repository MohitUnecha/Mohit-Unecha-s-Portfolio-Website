"use client";

import React, { useState, useRef, useEffect } from "react";
import { profile } from "@/lib/profile";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SpeechRecognitionAlternativeLike = {
  transcript?: string;
};

type SpeechRecognitionResultLike = ArrayLike<SpeechRecognitionAlternativeLike>;

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtorLike = new () => SpeechRecognitionLike;

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: `Hey! I'm ${profile.agentName} — Mohit's AI sidekick. Ask me anything about him, his projects, or what he's working on. Or just say hi!`,
  },
];

export default function ChatbotPanel({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState("Ready to talk");
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const messagesRef = useRef<Message[]>(initialMessages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isVoiceModeRef = useRef(true);
  const isCallActiveRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);
  const lastSpokenTextRef = useRef("");
  const silenceTimerRef = useRef<number | null>(null);
  const pendingTranscriptRef = useRef("");

  const SECTION_NAV: Record<string, string> = {
    about: "#about",
    experience: "#experience",
    projects: "#projects",
    contact: "#contact",
    skills: "#skills",
    education: "#education",
    home: "#home",
    top: "#home",
  };

  const tryNavigate = (transcript: string): boolean => {
    const lower = transcript.toLowerCase();
    for (const [keyword, anchor] of Object.entries(SECTION_NAV)) {
      if (lower.includes(keyword)) {
        const el = document.querySelector(anchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setCallStatus(`Scrolling to ${keyword}...`);
          return true;
        }
      }
    }
    return false;
  };

  const normalizeSpeechText = (text: string) =>
    text
      .toLowerCase()
      .replace(/unecha's/g, "oo-neh-chahs")
      .replace(/unecha/g, "oo-neh-chah")
      .replace(/mohit's/g, "mo-hits")
      .replace(/mohit/g, "mo-hit")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const armRecognition = (delay = 0) => {
    if (!recognitionRef.current || !isCallActiveRef.current) return;
    clearRestartTimer();
    restartTimerRef.current = window.setTimeout(() => {
      if (!recognitionRef.current || isLoadingRef.current) return;
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition may already be running.
      }
    }, delay);
  };

  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode;
  }, [isVoiceMode]);

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setShowDisclosure(true);
      setIsDisclosureOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtorLike;
      webkitSpeechRecognition?: SpeechRecognitionCtorLike;
    };
    const SpeechRecognitionCtor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => {
      setIsListening(true);
      if (!isSpeakingRef.current) {
        setCallStatus("Listening for you...");
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      if (isCallActiveRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
        setCallStatus("Listening for you...");
        armRecognition(250);
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      setCallStatus("Mic issue - tap Resume Call");
    };
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const result = event.results?.[event.results.length - 1];
      const transcript = result?.[0]?.transcript?.trim();
      if (!transcript) return;

      // If Jarvis is still speaking, ignore ALL mic input (it's echo from the speaker)
      if (isSpeakingRef.current) {
        return;
      }

      const normalizedTranscript = normalizeSpeechText(transcript);
      // Also filter out any residual echo that closely matches what Jarvis just said
      if (
        lastSpokenTextRef.current &&
        normalizedTranscript.length > 4 &&
        (lastSpokenTextRef.current.includes(normalizedTranscript) ||
          normalizedTranscript.includes(lastSpokenTextRef.current.slice(0, 24)))
      ) {
        return;
      }

      // Interrupt Jarvis if user is clearly speaking
      if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      isSpeakingRef.current = false;

      // Check for navigation commands (e.g. "take me to experience")
      const lower = transcript.toLowerCase();
      if (lower.includes("take me to") || lower.includes("go to") || lower.includes("show me") || lower.includes("scroll to")) {
        if (tryNavigate(transcript)) {
          pendingTranscriptRef.current = "";
          if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
          return;
        }
      }

      // Accumulate transcript and debounce: wait 2 seconds of silence before sending
      pendingTranscriptRef.current = transcript;
      setCallStatus("Heard you... waiting for you to finish");
      if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = window.setTimeout(() => {
        const finalText = pendingTranscriptRef.current.trim();
        pendingTranscriptRef.current = "";
        if (finalText) {
          void sendPrompt(finalText);
        }
      }, 2000);
    };

    recognitionRef.current = recognition;
    return () => {
      clearRestartTimer();
      if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
      recognition.stop?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speakReply = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !isCallActiveRef.current) return;

    const spokenText = text
      .replace(/Unecha's/gi, "oo-NEH-chah's")
      .replace(/Unecha/gi, "oo-NEH-chah")
      .replace(/Mohit's/g, "Mo-hit's")
      .replace(/Mohit/g, "Mo-hit");
    lastSpokenTextRef.current = normalizeSpeechText(spokenText);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.01;
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => /Samantha|Google US English|en-US/i.test(voice.name));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setCallStatus("Jarvis is speaking. Interrupt anytime.");
      // Do NOT open mic while Jarvis speaks — prevents echo/feedback loop
      try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }
    };
    utterance.onend = () => {
      isSpeakingRef.current = false;
      lastSpokenTextRef.current = "";
      if (isCallActiveRef.current) {
        setCallStatus("Listening for you...");
        // Wait 600ms after speech ends to avoid capturing residual echo
        armRecognition(600);
      } else {
        setCallStatus("Ready to talk");
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startCall = () => {
    if (!recognitionRef.current || isLoadingRef.current) return;
    setIsOpen(true);
    setIsVoiceMode(true);
    setIsCallActive(true);
    isVoiceModeRef.current = true;
    isCallActiveRef.current = true;
    setCallStatus("Connecting to Jarvis...");

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    armRecognition(120);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsListening(false);
    isCallActiveRef.current = false;
    isSpeakingRef.current = false;
    setCallStatus("Call ended");
    clearRestartTimer();
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    pendingTranscriptRef.current = "";
    recognitionRef.current?.stop?.();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const closeChatPanel = () => {
    if (isCallActiveRef.current) {
      endCall();
    }
    setIsOpen(false);
  };

  const toggleChatPanel = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next && isCallActiveRef.current) {
        endCall();
      }
      return next;
    });
  };

  const interruptAndListen = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    lastSpokenTextRef.current = "";
    setCallStatus("Interrupted. Listening for you...");
    armRecognition(300);
  };

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoadingRef.current) return;

    const nextHistory = [...messagesRef.current, { role: "user" as const, content: trimmed }]
      .filter((message) => message.content.trim())
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);
    setCallStatus("Jarvis is thinking...");
    setShowDisclosure(false);
    setIsDisclosureOpen(false);

    try {
      const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
      const apiBaseUrl = isLocalhost
        ? (process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || "http://localhost:4000")
        : "https://mohit-unecha-s-portfolio-website.vercel.app";

      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: nextHistory }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();
      const replyText =
        data?.reply ||
        "Thanks for reaching out! We’ll wire this to a trained model soon.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyText,
        },
      ]);
      speakReply(replyText);
    } catch {
      const fallback = "Sorry, the chatbot is offline right now. Please try again later.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallback,
        },
      ]);
      speakReply(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleJarvisPrompt = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const prompt = customEvent.detail;
      if (!prompt) return;
      setIsOpen(true);
      void sendPrompt(prompt);
    };

    const handleJarvisVoiceStart = () => {
      startCall();
    };

    window.addEventListener("jarvis:prompt", handleJarvisPrompt);
    window.addEventListener("jarvis:start-voice", handleJarvisVoiceStart);
    return () => {
      if (isCallActiveRef.current) {
        endCall();
      }
      window.removeEventListener("jarvis:prompt", handleJarvisPrompt);
      window.removeEventListener("jarvis:start-voice", handleJarvisVoiceStart);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    await sendPrompt(input);
  };

  return (
    <div className="chatbot-panel fixed bottom-3 right-3 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:gap-3">
      {isOpen && (
        <div className={`relative flex max-h-[78vh] w-[min(94vw,390px)] flex-col overflow-hidden rounded-[2rem] border p-4 shadow-2xl backdrop-blur-xl sm:p-5 ${isDarkMode ? "border-emerald-300/20 bg-slate-950/95 shadow-emerald-500/10" : "border-blue-300/40 bg-white/95 shadow-blue-500/10"}`}>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/10 to-transparent" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`relative flex h-12 w-12 items-center justify-center rounded-full border text-lg font-bold ${isDarkMode ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100" : "border-blue-300/40 bg-blue-500/10 text-blue-700"}`}>
                J
                {isCallActive && (
                  <>
                    <span className={`absolute inset-0 rounded-full ${isSpeakingRef.current ? "animate-ping" : isListening ? "animate-pulse" : ""} ${isDarkMode ? "bg-emerald-400/20" : "bg-blue-400/20"}`} />
                    <span className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full ${isSpeakingRef.current || isListening ? "animate-pulse" : ""} ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                  </>
                )}
              </div>
              <div>
                <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {profile.agentName}
                </h3>
                <p className={`text-xs ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
                  {isCallActive ? "Voice call active" : "AI career assistant (beta)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeChatPanel}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${isDarkMode ? "border-white/10 text-slate-200 hover:text-white hover:bg-white/5" : "border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Close
              </button>
            </div>
          </div>

          {/* Status bar with waveform visualizer */}
          <div className={`relative mt-4 rounded-2xl border px-3 py-2 text-[11px] ${isDarkMode ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100" : "border-blue-300/30 bg-blue-500/10 text-blue-700"}`}>
            <div className="flex items-center justify-between gap-3">
              <span>{callStatus}</span>
              <div className="flex items-center gap-1.5">
                {(isListening || isSpeakingRef.current) && (
                  <div className="flex items-end gap-[2px] h-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`waveform-bar ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`}
                      />
                    ))}
                  </div>
                )}
                <span className={`text-[10px] font-medium ${isListening || isSpeakingRef.current ? "animate-pulse" : "opacity-70"}`}>
                  {isListening ? "Live" : isCallActive ? "On call" : "Idle"}
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 text-sm ${isDarkMode ? "text-slate-100" : "text-slate-700"}`}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed transition-all duration-300 ${
                  message.role === "user"
                    ? isDarkMode
                      ? "ml-auto bg-emerald-500/20 text-emerald-50 border border-emerald-400/10"
                      : "ml-auto bg-blue-500/20 text-blue-900 border border-blue-300/20"
                    : isDarkMode
                      ? "bg-white/10 border border-white/5"
                      : "bg-slate-100 border border-slate-200/50"
                }`}
                style={{ animation: `slide-up-fade 0.3s ease-out ${index * 0.05}s both` }}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isDarkMode ? "bg-white/10 border border-white/5" : "bg-slate-100 border border-slate-200/50"}`}>
                <div className="flex gap-1.5">
                  <span className={`typing-dot ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                  <span className={`typing-dot ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                  <span className={`typing-dot ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4 flex gap-2">
            {/* Voice call controls */}
            {isCallActive ? (
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={interruptAndListen}
                  disabled={isLoading}
                  className={`pointer-events-auto flex items-center justify-center rounded-full h-9 w-9 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSpeakingRef.current
                      ? isDarkMode ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300 shadow-lg shadow-cyan-500/30" : "bg-cyan-400 text-slate-900 hover:bg-cyan-300 shadow-lg shadow-cyan-500/30"
                      : isListening
                        ? isDarkMode ? "bg-emerald-400 text-slate-900 animate-pulse shadow-lg shadow-emerald-500/30" : "bg-blue-400 text-slate-900 animate-pulse shadow-lg shadow-blue-500/30"
                        : isDarkMode ? "border border-white/20 bg-white/10 text-white hover:bg-white/20" : "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  title={isSpeakingRef.current ? "Interrupt Jarvis" : "Tap to speak"}
                >
                  {isSpeakingRef.current ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  )}
                </button>

                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") handleSend(); }}
                  placeholder="Or type here..."
                  className={`pointer-events-auto flex-1 rounded-full border px-3 py-2 text-xs transition focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/10 bg-white/10 text-white placeholder:text-slate-200/70 focus:ring-emerald-300/60"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus:ring-blue-300/60"
                  }`}
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`pointer-events-auto rounded-full h-9 w-9 flex items-center justify-center text-xs font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDarkMode ? "bg-emerald-400 hover:bg-emerald-300" : "bg-blue-400 hover:bg-blue-300"
                  }`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>

                <button
                  type="button"
                  onClick={endCall}
                  className="pointer-events-auto flex items-center justify-center rounded-full h-9 w-9 bg-red-500 text-white transition-all duration-200 hover:bg-red-400 shadow-lg shadow-red-500/30"
                  title="End call"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={startCall}
                  disabled={isLoading}
                  className={`pointer-events-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDarkMode
                      ? "border border-emerald-300/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10"
                      : "border border-blue-400/40 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  Call
                </button>

                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") handleSend(); }}
                  placeholder="Ask about Mohit..."
                  className={`pointer-events-auto flex-1 rounded-full border px-3 py-2 text-xs transition focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/10 bg-white/10 text-white placeholder:text-slate-200/70 focus:ring-emerald-300/60"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus:ring-blue-300/60"
                  }`}
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`pointer-events-auto rounded-full px-4 py-2 text-xs font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDarkMode ? "bg-emerald-400 hover:bg-emerald-300" : "bg-blue-400 hover:bg-blue-300"
                  }`}
                >
                  {isLoading ? "..." : "Send"}
                </button>
              </>
            )}
          </div>

          <div className={`mt-3 flex items-center justify-between text-[10px] ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
            <span>{isCallActive ? "Jarvis voice on (call mode)" : "Text mode — Jarvis won't speak"}</span>
          </div>

          {showDisclosure && (
            <button
              type="button"
              onClick={() => setIsDisclosureOpen(true)}
              className={`mx-auto mt-4 block rounded-full border px-3 py-1 text-[10px] font-semibold transition ${isDarkMode ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              AI Disclosure
            </button>
          )}

          {isDisclosureOpen && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-[11px] leading-relaxed text-slate-200">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">AI Disclosure</span>
                  <button
                    type="button"
                    onClick={() => setIsDisclosureOpen(false)}
                    className="text-xs text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                This tool is powered by artificial intelligence and operates independently of Mohit. Mohit is not responsible for the content, outputs, or decisions generated by this AI. Users are encouraged to review and verify all information for accuracy before relying on it.
              </div>
            </div>
          )}

          <div className={`absolute -bottom-2 right-8 h-4 w-4 rotate-45 rounded-sm border ${isDarkMode ? "border-white/10 bg-slate-950/95" : "border-slate-300 bg-white"}`} />
        </div>
      )}

      <button
        type="button"
        onClick={toggleChatPanel}
        className={`pointer-events-auto flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition duration-300 ${
          isDarkMode
            ? "border-emerald-300/20 bg-emerald-400/90 hover:bg-emerald-300"
            : "border-blue-300/30 bg-blue-400/90 hover:bg-blue-300"
        }`}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
          {profile.agentName.charAt(0)}
          {isCallActive && <span className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full ${isDarkMode ? "bg-emerald-300" : "bg-blue-300"}`} />}
        </span>
        <span className="hidden sm:inline">Chat with {profile.agentName}</span>
        <span className="sm:hidden">Chat</span>
      </button>
    </div>
  );
}
