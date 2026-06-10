"use client";

import ChatbotPanel from "@/components/ChatbotPanel";
import { profile } from "@/lib/profile";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { PongGame, FlappyGame, Game2048, TetrisGame, BreakoutGame, MemoryMatchGame, SpaceInvadersGame, SimonSaysGame, TicTacToeGame, RaceGame, WhackAMoleGame, WordleGame, ZipGame } from "@/components/Games";

const KONAMI_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

type ToastItem = {
  id: number;
  title: string;
  detail: string;
  tone: "green" | "blue";
};

function CountUp({ end, decimals = 0, suffix = "", start }: { end: number; decimals?: number; suffix?: string; start: boolean }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const duration = 1800;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end]);

  const formatted = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return <>{formatted}{suffix}</>;
}

function SectionTitle({ eyebrow, title, sub, isDarkMode }: { eyebrow: string; title: string; sub?: string; isDarkMode: boolean }) {
  return (
    <div className="mb-14 text-center">
      <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.4em] ${isDarkMode ? "text-emerald-300/80" : "text-blue-600/80"}`}>
        {eyebrow}
      </p>
      <h2 className={`font-display text-3xl font-bold tracking-tight md:text-4xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        {title}
      </h2>
      <div className={`mx-auto mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r ${isDarkMode ? "from-emerald-400 to-cyan-400" : "from-sky-400 to-blue-600"}`} />
      {sub && (
        <p className={`mx-auto mt-5 max-w-2xl text-base leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function TimelineLabel({ t, isDarkMode }: { t: string; isDarkMode: boolean }) {
  const isCurrent = t.includes("Present");
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {t}
      {isCurrent && (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider ${
          isDarkMode ? "bg-emerald-400/15 text-emerald-300" : "bg-blue-100 text-blue-700"
        }`}>
          <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
          NOW
        </span>
      )}
    </span>
  );
}

export default function Home() {
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [displayedText, setDisplayedText] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingPhase, setGreetingPhase] = useState<"typing" | "pausing" | "erasing">("typing");
  const [zoomProgress, setZoomProgress] = useState(0);
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [isClickingCursor, setIsClickingCursor] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [rolePhase, setRolePhase] = useState<"typing" | "pausing" | "erasing">("typing");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [tiltCard, setTiltCard] = useState<{ id: string; x: number; y: number } | null>(null);
  const [githubContribs, setGithubContribs] = useState<{ date: string; level: number; count: number }[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [proModeUnlocked, setProModeUnlocked] = useState(true);
  const [isProMode, setIsProMode] = useState(true);
  const konamiRef = useRef(0);
  const toastIdRef = useRef(0);
  const arcadeModeToastShownRef = useRef(false);
  const easterEggToastShownRef = useRef(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [introLights, setIntroLights] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const introTimersRef = useRef<NodeJS.Timeout[]>([]);

  const skipIntro = () => {
    introTimersRef.current.forEach(clearTimeout);
    setIntroFading(true);
    if (typeof window !== "undefined") window.sessionStorage.setItem("introSeen", "1");
    setTimeout(() => setShowIntro(false), 500);
  };

  // F1 race-start intro — once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("introSeen")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShowIntro(true);
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setIntroLights(i), 320 * i));
    }
    timers.push(setTimeout(() => setLightsOut(true), 320 * 5 + 650));
    timers.push(setTimeout(() => setIntroFading(true), 320 * 5 + 1000));
    timers.push(setTimeout(() => {
      setShowIntro(false);
      window.sessionStorage.setItem("introSeen", "1");
    }, 320 * 5 + 1600));
    introTimersRef.current = timers;
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const roles = [
    "Product Manager",
    "Product Strategist",
    "Consultant",
    "Software Engineer",
    "PM/SWE Intern @ Microsoft",
    "AI Fellow @ Cornell Tech",
    "F1 Enthusiast",
    "Builder & Creator",
  ];
  const firstName = profile.name.split(" ")[0];
  const greetings = [
    `Hi, I'm ${firstName}.`,
    `Hola, soy ${firstName}.`,
    `Bonjour, je suis ${firstName}.`,
    `Ciao, sono ${firstName}.`,
    `Hallo, ich bin ${firstName}.`,
    `Olá, eu sou ${firstName}.`,
    `Namaste, main ${firstName} hoon.`,
    `こんにちは、${firstName}です。`,
    `안녕, 나는 ${firstName}.`,
    `你好，我是${firstName}。`,
  ];

  const handleCardTilt = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTiltCard({ id, x, y });
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handleSpotlight = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const spotColor = (dark: boolean) => (dark ? "rgba(52,211,153,0.16)" : "rgba(59,130,246,0.14)");

  const copyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profile.email);
      pushToast("Copied", profile.email, "green");
    }
  };

  const strengthsToShow = showAllStrengths ? profile.strengths : profile.strengths.slice(0, 4);

  const pushToast = (title: string, detail: string, tone: "green" | "blue") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, title, detail, tone }].slice(-4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3600);
  };

  const playVoiceIntro = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const introText = "Hey there! Welcome to Mohit oo-NEH-chah's corner of the internet. He's a product manager, strategist, and software engineer — currently a product management and software engineering intern at Microsoft, leading a team building an AI copilot on the Microsoft 365 Core team. He's also an AI fellow with Break Through Tech at Cornell Tech, a consultant at Rutgers Consulting Group, and leads technology at a nonprofit supporting women and children, with over one thousand volunteer hours at Hands of Hope. When he's not building or mentoring, you'll find him analyzing formula one race data. Feel free to explore his work — or chat with Jarvis to learn more!";
    const utterance = new SpeechSynthesisUtterance(introText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    const preferredVoice = window.speechSynthesis.getVoices().find((v) => /Samantha|Google US English|en-US/i.test(v.name));
    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
    pushToast("Playing", "Meet Mohit — voice intro", "blue");
  };

  useEffect(() => {
    const currentGreeting = greetings[greetingIndex];
    let timeout: NodeJS.Timeout;

    if (greetingPhase === "typing") {
      if (displayedText.length < currentGreeting.length) {
        timeout = setTimeout(() => setDisplayedText(currentGreeting.slice(0, displayedText.length + 1)), 40);
      } else {
        timeout = setTimeout(() => setGreetingPhase("pausing"), 600);
      }
    } else if (greetingPhase === "pausing") {
      timeout = setTimeout(() => setGreetingPhase("erasing"), 100);
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => setDisplayedText(displayedText.slice(0, -1)), 10);
      } else {
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
        setGreetingPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, greetingIndex, greetingPhase, greetings]);

  // Role rotator typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (rolePhase === "typing") {
      if (roleText.length < currentRole.length) {
        timeout = setTimeout(() => setRoleText(currentRole.slice(0, roleText.length + 1)), 35);
      } else {
        timeout = setTimeout(() => setRolePhase("pausing"), 1200);
      }
    } else if (rolePhase === "pausing") {
      timeout = setTimeout(() => setRolePhase("erasing"), 200);
    } else if (rolePhase === "erasing") {
      if (roleText.length > 0) {
        timeout = setTimeout(() => setRoleText(roleText.slice(0, -1)), 18);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setRolePhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [roleText, rolePhase, roleIndex]);

  // Visitor counter
  useEffect(() => {
    fetch("https://api.counterapi.dev/v1/mohitunecha-portfolio/visits/up")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.count === "number") setVisitorCount(data.count);
      })
      .catch(() => {});
  }, []);

  // Konami code easter egg
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiRef.current]) {
        konamiRef.current += 1;
        if (konamiRef.current === KONAMI_CODE.length) {
          setShowEasterEgg(true);
          konamiRef.current = 0;
        }
      } else {
        konamiRef.current = e.key === KONAMI_CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cmd+K command palette shortcut
  useEffect(() => {
    const handleCmdK = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
        setCmdSearch("");
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
        setRecruiterOpen(false);
      }
    };
    window.addEventListener('keydown', handleCmdK);
    return () => window.removeEventListener('keydown', handleCmdK);
  }, []);

  useEffect(() => {
    if (cmdPaletteOpen) {
      setTimeout(() => cmdInputRef.current?.focus(), 100);
    }
  }, [cmdPaletteOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlocked = window.localStorage.getItem("proModeUnlocked") === "1";
    if (unlocked) {
      setProModeUnlocked(true);
    }
  }, []);

  // GitHub contributions heatmap
  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/MohitUnecha?y=last')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data?.contributions)) setGithubContribs(data.contributions);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showGameSelector && !arcadeModeToastShownRef.current) {
      arcadeModeToastShownRef.current = true;
      pushToast("Unlocked", "Arcade mode opened", "blue");
    }
  }, [showGameSelector]);

  useEffect(() => {
    if (showEasterEgg && !easterEggToastShownRef.current) {
      easterEggToastShownRef.current = true;
      pushToast("Unlocked", "Konami secret discovered", "green");
      setProModeUnlocked(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("proModeUnlocked", "1");
      }
    }
  }, [showEasterEgg]);

  // Auto-refresh reCAPTCHA token every 12 minutes
  useEffect(() => {
    const refreshRecaptchaToken = () => {
      if (typeof window !== "undefined" && (window as any).grecaptcha) {
        (window as any).grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
          action: "refresh",
        });
      }
    };

    const interval = setInterval(refreshRecaptchaToken, 12 * 60 * 1000); // 12 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY > window.innerHeight * 0.8);
      
      // Calculate zoom progress based on scroll within the hero section
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / heroHeight, 1);
      setZoomProgress(progress);

      // Scroll progress bar
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) setScrollProgress(Math.round((window.scrollY / docHeight) * 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cursor tracker and interactive detection
  useEffect(() => {
    let mouseTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorX(e.clientX);
      setCursorY(e.clientY);
      setIsMouseMoving(true);

      // Check if cursor is over interactive elements
      const target = e.target as HTMLElement;
      const isClickable = target?.closest('button') || 
                          target?.closest('a') || 
                          target?.closest('input') ||
                          target?.closest('textarea') ||
                          target?.classList?.contains('interactive');
      setIsOverInteractive(!!isClickable);

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        setIsMouseMoving(false);
      }, 3000);
    };

    const handleMouseDown = () => {
      setIsClickingCursor(true);
    };

    const handleMouseUp = () => {
      setIsClickingCursor(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clearTimeout(mouseTimeout);
    };
  }, []);

  // Section fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
              setVisibleSections((prev) => new Set([...prev, sectionId]));
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  const pageClass = isDarkMode
    ? isProMode
      ? "bg-slate-950 text-white"
      : "bg-slate-950 text-white"
    : isProMode
      ? "bg-blue-50 text-slate-900"
      : "bg-slate-50 text-slate-900";
  const headerClass = isDarkMode
    ? "border-white/5 bg-slate-950/80"
    : "border-slate-200/70 bg-white/80";
  const navTextClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const sectionLabelClass = isDarkMode ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = isDarkMode ? "text-slate-300" : "text-slate-700";
  const subTextClass = isDarkMode ? "text-slate-200" : "text-slate-800";
  const cardClass = isDarkMode
    ? isProMode
      ? "border-emerald-300/30 bg-emerald-950/20"
      : "border-white/10 bg-white/5"
    : isProMode
      ? "border-blue-300 bg-blue-50/90"
      : "border-slate-200 bg-white";
  const cardHoverClass = isDarkMode
    ? isProMode
      ? "hover:border-emerald-300/50 hover:bg-emerald-900/20"
      : "hover:border-emerald-400/30 hover:bg-white/10"
    : isProMode
      ? "hover:border-blue-500/50 hover:bg-blue-100"
      : "hover:border-blue-500/40 hover:bg-blue-50";
  const accentTextClass = isDarkMode ? "text-emerald-300" : "text-blue-700";
  const roleColorClass = isDarkMode
    ? "bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent"
    : "bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent";
  const accentHoverTextClass = isDarkMode ? "hover:text-emerald-300" : "hover:text-blue-700";
  const accentBorderHoverClass = isDarkMode ? "hover:border-emerald-400/50" : "hover:border-blue-500/50";
  const accentBgHoverClass = isDarkMode ? "hover:bg-emerald-400/10" : "hover:bg-blue-50";
  const projectHoverClass = isDarkMode ? "group-hover:text-emerald-300" : "group-hover:text-blue-700";
  const buttonClass = isDarkMode
    ? "border-emerald-300 bg-emerald-500 text-white font-bold shadow-2xl shadow-emerald-500/70 hover:bg-emerald-400"
    : "border-blue-500 bg-blue-600 text-white font-bold shadow-2xl shadow-blue-600/70 hover:bg-blue-700";
  const overlayClass = isDarkMode ? "bg-black/90" : "bg-white/75";

  return (
    <div className={`min-h-screen noise-bg ${pageClass}`}>
      {isProMode && (
        <div className="pointer-events-none fixed inset-0 z-0 opacity-70" style={{
          background: isDarkMode
            ? "radial-gradient(circle at 18% 12%, rgba(16,185,129,0.2), transparent 34%), radial-gradient(circle at 82% 86%, rgba(34,211,238,0.15), transparent 36%)"
            : "radial-gradient(circle at 18% 12%, rgba(59,130,246,0.18), transparent 34%), radial-gradient(circle at 82% 86%, rgba(14,165,233,0.15), transparent 36%)",
        }} />
      )}

      {/* F1 race-start intro */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ${
            introFading ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          onClick={skipIntro}
        >
          <div className="flex gap-3 md:gap-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-10 w-10 rounded-full border-2 transition-all duration-150 md:h-14 md:w-14 ${
                  introLights > i && !lightsOut
                    ? "border-red-400 bg-red-500 shadow-[0_0_35px_rgba(239,68,68,0.85)]"
                    : "border-slate-700 bg-slate-900"
                }`}
              />
            ))}
          </div>
          <p className={`mt-10 font-mono text-[11px] uppercase tracking-[0.5em] transition-colors duration-300 ${
            lightsOut ? "text-emerald-300" : "text-slate-500"
          }`}>
            {lightsOut ? "Lights out and away we go" : "Starting grid"}
          </p>
          <p className="mt-4 text-[10px] tracking-widest text-slate-600">tap to skip</p>
        </div>
      )}

      {/* Scroll progress bar with F1 car */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-[70] h-[3px]">
        <div
          className={`h-full ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-sky-400 to-blue-500'}`}
          style={{ width: `${scrollProgress}%`, transition: 'width 0.15s ease-out' }}
        />
        {scrollProgress > 0 && (
          <span
            className="absolute -top-[11px] text-base leading-none"
            style={{
              left: `calc(${scrollProgress}% - 14px)`,
              transition: 'left 0.15s ease-out',
              transform: 'scaleX(-1)',
              filter: isDarkMode
                ? 'drop-shadow(0 0 6px rgba(52,211,153,0.9))'
                : 'drop-shadow(0 0 6px rgba(59,130,246,0.8))',
            }}
          >
            🏎️
          </span>
        )}
      </div>

      {/* Cursor Tracker Glow — hidden on touch/mobile */}
      <div
        className="pointer-events-none fixed z-40 hidden md:block"
        style={{
          left: `${cursorX}px`,
          top: `${cursorY}px`,
          opacity: isMouseMoving ? 1 : 0,
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.15s ease-out, width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className={`rounded-full blur-2xl ${
            isDarkMode ? "bg-emerald-400" : "bg-blue-400"
          }`}
          style={{ 
            width: isOverInteractive ? "60px" : "30px",
            height: isOverInteractive ? "60px" : "30px",
            boxShadow: isDarkMode 
              ? `0 0 ${isOverInteractive ? "80px" : "50px"} rgba(52, 211, 153, ${isOverInteractive ? 0.8 : 0.6})` 
              : `0 0 ${isOverInteractive ? "80px" : "50px"} rgba(59, 130, 246, ${isOverInteractive ? 0.8 : 0.6})`,
            transform: isClickingCursor ? "scale(1.4)" : "scale(1)",
            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>

      {/* Cursor Inner Circle — hidden on touch/mobile */}
      <div
        className="pointer-events-none fixed z-40 hidden md:block"
        style={{
          left: `${cursorX}px`,
          top: `${cursorY}px`,
          opacity: isMouseMoving ? 1 : 0,
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.3s ease-out",
        }}
      >
        <div
          className={`rounded-full border-2 ${
            isDarkMode ? "border-emerald-300" : "border-blue-500"
          }`}
          style={{
            width: isClickingCursor ? "20px" : "16px",
            height: isClickingCursor ? "20px" : "16px",
            transition: "width 0.2s ease-out, height 0.2s ease-out",
          }}
        />
      </div>

      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
          isHeaderVisible ? "opacity-100 shadow-lg" : "opacity-0 pointer-events-none"
        } ${headerClass}`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <a href="#home" className={`transition ${accentHoverTextClass}`}>
            <img src="/Logo.png" alt="Logo" className="h-8 w-auto md:h-10" />
          </a>
          <nav className={`flex items-center gap-3 text-xs font-medium md:gap-8 md:text-sm ${navTextClass}`}>
            <a className={`transition ${accentHoverTextClass}`} href="#about">
              About
            </a>
            <a className={`transition ${accentHoverTextClass}`} href="#experience">
              Experience
            </a>
            <a className={`transition ${accentHoverTextClass}`} href="#projects">
              Projects
            </a>
            <a className={`transition ${accentHoverTextClass}`} href="#contact">
              Contact
            </a>
            <button
              type="button"
              onClick={() => setRecruiterOpen(true)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 md:text-xs ${
                isDarkMode
                  ? "border-amber-300/50 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
                  : "border-amber-500/60 bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              ⚡ <span className="hidden sm:inline">For Recruiters</span><span className="sm:hidden">Hire</span>
            </button>
            <button
              type="button"
              onClick={() => { setCmdPaletteOpen(true); setCmdSearch(""); }}
              className={`hidden md:flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] transition-all duration-200 ${
                isDarkMode
                  ? "border-white/10 text-slate-400 hover:border-emerald-400/30 hover:text-emerald-300"
                  : "border-slate-300 text-slate-500 hover:border-blue-400/30 hover:text-blue-500"
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" /></svg>
              <kbd className="font-mono">⌘K</kbd>
            </button>
          </nav>
        </div>
      </header>

      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
        style={{
          backgroundImage: `url(${profile.heroBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "43% center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Color tint overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDarkMode 
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(59, 130, 246, 0.35) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
            transition: "background 0.3s ease-out",
          }}
        />
        
        {/* Solid black overlay - 80% translucent */}
        <div 
          className={`absolute inset-0 ${overlayClass}`}
          style={{
            transition: "opacity 0.5s ease-out",
          }}
        />
        
        {/* Animated background zoom effect */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${profile.heroBackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "43% center",
            transform: `scale(${1 + zoomProgress * 0.5})`,
            opacity: 1 - zoomProgress * 0.3,
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            filter: "grayscale(100%)",
          }}
        />

        {/* Aurora blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-blob left-[10%] top-[15%] h-72 w-72"
            style={{ background: isDarkMode ? "rgba(16,185,129,0.45)" : "rgba(59,130,246,0.3)" }}
          />
          <div
            className="aurora-blob bottom-[10%] right-[6%] h-96 w-96"
            style={{ background: isDarkMode ? "rgba(34,211,238,0.35)" : "rgba(14,165,233,0.28)", animationDelay: "4s" }}
          />
          <div
            className="aurora-blob left-[55%] top-[55%] h-64 w-64"
            style={{ background: isDarkMode ? "rgba(167,139,250,0.28)" : "rgba(99,102,241,0.22)", animationDelay: "8s" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center" style={{ opacity: 1 - zoomProgress * 2.5, transition: "opacity 0.3s ease-out" }}>
            <div className="relative mb-8 animate-float">
              {/* Orbiting tech badges */}
              <div
                className={`pointer-events-none absolute -inset-8 rounded-full border border-dashed animate-spin-slow ${
                  isDarkMode ? "border-emerald-300/30" : "border-blue-400/40"
                }`}
              >
                {[
                  { icon: "🐍", pos: "-top-4 left-1/2 -translate-x-1/2" },
                  { icon: "⚛️", pos: "top-1/2 -right-4 -translate-y-1/2" },
                  { icon: "🤖", pos: "-bottom-4 left-1/2 -translate-x-1/2" },
                  { icon: "📈", pos: "top-1/2 -left-4 -translate-y-1/2" },
                ].map((badge) => (
                  <span key={badge.icon} className={`absolute ${badge.pos}`}>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-lg backdrop-blur-sm animate-spin-reverse-slow ${
                        isDarkMode
                          ? "border-emerald-300/30 bg-slate-900/85"
                          : "border-blue-300/60 bg-white/90"
                      }`}
                    >
                      {badge.icon}
                    </span>
                  </span>
                ))}
              </div>
              <div
                className={`h-32 w-32 overflow-hidden rounded-full border-4 shadow-2xl sm:h-40 sm:w-40 md:h-48 md:w-48 ${
                  isDarkMode ? "border-emerald-400/40 shadow-emerald-500/20" : "border-blue-600/40 shadow-blue-500/20"
                }`}
                style={{ transition: "all 0.3s ease-out" }}
              >
                <img
                  src={profile.photoUrl}
                  alt={`${profile.name} headshot`}
                  className="h-full w-full object-cover"
                  style={{ filter: "none" }}
                />
              </div>
            </div>
            <h1 className={`font-display mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-gradient-text ${isDarkMode ? "bg-gradient-to-r from-emerald-300 via-cyan-200 to-emerald-400" : "bg-gradient-to-r from-sky-400 via-blue-300 to-sky-500"}`} style={{ backgroundSize: '200% 200%', transition: "all 0.3s ease-out" }}>
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>
            {/* Role rotator */}
            <p
              className={`mb-8 max-w-2xl text-lg font-light min-h-[2rem] sm:text-xl md:text-2xl ${isDarkMode ? bodyTextClass : "text-white"}`}
              style={{ transition: "all 0.3s ease-out" }}
            >
              <span className={`${roleColorClass} font-semibold`}>{roleText}</span>
              <span className="animate-pulse opacity-70">|</span>
            </p>
            {/* Open to opportunities badge */}
            <div className={`mb-6 flex items-center justify-center gap-2 rounded-full px-5 py-2.5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? "border border-emerald-300/70 bg-emerald-500/20 shadow-emerald-500/30 hover:shadow-emerald-500/50"
                : "border border-blue-300/70 bg-blue-500/25 shadow-blue-500/35 hover:shadow-blue-500/50"
            }`}>
              <div className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-80 ${isDarkMode ? "bg-emerald-300" : "bg-blue-300"}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-blue-400"}`} />
              </div>
              <a
                href="#contact"
                className={`text-base font-semibold transition hover:underline md:text-lg ${
                  isDarkMode
                    ? "text-emerald-100 drop-shadow-[0_0_8px_rgba(110,231,183,0.9)]"
                    : "text-blue-100 drop-shadow-[0_0_8px_rgba(147,197,253,0.9)]"
                }`}
              >
                Open to Opportunities
              </a>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={playVoiceIntro}
                className={`group relative overflow-hidden rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "border-cyan-300/60 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/20"
                    : "border-cyan-500 bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  Meet Mohit
                </span>
                <span className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full`} />
              </button>
              <button
                type="button"
                onClick={() => setRecruiterOpen(true)}
                className={`group relative overflow-hidden rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "border-amber-300/60 bg-amber-400/15 text-amber-100 hover:bg-amber-400/25 hover:shadow-lg hover:shadow-amber-500/20"
                    : "border-amber-500 bg-amber-100 text-amber-700 hover:bg-amber-200 hover:shadow-lg hover:shadow-amber-500/20"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  ⚡ Recruiter Snapshot
                </span>
                <span className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full`} />
              </button>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-5" style={{ transition: "all 0.3s ease-out" }}>
              <a
                href={`https://${profile.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-center rounded-full border-2 p-3.5 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${isDarkMode ? "border-emerald-500 bg-emerald-500/90 shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60" : "border-blue-500 bg-blue-500/90 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60"}`}
                aria-label="LinkedIn"
              >
                <img src="/LinkedinLogo.png" alt="LinkedIn" className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" style={{ filter: 'brightness(2.5)' }} />
              </a>
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-center rounded-full border-2 p-3.5 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${isDarkMode ? "border-emerald-500 bg-emerald-500/90 shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60" : "border-blue-500 bg-blue-500/90 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60"}`}
                aria-label="GitHub"
              >
                <img src="/Githublogo.png" alt="GitHub" className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" style={{ filter: 'brightness(2.8)' }} />
              </a>
            </div>
            <a
              href="#about"
              className={`mt-12 animate-bounce transition-all duration-300 ${accentHoverTextClass} ${sectionLabelClass}`}
              style={{ transition: "all 0.3s ease-out" }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </a>
          </div>
        </section>

        <main className="mx-auto w-full max-w-5xl px-4 pb-32 sm:px-6 md:px-8">
          <section id="about" className="py-24" style={{
            opacity: visibleSections.has('about') ? 1 : 0,
            transform: visibleSections.has('about') ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
          <SectionTitle eyebrow="01 · About" title="Building with purpose" isDarkMode={isDarkMode} />
          <div className={`mx-auto max-w-3xl space-y-6 text-lg leading-relaxed ${bodyTextClass}`}>
            {profile.summary.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl gap-6 text-center md:grid-cols-2">
            {strengthsToShow.map((strength) => (
              <div
                key={strength}
                className={`rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass} ${isDarkMode ? "glow-pulse-dark" : "glow-pulse-light"}`}
              >
                <p className={`font-medium ${subTextClass}`}>{strength}</p>
              </div>
            ))}
          </div>
          {profile.strengths.length > 4 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllStrengths((prev) => !prev)}
                className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-widest transition ${accentBorderHoverClass} ${buttonClass} ${accentHoverTextClass}`}
              >
                {showAllStrengths ? "See less" : "See more"}
              </button>
            </div>
          )}
        </section>

        <section id="impact" className="py-16" style={{
          opacity: visibleSections.has('impact') ? 1 : 0,
          transform: visibleSections.has('impact') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle eyebrow="02 · Impact" title="By the numbers" isDarkMode={isDarkMode} />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                onMouseMove={handleSpotlight}
                className={`spotlight-card rounded-2xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 ${cardClass} ${cardHoverClass}`}
                style={{ "--spot-color": spotColor(isDarkMode) } as React.CSSProperties}
              >
                <p className={`text-3xl font-bold tracking-tight md:text-4xl ${
                  isDarkMode
                    ? "bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"
                }`}>
                  <CountUp end={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix ?? ""} start={visibleSections.has('impact')} />
                </p>
                <p className={`mt-2 text-sm font-semibold ${subTextClass}`}>{stat.label}</p>
                <p className={`mt-1 text-xs leading-relaxed ${sectionLabelClass}`}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="py-24">
          <div
            style={{
              opacity: visibleSections.has('experience') ? 1 : 0,
              transform: visibleSections.has('experience') ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            <SectionTitle eyebrow="03 · Experience" title="Where I've been building" isDarkMode={isDarkMode} />
          </div>
          <div className="relative mx-auto max-w-5xl">
            {/* Center timeline line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block bg-gradient-to-b ${
              isDarkMode
                ? "from-emerald-400/70 via-cyan-400/40 to-transparent"
                : "from-blue-500/60 via-sky-400/40 to-transparent"
            }`} />
            
            {(showAllExperience ? profile.experience : profile.experience.slice(0, 4)).map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={`${item.company}-${item.role}`}
                  className="relative mb-12 last:mb-0"
                  style={{
                    opacity: visibleSections.has('experience') ? 1 : 0,
                    transform: visibleSections.has('experience')
                      ? 'translateY(0)'
                      : `translateY(30px)`,
                    transition: `all 0.6s ease-out ${index * 0.12}s`,
                  }}
                >
                  {/* Timeline dot - desktop */}
                  <div
                    className={`absolute left-1/2 top-6 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 md:block ${
                      isDarkMode ? "border-emerald-400 bg-slate-950" : "border-blue-500 bg-slate-50"
                    }`}
                    style={{
                      boxShadow: isDarkMode
                        ? "0 0 14px rgba(52,211,153,0.7)"
                        : "0 0 14px rgba(59,130,246,0.6)",
                    }}
                  />
                  
                  {/* Mobile: stacked layout */}
                  <div className="md:hidden">
                    <article className={`rounded-2xl border p-6 transition-all duration-300 ${cardClass} ${cardHoverClass}`}>
                      <p className={`mb-2 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                        <TimelineLabel t={item.timeline} isDarkMode={isDarkMode} />
                      </p>
                      <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {item.role}
                      </h3>
                      <p className={`text-base ${bodyTextClass}`}>{item.company}</p>
                      <p className={`text-sm ${sectionLabelClass}`}>{item.location}</p>
                      <ul className={`mt-3 ml-5 space-y-1.5 ${bodyTextClass}`}>
                        {item.highlights.map((h) => (
                          <li key={h} className="list-disc text-sm leading-relaxed">{h}</li>
                        ))}
                      </ul>
                    </article>
                  </div>

                  {/* Desktop: alternating left/right */}
                  <div className={`hidden md:grid md:grid-cols-2 md:gap-8`}>
                    {isLeft ? (
                      <>
                        <article className={`rounded-2xl border p-6 transition-all duration-300 text-right ${cardClass} ${cardHoverClass}`}>
                          <p className={`mb-2 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                            <TimelineLabel t={item.timeline} isDarkMode={isDarkMode} />
                          </p>
                          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {item.role}
                          </h3>
                          <p className={`text-base ${bodyTextClass}`}>{item.company}</p>
                          <p className={`text-sm ${sectionLabelClass}`}>{item.location}</p>
                          <ul className={`mt-3 space-y-1.5 ${bodyTextClass}`}>
                            {item.highlights.map((h) => (
                              <li key={h} className="text-sm leading-relaxed">{h}</li>
                            ))}
                          </ul>
                        </article>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <article className={`rounded-2xl border p-6 transition-all duration-300 ${cardClass} ${cardHoverClass}`}>
                          <p className={`mb-2 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                            <TimelineLabel t={item.timeline} isDarkMode={isDarkMode} />
                          </p>
                          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {item.role}
                          </h3>
                          <p className={`text-base ${bodyTextClass}`}>{item.company}</p>
                          <p className={`text-sm ${sectionLabelClass}`}>{item.location}</p>
                          <ul className={`mt-3 ml-5 space-y-1.5 ${bodyTextClass}`}>
                            {item.highlights.map((h) => (
                              <li key={h} className="list-disc text-sm leading-relaxed">{h}</li>
                            ))}
                          </ul>
                        </article>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {profile.experience.length > 4 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (showAllExperience) {
                    document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' });
                  }
                  setShowAllExperience((prev) => !prev);
                }}
                className={`group flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 ${buttonClass}`}
              >
                {showAllExperience ? "Show less" : `Show all ${profile.experience.length} roles`}
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${showAllExperience ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </section>

        <section id="projects" className="py-24" style={{
          opacity: visibleSections.has('projects') ? 1 : 0,
          transform: visibleSections.has('projects') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle eyebrow="04 · Projects" title="Things I've shipped" isDarkMode={isDarkMode} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((project, projectIndex) => {
              const isExpanded = expandedProject === project.name;
              const isFeatured = projectIndex === 0;
              return (
              <article
                key={project.name}
                className={`group interactive spotlight-card rounded-2xl border p-6 flex flex-col ${cardClass} ${cardHoverClass} ${isFeatured ? "md:col-span-2" : ""}`}
                onMouseMove={(e) => handleCardTilt(e, project.name)}
                onMouseLeave={() => setTiltCard(null)}
                style={{
                  transform: tiltCard?.id === project.name
                    ? `perspective(800px) rotateX(${tiltCard.y}deg) rotateY(${tiltCard.x}deg) scale(1.03)`
                    : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
                  transition: tiltCard?.id === project.name ? 'none' : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
                  boxShadow: tiltCard?.id === project.name
                    ? isDarkMode ? '0 25px 50px rgba(52,211,153,0.2), 0 0 0 1px rgba(52,211,153,0.15)' : '0 25px 50px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.1)'
                    : 'none',
                  cursor: 'pointer',
                  "--spot-color": spotColor(isDarkMode),
                } as React.CSSProperties}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"} ${projectHoverClass}`}
                  >
                    {project.name}
                  </h3>
                  {isFeatured && (
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isDarkMode
                        ? "border-amber-300/40 bg-amber-400/10 text-amber-300"
                        : "border-amber-400/60 bg-amber-50 text-amber-600"
                    }`}>
                      ★ Flagship
                    </span>
                  )}
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${bodyTextClass}`}>
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-full px-3 py-1 text-xs ${
                        isDarkMode ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 5 && (
                    <span className={`rounded-full px-3 py-1 text-xs ${isDarkMode ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>

                {/* Expandable technical details */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isExpanded ? '600px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <div className="mt-4 space-y-3">
                    {isExpanded && project.stack.length > 5 && (
                      <div className="flex flex-wrap gap-2">
                        {project.stack.slice(5).map((tech) => (
                          <span
                            key={tech}
                            className={`rounded-full px-3 py-1 text-xs ${
                              isDarkMode ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accentTextClass}`}>Technical Details</p>
                      <ul className={`space-y-1.5 ${bodyTextClass}`}>
                        {project.technicalDetails.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 text-xs leading-relaxed">
                            <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedProject(isExpanded ? null : project.name);
                    }}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      isDarkMode
                        ? "border-white/10 hover:border-emerald-400/30 hover:bg-white/5 text-slate-300"
                        : "border-slate-200 hover:border-blue-400/30 hover:bg-blue-50 text-slate-600"
                    }`}
                  >
                    {isExpanded ? "Less Info" : "More Info"}
                    <svg
                      className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${accentBorderHoverClass} ${accentBgHoverClass} ${buttonClass}`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    {project.linkLabel || "View Repository"}
                  </a>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        </section>

        <section id="education" className="py-24" style={{
          opacity: visibleSections.has('education') ? 1 : 0,
          transform: visibleSections.has('education') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle eyebrow="05 · Education" title="Foundations" isDarkMode={isDarkMode} />
          <div className="mx-auto max-w-4xl space-y-8">
            {profile.education.map((school) => (
              <article
                key={school.school}
                className={`group rounded-2xl border p-6 transition-all duration-300 ${cardClass} ${cardHoverClass}`}
                onMouseMove={(e) => handleCardTilt(e, school.school)}
                onMouseLeave={() => setTiltCard(null)}
                style={{
                  transform: tiltCard?.id === school.school
                    ? `perspective(800px) rotateX(${tiltCard.y}deg) rotateY(${tiltCard.x}deg) scale(1.02)`
                    : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
                  transition: tiltCard?.id === school.school ? 'none' : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
                  boxShadow: tiltCard?.id === school.school
                    ? isDarkMode ? '0 25px 50px rgba(52,211,153,0.15), 0 0 0 1px rgba(52,211,153,0.1)' : '0 25px 50px rgba(59,130,246,0.1), 0 0 0 1px rgba(59,130,246,0.08)'
                    : 'none',
                }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {school.school}
                  </h3>
                  <p className={`text-sm font-medium uppercase tracking-wider ${accentTextClass}`}>
                    {school.timeline}
                  </p>
                </div>
                <p className={`mt-2 text-lg ${bodyTextClass}`}>{school.degree}</p>
                {school.gpa && (
                  <p className={`mt-1 text-sm font-semibold ${accentTextClass}`}>GPA: {school.gpa}</p>
                )}
                {school.details && (
                  <ul className={`mt-4 space-y-2 ${bodyTextClass}`}>
                    {school.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="programs" className="py-24" style={{
          opacity: visibleSections.has('programs') ? 1 : 0,
          transform: visibleSections.has('programs') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle
            eyebrow="06 · Programs"
            title="Programs & fellowships"
            sub={`Selected for ${profile.programs.length}+ competitive early-career programs across tech, finance, and consulting.`}
            isDarkMode={isDarkMode}
          />
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.programs.map((program) => (
              <div
                key={`${program.org}-${program.name}`}
                onMouseMove={handleSpotlight}
                className={`group spotlight-card rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${cardClass} ${cardHoverClass}`}
                style={{ "--spot-color": spotColor(isDarkMode) } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {program.org}
                  </p>
                  <span className={`flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    isDarkMode
                      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-300"
                      : "border-blue-300/50 bg-blue-50 text-blue-700"
                  }`}>
                    {program.year}
                  </span>
                </div>
                <p className={`mt-1 text-sm font-medium ${accentTextClass}`}>{program.name}</p>
                <p className={`mt-2 text-xs leading-relaxed ${bodyTextClass}`}>{program.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="volunteering" className="py-24" style={{
          opacity: visibleSections.has('volunteering') ? 1 : 0,
          transform: visibleSections.has('volunteering') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle
            eyebrow="07 · Community"
            title="Volunteering & impact"
            sub="Community service isn't a side project — it's the core of how I lead with empathy."
            isDarkMode={isDarkMode}
          />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {profile.volunteering.map((vol) => (
              <div
                key={`${vol.org}-${vol.role}`}
                onMouseMove={handleSpotlight}
                className={`spotlight-card rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${cardClass} ${cardHoverClass}`}
                style={{ "--spot-color": spotColor(isDarkMode) } as React.CSSProperties}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                  isDarkMode ? "bg-emerald-500/15 text-emerald-300" : "bg-blue-100 text-blue-600"
                }`}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{vol.role}</h3>
                <p className={`text-sm font-medium ${accentTextClass}`}>{vol.org}</p>
                <p className={`mt-1 text-xs uppercase tracking-wider ${sectionLabelClass}`}>{vol.timeline}</p>
                <p className={`mt-3 text-sm leading-relaxed ${bodyTextClass}`}>{vol.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="py-16" style={{
          opacity: visibleSections.has('skills') ? 1 : 0,
          transform: visibleSections.has('skills') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle eyebrow="08 · Skills" title="My toolkit" isDarkMode={isDarkMode} />

          {/* Infinite skills marquee */}
          <div
            className="relative mb-12 overflow-hidden py-1"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
          >
            <div className="marquee-track items-center gap-3 pr-3">
              {(() => {
                const allSkills = [...profile.skills.engineering, ...profile.skills.product, ...profile.skills.tools];
                return [...allSkills, ...allSkills].map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium ${
                      isDarkMode
                        ? "border-emerald-300/20 bg-emerald-500/5 text-slate-200"
                        : "border-blue-300/50 bg-blue-50/80 text-slate-700"
                    }`}
                  >
                    {skill}
                  </span>
                ));
              })()}
            </div>
          </div>
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${accentTextClass}`}>
                Product
              </p>
              <div className="flex flex-wrap gap-3">
                {profile.skills.product.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      isDarkMode
                        ? "border-white/10 bg-white/5 text-slate-300"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${accentTextClass}`}>
                Engineering
              </p>
              <div className="flex flex-wrap gap-3">
                {profile.skills.engineering.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      isDarkMode
                        ? "border-white/10 bg-white/5 text-slate-300"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className={`mb-4 text-xs font-semibold uppercase tracking-wider ${accentTextClass}`}>
                Tools
              </p>
              <div className="flex flex-wrap gap-3">
                {profile.skills.tools.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      isDarkMode
                        ? "border-white/10 bg-white/5 text-slate-300"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PM Spec Sheet — hidden for now, data preserved in profile.ts
        <section id="pm-spec" className="py-24" style={{
          opacity: visibleSections.has('pm-spec') ? 1 : 0,
          transform: visibleSections.has('pm-spec') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <h2 className={`mb-6 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Product Manager Spec Sheet
          </h2>
          <p className={`mx-auto mb-16 max-w-3xl text-center text-lg leading-relaxed ${bodyTextClass}`}>
            {profile.pmSpecSheet.vision}
          </p>

          <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
            {profile.pmSpecSheet.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className={`rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass}`}
              >
                <h3 className={`mb-4 text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {pillar.title}
                </h3>
                <ul className={`space-y-2 ${bodyTextClass}`}>
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed">
                      <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-blue-500"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <h3 className={`mb-8 text-center text-xs font-semibold uppercase tracking-wider ${accentTextClass}`}>
              Case Studies
            </h3>
            <div className="space-y-8">
              {profile.pmSpecSheet.caseStudies.map((cs) => (
                <div
                  key={cs.product}
                  className={`rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                    <h4 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {cs.product}
                    </h4>
                    <span className={`text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                      {cs.role}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${sectionLabelClass}`}>Problem</span>
                      <p className={`mt-1 text-sm leading-relaxed ${bodyTextClass}`}>{cs.problem}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${sectionLabelClass}`}>Approach</span>
                      <p className={`mt-1 text-sm leading-relaxed ${bodyTextClass}`}>{cs.approach}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${sectionLabelClass}`}>Outcome</span>
                      <p className={`mt-1 text-sm leading-relaxed ${accentTextClass} font-medium`}>{cs.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* GitHub Activity Heatmap */}
        <section id="github-activity" className="py-16" style={{
          opacity: visibleSections.has('github-activity') ? 1 : 0,
          transform: visibleSections.has('github-activity') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <SectionTitle eyebrow="09 · Open Source" title="Always shipping" isDarkMode={isDarkMode} />
          <p className={`-mt-8 mb-8 text-center text-xs ${sectionLabelClass}`}>
            Last 52 Weeks •{" "}
            <a href="https://github.com/MohitUnecha" target="_blank" rel="noopener noreferrer" className={`underline decoration-dotted ${accentTextClass}`}>
              @MohitUnecha
            </a>
          </p>
          {githubContribs.length > 0 ? (
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-[3px] mx-auto w-fit">
                {Array.from({ length: Math.ceil(githubContribs.length / 7) }, (_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[3px]">
                    {githubContribs.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => {
                      const colors = isDarkMode
                        ? ['bg-white/5 border border-white/5', 'bg-emerald-900/70', 'bg-emerald-700', 'bg-emerald-500', 'bg-emerald-400']
                        : ['bg-slate-100 border border-slate-200', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-600'];
                      return (
                        <div
                          key={day.date}
                          title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                          className={`h-[11px] w-[11px] rounded-[2px] ${colors[day.level]}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={`text-center text-sm ${sectionLabelClass} animate-pulse`}>Loading...</p>
          )}
        </section>

        <section id="contact" className="py-24" style={{
          opacity: visibleSections.has('contact') ? 1 : 0,
          transform: visibleSections.has('contact') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <div className="mx-auto max-w-2xl px-2 sm:px-4 md:px-8">
            <SectionTitle
              eyebrow="10 · Contact"
              title="Let's build something together"
              sub="I'd love to collaborate, chat about opportunities, or mentor together."
              isDarkMode={isDarkMode}
            />

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormStatus("loading");
                try {
                  // Get reCAPTCHA token only if properly configured
                  let recaptchaToken = "";
                  if (
                    typeof window !== "undefined" &&
                    (window as any).grecaptcha &&
                    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
                    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== "your-recaptcha-site-key-here"
                  ) {
                    recaptchaToken = await (window as any).grecaptcha.execute(
                      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                      { action: "submit" }
                    );
                  }

                  const response = await fetch("https://mohit-unecha-s-portfolio-website.vercel.app/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, recaptchaToken }),
                  });
                  
                  if (response.ok) {
                    setFormStatus("success");
                    setFormData({ name: "", email: "", subject: "", message: "" });
                    setTimeout(() => setFormStatus("idle"), 3000);
                  } else {
                    const errorData = await response.json();
                    console.error("Form error:", errorData);
                    setFormStatus("error");
                    setTimeout(() => setFormStatus("idle"), 3000);
                  }
                } catch (error) {
                  console.error("Form submission error:", error);
                  setFormStatus("error");
                  setTimeout(() => setFormStatus("idle"), 3000);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={formStatus === "loading"}
                  className={`interactive rounded-lg border px-4 py-3 text-sm transition ${
                    isDarkMode
                      ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                      : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                  } focus:outline-none focus:ring-2`}
                  style={{
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-out'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 0 20px rgba(52, 211, 153, 0.3)'
                      : '0 0 20px rgba(59, 130, 246, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={formStatus === "loading"}
                  className={`interactive rounded-lg border px-4 py-3 text-sm transition ${
                    isDarkMode
                      ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                      : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                  } focus:outline-none focus:ring-2`}
                  style={{
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-out'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 0 20px rgba(52, 211, 153, 0.3)'
                      : '0 0 20px rgba(59, 130, 246, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                disabled={formStatus === "loading"}
                className={`interactive w-full rounded-lg border px-4 py-3 text-sm transition ${
                  isDarkMode
                    ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                    : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-2`}
                style={{
                  boxShadow: 'none',
                  transition: 'all 0.3s ease-out'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 0 20px rgba(52, 211, 153, 0.3)'
                    : '0 0 20px rgba(59, 130, 246, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                disabled={formStatus === "loading"}
                rows={5}
                className={`interactive w-full rounded-lg border px-4 py-3 text-sm transition ${
                  isDarkMode
                    ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                    : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-2`}
                style={{
                  boxShadow: 'none',
                  transition: 'all 0.3s ease-out'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 0 20px rgba(52, 211, 153, 0.3)'
                    : '0 0 20px rgba(59, 130, 246, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              <button
                type="submit"
                disabled={formStatus === "loading"}
                className={`w-full rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  formStatus === "loading"
                    ? isDarkMode
                      ? "cursor-not-allowed border-slate-600 bg-slate-800 text-slate-400"
                      : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500"
                    : `${accentBorderHoverClass} ${accentBgHoverClass} ${buttonClass}`
                }`}
              >
                {formStatus === "loading" ? "Sending..." : formStatus === "success" ? "Sent!" : formStatus === "error" ? "Error - Try Again" : "Send Message"}
              </button>
            </form>
          </div>
        </section>
        </main>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowEasterEgg(false)}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[10, 18, 24, 31, 38, 45, 52, 59, 66, 73, 80, 87].map((left, idx) => (
              <span
                key={`rain-${left}`}
                className="emoji-rain"
                style={{
                  left: `${left}%`,
                  animationDelay: `${idx * 0.22}s`,
                  animationDuration: `${2.4 + (idx % 4) * 0.4}s`,
                  opacity: 0.7,
                }}
              >
                {idx % 3 === 0 ? "🎉" : idx % 3 === 1 ? "🥳" : "✨"}
              </span>
            ))}
          </div>
          <div
            className={`secret-pop-in relative mx-4 w-[92vw] max-w-md rounded-3xl border-2 p-6 text-center shadow-2xl md:p-10 ${
              isDarkMode
                ? 'border-emerald-400/60 bg-slate-900 shadow-emerald-500/30'
                : 'border-blue-400/60 bg-white shadow-blue-500/30'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 text-5xl md:text-6xl">🎮</div>
            <h2 className={`mb-3 text-2xl font-bold md:text-3xl ${isDarkMode ? 'text-emerald-300' : 'text-blue-600'}`}>
              Congrats! You found the secret!
            </h2>
            <p className={`mb-2 text-sm md:text-base ${bodyTextClass}`}>
              Welcome to the inner circle. Mohit would be impressed.
            </p>
            <p className={`mb-6 text-xs md:text-sm ${sectionLabelClass}`}>↑↑↓↓←→←→BA — classic.</p>
            <button
              onClick={() => setShowEasterEgg(false)}
              className={`rounded-full px-7 py-2.5 text-sm font-semibold transition md:text-base ${buttonClass}`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Recruiter Snapshot */}
      {recruiterOpen && (
        <div
          className="fixed inset-0 z-[115] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() => setRecruiterOpen(false)}
        >
          <div
            className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 shadow-2xl ${
              isDarkMode
                ? "border-amber-300/30 bg-slate-950 shadow-amber-500/10"
                : "border-amber-400/40 bg-white shadow-amber-500/10"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header band */}
            <div className={`relative overflow-hidden px-6 pb-6 pt-7 md:px-8 ${
              isDarkMode ? "bg-gradient-to-br from-emerald-500/15 via-transparent to-amber-400/10" : "bg-gradient-to-br from-blue-100 via-transparent to-amber-50"
            }`}>
              <button
                onClick={() => setRecruiterOpen(false)}
                className={`absolute right-5 top-5 text-2xl font-bold transition hover:rotate-90 hover:scale-110 ${
                  isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-900"
                }`}
                aria-label="Close"
              >
                ×
              </button>
              <p className={`mb-4 text-[10px] font-bold uppercase tracking-[0.4em] ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}>
                ⚡ The 10-Second Snapshot
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className={`h-16 w-16 rounded-full border-2 object-cover md:h-20 md:w-20 ${
                    isDarkMode ? "border-emerald-400/50" : "border-blue-500/50"
                  }`}
                />
                <div>
                  <h2 className={`font-display text-2xl font-bold md:text-3xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {profile.name}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    SWE/PM Intern @ Microsoft · CS + Econ @ Rutgers &apos;28
                  </p>
                  <p className={`mt-1 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    📍 NYC Metro / Redmond, WA · {profile.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8">
              {/* Key stats */}
              <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { v: "3.9", l: "GPA · Dean's List ×3" },
                  { v: "2×", l: "Hackathon wins" },
                  { v: "10+", l: "Selective programs" },
                  { v: "1,050+", l: "Volunteer hours" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className={`rounded-xl border p-3 text-center ${
                      isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className={`font-display text-xl font-bold ${isDarkMode ? "text-emerald-300" : "text-blue-600"}`}>{s.v}</p>
                    <p className={`mt-0.5 text-[10px] leading-tight ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Why hire */}
              <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? "text-emerald-300/80" : "text-blue-600/80"}`}>
                Why you should talk to me
              </p>
              <ul className={`mb-6 space-y-2.5 text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {[
                  <span key="ms"><strong>Shipping AI at Microsoft right now</strong> — leading a team building Headroom Copilot on M365 Core: natural-language telemetry querying, targeting 30–50% faster insights.</span>,
                  <span key="ai"><strong>AI Fellow @ Cornell Tech</strong> (Break Through Tech, 5,000+ applicants) + PayPal Career Academy + Vanguard North Star Fellow.</span>,
                  <span key="hack"><strong>2× hackathon winner</strong> — Barclays Data Hackathon (AI stock predictor) and SignalForge datathon, both built in 48 hours.</span>,
                  <span key="lead"><strong>Leads with empathy</strong> — Tech Lead at nonprofit Samaya Global, 1,050+ volunteer hours, 250+ students mentored.</span>,
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${isDarkMode ? "bg-amber-300" : "bg-amber-500"}`} />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Program strip */}
              <div className={`mb-6 flex flex-wrap gap-1.5 text-[10px] font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                {["Microsoft", "Goldman Sachs", "Capital One", "BCG", "Bain", "Oracle", "PayPal", "Vanguard", "Cornell Tech", "EY", "BNY Mellon"].map((org) => (
                  <span
                    key={org}
                    className={`rounded-full border px-2.5 py-1 ${isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
                  >
                    {org}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={copyEmail}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all duration-200 hover:scale-[1.03] ${
                    isDarkMode
                      ? "border-emerald-300/50 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
                      : "border-blue-400 bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  📋 Copy Email
                </button>
                <a
                  href={`https://${profile.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-xl border px-3 py-2.5 text-center text-xs font-bold transition-all duration-200 hover:scale-[1.03] ${
                    isDarkMode ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  💼 LinkedIn
                </a>
                <a
                  href={`https://${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-xl border px-3 py-2.5 text-center text-xs font-bold transition-all duration-200 hover:scale-[1.03] ${
                    isDarkMode ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  💻 GitHub
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setRecruiterOpen(false);
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all duration-200 hover:scale-[1.03] ${
                    isDarkMode ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  ✉️ Message Me
                </button>
              </div>

              <p className={`mt-5 text-center text-[10px] italic ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                Designed for busy recruiters — the full story is one scroll away. 🏎️
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette (Cmd+K) */}
      {cmdPaletteOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          onClick={() => setCmdPaletteOpen(false)}
        >
          <div
            className={`w-[min(92vw,540px)] rounded-2xl border shadow-2xl overflow-hidden ${
              isDarkMode
                ? "border-emerald-300/20 bg-slate-950/98 shadow-emerald-500/10"
                : "border-blue-300/40 bg-white/98 shadow-blue-500/10"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center gap-3 border-b px-4 py-3 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
              <svg className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? "text-emerald-400" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                ref={cmdInputRef}
                type="text"
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
                placeholder="Search sections, actions, or ask Jarvis..."
                className={`flex-1 bg-transparent text-sm outline-none ${isDarkMode ? "text-white placeholder:text-slate-400" : "text-slate-900 placeholder:text-slate-500"}`}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setCmdPaletteOpen(false);
                  if (e.key === 'Enter') {
                    const q = cmdSearch.toLowerCase();
                    const commands = [
                      { keywords: ['about', 'bio', 'summary', 'who'], action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['experience', 'work', 'jobs', 'career', 'microsoft'], action: () => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['project', 'build', 'f1', 'every lap', 'signalforge'], action: () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['contact', 'email', 'reach', 'message', 'hire'], action: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['skill', 'tech', 'stack', 'python', 'react'], action: () => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['education', 'rutgers', 'school', 'degree'], action: () => document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['program', 'fellowship', 'goldman', 'capital one', 'bcg', 'paypal', 'vanguard', 'cornell'], action: () => document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['volunteer', 'impact', 'community', 'hands of hope', 'nonprofit'], action: () => document.querySelector('#volunteering')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['stats', 'numbers', 'metrics'], action: () => document.querySelector('#impact')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['recruiter', 'snapshot', 'hire', 'resume', 'cv'], action: () => setRecruiterOpen(true) },
                      { keywords: ['github', 'contrib', 'activity', 'heatmap'], action: () => document.querySelector('#github-activity')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['game', 'play', 'arcade', 'fun'], action: () => setShowGameSelector(true) },
                      { keywords: ['dark', 'light', 'theme', 'mode'], action: () => setIsDarkMode((prev) => !prev) },
                      { keywords: ['top', 'home', 'hero', 'start'], action: () => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['linkedin'], action: () => window.open(`https://${profile.linkedIn}`, '_blank') },
                      { keywords: ['resume', 'cv', 'pdf'], action: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) },
                      { keywords: ['voice', 'intro', 'jarvis', 'call'], action: () => playVoiceIntro() },
                    ];
                    const match = commands.find((cmd) => cmd.keywords.some((kw) => q.includes(kw)));
                    if (match) {
                      match.action();
                    } else if (q.length > 0) {
                      // Send to Jarvis as a question
                      window.dispatchEvent(new CustomEvent("jarvis:prompt", { detail: cmdSearch }));
                    }
                    setCmdPaletteOpen(false);
                  }
                }}
              />
              <kbd className={`hidden sm:inline rounded border px-1.5 py-0.5 text-[10px] font-mono ${isDarkMode ? "border-white/10 text-slate-400" : "border-slate-300 text-slate-500"}`}>ESC</kbd>
            </div>
            <div className={`max-h-[50vh] overflow-y-auto px-2 py-2`}>
              {[
                { icon: '⚡', label: 'Recruiter Snapshot', desc: 'The 10-second hiring brief', keywords: ['recruiter', 'snapshot', 'hire', 'resume', 'cv'] },
                { icon: '👤', label: 'About Me', desc: 'Bio & strengths', keywords: ['about', 'bio', 'summary', 'who'] },
                { icon: '💼', label: 'Experience', desc: 'Work history & roles', keywords: ['experience', 'work', 'jobs', 'career', 'microsoft'] },
                { icon: '🚀', label: 'Projects', desc: 'What I\'ve built', keywords: ['project', 'build', 'f1', 'every lap'] },
                { icon: '📬', label: 'Contact', desc: 'Get in touch', keywords: ['contact', 'email', 'reach', 'message', 'hire'] },
                { icon: '⚡', label: 'Skills', desc: 'Tech stack & tools', keywords: ['skill', 'tech', 'stack', 'python', 'react'] },
                { icon: '🎓', label: 'Education', desc: 'Rutgers CS + Econ', keywords: ['education', 'rutgers', 'school', 'degree'] },
                { icon: '🏆', label: 'Programs & Fellowships', desc: 'Goldman, Capital One, BCG & more', keywords: ['program', 'fellowship', 'goldman', 'capital one', 'bcg', 'paypal', 'vanguard', 'cornell'] },
                { icon: '❤️', label: 'Volunteering & Impact', desc: '1,050+ hours of community service', keywords: ['volunteer', 'impact', 'community', 'hands of hope'] },
                { icon: '🎮', label: 'Games Arcade', desc: 'Play 14 mini-games', keywords: ['game', 'play', 'arcade', 'fun'] },
                { icon: '🎨', label: 'Toggle Theme', desc: 'Switch dark/light mode', keywords: ['dark', 'light', 'theme', 'mode'] },
                { icon: '🎤', label: 'Voice Intro', desc: 'Hear Jarvis introduce Mohit', keywords: ['voice', 'intro', 'jarvis', 'call'] },
                { icon: '🔗', label: 'Open LinkedIn', desc: 'View professional profile', keywords: ['linkedin'] },
                { icon: '🏠', label: 'Back to Top', desc: 'Return to hero section', keywords: ['top', 'home', 'hero', 'start'] },
              ]
                .filter((item) => {
                  if (!cmdSearch) return true;
                  const q = cmdSearch.toLowerCase();
                  return item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.keywords.some((kw) => kw.includes(q));
                })
                .map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                      isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
                    }`}
                    onClick={() => {
                      const q = item.label.toLowerCase();
                      if (q.includes('recruiter')) setRecruiterOpen(true);
                      else if (q.includes('theme') || q.includes('toggle')) setIsDarkMode((prev) => !prev);
                      else if (q.includes('games')) setShowGameSelector(true);
                      else if (q.includes('voice')) playVoiceIntro();
                      else if (q.includes('linkedin')) window.open(`https://${profile.linkedIn}`, '_blank');
                      else if (q.includes('top')) document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                      else {
                        const sectionMap: Record<string, string> = { 'About Me': '#about', 'Experience': '#experience', 'Projects': '#projects', 'Contact': '#contact', 'Skills': '#skills', 'Education': '#education', 'Programs & Fellowships': '#programs', 'Volunteering & Impact': '#volunteering' };
                        const anchor = sectionMap[item.label];
                        if (anchor) document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
                      }
                      setCmdPaletteOpen(false);
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.label}</p>
                      <p className={`text-xs truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{item.desc}</p>
                    </div>
                  </button>
                ))}
              {cmdSearch && (
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                    isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("jarvis:prompt", { detail: cmdSearch }));
                    setCmdPaletteOpen(false);
                  }}
                >
                  <span className="text-lg">🤖</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>Ask Jarvis: &ldquo;{cmdSearch}&rdquo;</p>
                    <p className={`text-xs truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Get an AI-powered answer</p>
                  </div>
                </button>
              )}
            </div>
            <div className={`border-t px-4 py-2 text-[10px] flex items-center justify-between ${isDarkMode ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-400"}`}>
              <span>Navigate with ↑↓ • Select with ↵</span>
              <span className="flex items-center gap-1">
                <kbd className={`rounded border px-1 py-0.5 font-mono ${isDarkMode ? "border-white/10" : "border-slate-300"}`}>⌘</kbd>
                <kbd className={`rounded border px-1 py-0.5 font-mono ${isDarkMode ? "border-white/10" : "border-slate-300"}`}>K</kbd>
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes emojiRain {
          0% {
            transform: translateY(-20vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }

        @keyframes secretPopIn {
          0% {
            transform: scale(0.82) translateY(18px);
            opacity: 0;
          }
          70% {
            transform: scale(1.04) translateY(-2px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .emoji-rain {
          position: absolute;
          top: -12vh;
          font-size: 1.55rem;
          animation-name: emojiRain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.35));
        }

        .secret-pop-in {
          animation: secretPopIn 0.5s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-pop {
          animation: toastIn 0.28s ease-out;
        }
      `}</style>

      <div className="pointer-events-none fixed right-3 top-16 z-[95] flex w-[min(92vw,320px)] flex-col gap-2 md:right-6 md:top-20">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-pop rounded-xl border px-3 py-2 text-xs backdrop-blur-md ${
              toast.tone === "green"
                ? "border-emerald-300/50 bg-emerald-500/25 text-emerald-50"
                : "border-blue-300/50 bg-blue-500/25 text-blue-50"
            }`}
          >
            <p className="font-semibold">{toast.title}</p>
            <p className="opacity-90">{toast.detail}</p>
          </div>
        ))}
      </div>

      <footer className={`relative border-t ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-8">
          <div className="grid gap-10 text-center sm:text-left md:grid-cols-3">
            {/* Brand */}
            <div>
              <p className={`font-display text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Mohit Unecha
              </p>
              <p className={`mt-2 text-sm leading-relaxed ${bodyTextClass}`}>
                Building at the intersection of software, product, and impact. Currently shipping AI at Microsoft.
              </p>
              <div className="mt-4 flex justify-center gap-3 sm:justify-start">
                <a
                  href={`https://${profile.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${
                    isDarkMode ? "border-white/15 bg-white/5 hover:border-emerald-400/50" : "border-slate-300 bg-white hover:border-blue-400"
                  }`}
                >
                  <img src="/LinkedinLogo.png" alt="LinkedIn" className="h-4 w-4" style={{ filter: isDarkMode ? "brightness(2.5)" : "none" }} />
                </a>
                <a
                  href={`https://${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${
                    isDarkMode ? "border-white/15 bg-white/5 hover:border-emerald-400/50" : "border-slate-300 bg-white hover:border-blue-400"
                  }`}
                >
                  <img src="/Githublogo.png" alt="GitHub" className="h-4 w-4" style={{ filter: isDarkMode ? "brightness(2.8)" : "none" }} />
                </a>
                <a
                  href="mailto:contact@mohitunecha.com"
                  aria-label="Email"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${
                    isDarkMode ? "border-white/15 bg-white/5 text-slate-300 hover:border-emerald-400/50" : "border-slate-300 bg-white text-slate-600 hover:border-blue-400"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.25em] ${sectionLabelClass}`}>Explore</p>
              <ul className={`mt-3 space-y-2 text-sm ${bodyTextClass}`}>
                {[
                  { label: "About", href: "#about" },
                  { label: "Experience", href: "#experience" },
                  { label: "Projects", href: "#projects" },
                  { label: "Programs & Fellowships", href: "#programs" },
                  { label: "Volunteering", href: "#volunteering" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={`transition ${accentHoverTextClass}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fun stuff */}
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.25em] ${sectionLabelClass}`}>Off the Clock</p>
              <ul className={`mt-3 space-y-2 text-sm ${bodyTextClass}`}>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowGameSelector(true)}
                    className={`font-semibold underline decoration-dotted transition ${accentTextClass} hover:opacity-70`}
                  >
                    🎮 Play the arcade (14 games)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={playVoiceIntro}
                    className={`transition ${accentHoverTextClass}`}
                  >
                    🎤 Hear my voice intro
                  </button>
                </li>
                <li>
                  <span className={sectionLabelClass}>⌘K opens the command palette</span>
                </li>
                {visitorCount !== null && (
                  <li className={sectionLabelClass}>
                    <span className={`font-semibold ${accentTextClass}`}>{visitorCount.toLocaleString()}</span> visitors and counting
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className={`mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row ${
            isDarkMode ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-400"
          }`}>
            <p>© 2026 Mohit Unecha. Designed & built with Next.js, Tailwind, and ❤️</p>
            <p className="select-none tracking-widest opacity-30" title="You know what to do 😉">↑↑↓↓←→←→BA</p>
          </div>
        </div>
      </footer>

      {isHeaderVisible && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={`fixed bottom-20 left-6 z-40 flex items-center justify-center rounded-full p-3 transition-all duration-500 ${
            isDarkMode
              ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 hover:shadow-lg hover:shadow-emerald-500/20"
              : "border border-blue-400/30 bg-blue-400/10 text-blue-600 hover:bg-blue-400/20 hover:shadow-lg hover:shadow-blue-500/20"
          }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {isHeaderVisible && (
        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          className={`fixed bottom-6 left-6 z-40 flex items-center justify-center rounded-full p-3 transition-all duration-500 ${
            isDarkMode
              ? "border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 hover:shadow-lg hover:shadow-emerald-500/20"
              : "border border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20 hover:shadow-lg hover:shadow-blue-500/20"
          }`}
          aria-label="Toggle dark/light mode"
        >
          <div className="relative h-6 w-6 overflow-hidden">
            {/* Sun */}
            <svg
              className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${isDarkMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <circle cx="12" cy="12" r="5" className={isDarkMode ? "stroke-emerald-300" : "stroke-amber-500"} fill={isDarkMode ? "none" : "rgb(245 158 11 / 0.3)"} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="12" y1="1" x2="12" y2="3"
                  className={isDarkMode ? "stroke-emerald-300" : "stroke-amber-500"}
                  transform={`rotate(${angle} 12 12)`}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            {/* Moon */}
            <svg
              className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${isDarkMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                className={isDarkMode ? "stroke-emerald-300" : "stroke-blue-400"}
                fill={isDarkMode ? "rgb(52 211 153 / 0.2)" : "none"}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </button>
      )}



      <ChatbotPanel isDarkMode={isDarkMode} />

      {/* Game Selector Modal */}
      {showGameSelector && !selectedGame && (
        <div 
          className="snake-game-modal fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden"
          onClick={() => setShowGameSelector(false)}
        >
          <div 
            className={`relative rounded-3xl border-2 p-8 shadow-2xl max-w-5xl w-full mx-4 ${
              isDarkMode 
                ? "border-emerald-400/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30" 
                : "border-blue-400/40 bg-gradient-to-br from-white via-white to-blue-50"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGameSelector(false)}
              className={`absolute right-6 top-6 text-3xl font-bold transition-all hover:scale-110 hover:rotate-90 z-10 ${
                isDarkMode ? "text-emerald-400 hover:text-emerald-300" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              ×
            </button>
            <h2 className={`mb-8 text-3xl font-bold text-center ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>
              🎮 Choose Your Game
            </h2>
            
            {/* Carousel */}
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex(Math.max(0, carouselIndex - 1));
                }}
                disabled={carouselIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  carouselIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/50"
                    : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50"
                } text-white text-2xl font-bold`}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex(Math.min(11, carouselIndex + 1));
                }}
                disabled={carouselIndex === 11}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  carouselIndex === 11
                    ? "opacity-30 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/50"
                    : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50"
                } text-white text-2xl font-bold`}
              >
                ›
              </button>

              {/* Games Container */}
              <div className="overflow-hidden px-2">
                <div 
                  className="flex transition-transform duration-500 ease-out gap-4"
                  style={{ transform: `translateX(-${carouselIndex * (100 / 3)}%)` }}
                >
                  {[
                    { id: 'snake', name: '🐍 Snake', desc: 'Classic snake game' },
                    { id: 'pong', name: '🏓 Pong', desc: 'Arcade tennis' },
                    { id: 'tetris', name: '🟦 Tetris', desc: 'Block stacking' },
                    { id: 'flappy', name: '🐦 Flappy Bird', desc: 'Tap to fly' },
                    { id: '2048', name: '🔢 2048', desc: 'Merge tiles' },
                    { id: 'breakout', name: '🧱 Breakout', desc: 'Brick breaker' },
                    { id: 'memory', name: '🧠 Memory', desc: 'Match pairs' },
                    { id: 'invaders', name: '👾 Space Invaders', desc: 'Shoot aliens' },
                    { id: 'simon', name: '🎵 Simon Says', desc: 'Repeat sequence' },
                    { id: 'tictactoe', name: '❌ Tic Tac Toe', desc: 'Get 3 in a row' },
                    { id: 'race', name: '🏎️ Race', desc: 'Dodge obstacles' },
                    { id: 'whack', name: '🦫 Whack-a-Mole', desc: 'Hit the moles' },
                    { id: 'wordle', name: '📝 Wordle', desc: 'Guess the word' },
                    { id: 'zip', name: '🧩 Zip', desc: 'Connect the dots' },
                  ].map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`group relative p-4 sm:p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex-shrink-0 w-[calc(100%-0.67rem)] sm:w-[calc(50%-0.67rem)] md:w-[calc(33.333%-0.67rem)] ${
                        isDarkMode
                          ? "border-emerald-400/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:border-emerald-400/70 hover:shadow-xl hover:shadow-emerald-500/20"
                          : "border-blue-400/30 bg-gradient-to-br from-blue-50/80 to-white/80 hover:border-blue-400/70 hover:shadow-xl hover:shadow-blue-500/20"
                      }`}
                    >
                      <div className={`text-5xl mb-4 transition-transform duration-300 group-hover:scale-110`}>
                        {game.name.split(' ')[0]}
                      </div>
                      <div className={`font-bold text-lg mb-2 ${isDarkMode ? "text-emerald-300" : "text-blue-700"}`}>
                        {game.name.substring(game.name.indexOf(' ') + 1)}
                      </div>
                      <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {game.desc}
                      </div>
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isDarkMode ? "bg-emerald-500/5" : "bg-blue-500/5"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCarouselIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === carouselIndex
                        ? isDarkMode
                          ? "w-8 bg-emerald-400"
                          : "w-8 bg-blue-600"
                        : isDarkMode
                        ? "w-2 bg-slate-600 hover:bg-slate-500"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Game Modal */}
      {showGameSelector && selectedGame && (
        <div 
          className="snake-game-modal fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => { setSelectedGame(null); setShowGameSelector(false); }}
        >
          <div 
            className={`relative rounded-2xl border p-8 shadow-2xl ${
              isDarkMode 
                ? "border-emerald-400/30 bg-slate-900" 
                : "border-blue-400/30 bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGame(null)}
              className={`absolute right-4 top-4 text-2xl font-bold transition hover:opacity-70 ${
                isDarkMode ? "text-emerald-400" : "text-blue-600"
              }`}
            >
              ←
            </button>
            {selectedGame === 'snake' && <SnakeGame isDarkMode={isDarkMode} />}
            {selectedGame === 'pong' && <PongGame isDarkMode={isDarkMode} />}
            {selectedGame === 'tetris' && <TetrisGame isDarkMode={isDarkMode} />}
            {selectedGame === 'flappy' && <FlappyGame isDarkMode={isDarkMode} />}
            {selectedGame === '2048' && <Game2048 isDarkMode={isDarkMode} />}
            {selectedGame === 'breakout' && <BreakoutGame isDarkMode={isDarkMode} />}
            {selectedGame === 'memory' && <MemoryMatchGame isDarkMode={isDarkMode} />}
            {selectedGame === 'invaders' && <SpaceInvadersGame isDarkMode={isDarkMode} />}
            {selectedGame === 'simon' && <SimonSaysGame isDarkMode={isDarkMode} />}
            {selectedGame === 'tictactoe' && <TicTacToeGame isDarkMode={isDarkMode} />}
            {selectedGame === 'race' && <RaceGame isDarkMode={isDarkMode} />}
            {selectedGame === 'whack' && <WhackAMoleGame isDarkMode={isDarkMode} />}
            {selectedGame === 'wordle' && <WordleGame isDarkMode={isDarkMode} />}
            {selectedGame === 'zip' && <ZipGame isDarkMode={isDarkMode} />}
          </div>
        </div>
      )}
    </div>
  );
}

function SnakeGame({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameKey, setGameKey] = React.useState(0);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setGameKey(prev => prev + 1);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let gameRunning = true;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) {
        restartGame();
        return;
      }
      if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
      if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
      if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
      if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
    };

    window.addEventListener("keydown", handleKeyPress);

    const gameLoop = setInterval(() => {
      if (!gameRunning) return;

      if (dx === 0 && dy === 0) {
        ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
        snake.forEach(segment => {
          ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = isDarkMode ? "#f87171" : "#ef4444";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        return;
      }

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
          snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameRunning = false;
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });

      ctx.fillStyle = isDarkMode ? "#f87171" : "#ef4444";
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isDarkMode, gameOver, gameKey]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
        Score: {score}
      </div>
      <canvas 
        ref={canvasRef}
        className="rounded-lg border-2"
        style={{ 
          borderColor: isDarkMode ? "#10b981" : "#3b82f6"
        }}
      />
      {gameOver && (
        <p className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
          Game Over! Press any arrow key to restart.
        </p>
      )}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
        Use arrow keys to play
      </p>
    </div>
  );
}
