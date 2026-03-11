"use client";

import ChatbotPanel from "@/components/ChatbotPanel";
import { profile } from "@/lib/profile";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { PongGame, FlappyGame, Game2048, TetrisGame, BreakoutGame, MemoryMatchGame, SpaceInvadersGame, SimonSaysGame, TicTacToeGame, RaceGame, WhackAMoleGame, WordleGame, ZipGame } from "@/components/Games";

const KONAMI_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function Home() {
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [displayedText, setDisplayedText] = useState("");
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
  const konamiRef = useRef(0);

  const roles = [
    "Software Engineer",
    "Product Manager",
    "F1 Enthusiast",
    "Builder & Creator",
    "CS + Econ @ Rutgers",
  ];

  const handleCardTilt = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTiltCard({ id, x, y });
  };

  const strengthsToShow = showAllStrengths ? profile.strengths : profile.strengths.slice(0, 4);
  const fullText = `Hi, I'm ${profile.name.split(" ")[0]}.`;

  useEffect(() => {
    let index = 0;
    const typeWriter = () => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.substring(0, index));
        index++;
        setTimeout(typeWriter, 80);
      }
    };
    typeWriter();
  }, []);

  // Role rotator typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (rolePhase === "typing") {
      if (roleText.length < currentRole.length) {
        timeout = setTimeout(() => setRoleText(currentRole.slice(0, roleText.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setRolePhase("pausing"), 1800);
      }
    } else if (rolePhase === "pausing") {
      timeout = setTimeout(() => setRolePhase("erasing"), 400);
    } else if (rolePhase === "erasing") {
      if (roleText.length > 0) {
        timeout = setTimeout(() => setRoleText(roleText.slice(0, -1)), 35);
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

  // GitHub contributions heatmap
  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/MohitUnecha?y=last')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data?.contributions)) setGithubContribs(data.contributions);
      })
      .catch(() => {});
  }, []);

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

  const pageClass = isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900";
  const headerClass = isDarkMode
    ? "border-white/5 bg-slate-950/80"
    : "border-slate-200/70 bg-white/80";
  const navTextClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const sectionLabelClass = isDarkMode ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = isDarkMode ? "text-slate-300" : "text-slate-700";
  const subTextClass = isDarkMode ? "text-slate-200" : "text-slate-800";
  const cardClass = isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white";
  const cardHoverClass = isDarkMode
    ? "hover:border-emerald-400/30 hover:bg-white/10"
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
    <div className={`min-h-screen ${pageClass}`}>
      {/* Scroll progress bar */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-[70] h-[3px]">
        <div
          className={`h-full ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-sky-400 to-blue-500'}`}
          style={{ width: `${scrollProgress}%`, transition: 'width 0.15s ease-out' }}
        />
      </div>

      {/* Cursor Tracker Glow */}
      <div
        className="pointer-events-none fixed z-40"
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

      {/* Cursor Inner Circle */}
      <div
        className="pointer-events-none fixed z-40"
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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
          <a href="#home" className={`transition ${accentHoverTextClass}`}>
            <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
          </a>
          <nav className={`flex items-center gap-8 text-sm font-medium ${navTextClass}`}>
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
        
        <div className="relative z-10 flex flex-col items-center text-center" style={{ opacity: 1 - zoomProgress * 2.5, transition: "opacity 0.3s ease-out" }}>
            <div
              className={`mb-8 h-48 w-48 overflow-hidden rounded-full border-4 shadow-2xl ${
                isDarkMode ? "border-emerald-400/40" : "border-blue-600/40"
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
            <h1 className={`mb-4 text-6xl font-bold tracking-tight md:text-7xl ${isDarkMode ? "drop-shadow-[0_0_30px_rgba(110,231,183,0.4)]" : "drop-shadow-[0_2px_12px_rgba(14,165,233,0.5)] text-white"}`} style={{ transition: "all 0.3s ease-out" }}>
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>
            {/* Role rotator */}
            <p
              className={`mb-8 max-w-2xl text-2xl font-light min-h-[2rem] ${isDarkMode ? bodyTextClass : "text-white"}`}
              style={{ transition: "all 0.3s ease-out" }}
            >
              <span className={`${roleColorClass} font-semibold`}>{roleText}</span>
              <span className="animate-pulse opacity-70">|</span>
            </p>
            {/* Open to opportunities badge */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isDarkMode ? 'bg-emerald-400' : 'bg-green-400'}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-green-500'}`} />
              </div>
              <a href="#contact" className={`text-sm font-medium transition hover:underline ${isDarkMode ? 'text-emerald-300/90' : 'text-green-700'}`}>
                Open to Opportunities
              </a>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-4" style={{ transition: "all 0.3s ease-out" }}>
              <a
                href={`https://${profile.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center rounded-full border-2 p-3 transition-all duration-300 hover:scale-110 ${isDarkMode ? "border-emerald-500 bg-emerald-500/90 shadow-lg shadow-emerald-500/50" : "border-blue-500 bg-blue-500/90 shadow-lg shadow-blue-500/50"}`}
                aria-label="LinkedIn"
              >
                <img src="/LinkedinLogo.png" alt="LinkedIn" className="h-7 w-7" style={{ filter: 'brightness(2.5)' }} />
              </a>
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center rounded-full border-2 p-3 transition-all duration-300 hover:scale-110 ${isDarkMode ? "border-emerald-500 bg-emerald-500/90 shadow-lg shadow-emerald-500/50" : "border-blue-500 bg-blue-500/90 shadow-lg shadow-blue-500/50"}`}
                aria-label="GitHub"
              >
                <img src="/Githublogo.png" alt="GitHub" className="h-7 w-7" style={{ filter: 'brightness(2.8)' }} />
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

        <main className="mx-auto w-full max-w-5xl px-8 pb-32">
          <section id="about" className="py-24" style={{
            opacity: visibleSections.has('about') ? 1 : 0,
            transform: visibleSections.has('about') ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
          <h2 className={`mb-12 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            About Me
          </h2>
          <div className={`mx-auto max-w-3xl space-y-6 text-lg leading-relaxed ${bodyTextClass}`}>
            {profile.summary.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl gap-6 text-center md:grid-cols-2">
            {strengthsToShow.map((strength) => (
              <div
                key={strength}
                className={`rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass}`}
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

        <section id="experience" className="py-24" style={{
          opacity: visibleSections.has('experience') ? 1 : 0,
          transform: visibleSections.has('experience') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <h2 className={`mb-16 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Experience
          </h2>
          <div className="relative mx-auto max-w-5xl">
            {/* Center timeline line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block ${isDarkMode ? "bg-white/15" : "bg-slate-300"}`} />
            
            {profile.experience.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={`${item.company}-${item.role}`} className="relative mb-12 last:mb-0">
                  {/* Timeline dot - desktop */}
                  <div className={`absolute left-1/2 top-6 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 md:block ${
                    isDarkMode ? "border-emerald-400 bg-slate-950" : "border-blue-500 bg-slate-50"
                  }`} />
                  
                  {/* Mobile: stacked layout */}
                  <div className="md:hidden">
                    <article className={`rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass}`}>
                      <p className={`mb-2 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                        {item.timeline}
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
                        <article className={`rounded-2xl border p-6 transition text-right ${cardClass} ${cardHoverClass}`}>
                          <p className={`mb-2 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                            {item.timeline}
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
                        <article className={`rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass}`}>
                          <p className={`mb-2 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                            {item.timeline}
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
        </section>

        <section id="projects" className="py-24" style={{
          opacity: visibleSections.has('projects') ? 1 : 0,
          transform: visibleSections.has('projects') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <h2 className={`mb-16 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Projects
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((project) => {
              const isExpanded = expandedProject === project.name;
              return (
              <article
                key={project.name}
                className={`group interactive rounded-2xl border p-6 flex flex-col ${cardClass} ${cardHoverClass}`}
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
                }}
              >
                <h3
                  className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"} ${projectHoverClass}`}
                >
                  {project.name}
                </h3>
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

        <section className="py-24">
          <h2 className={`mb-16 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Education
          </h2>
          <div className="mx-auto max-w-4xl space-y-12">
            {profile.education.map((school) => (
              <article key={school.school} className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {school.school}
                  </h3>
                  <p className={`text-sm font-medium uppercase tracking-wider ${accentTextClass}`}>
                    {school.timeline}
                  </p>
                </div>
                <p className={`text-lg ${bodyTextClass}`}>{school.degree}</p>
                {school.gpa && (
                  <p className={`text-sm font-medium ${accentTextClass}`}>GPA: {school.gpa}</p>
                )}
                {school.details && (
                  <ul className={`ml-6 space-y-1 ${bodyTextClass}`}>
                    {school.details.map((detail) => (
                      <li key={detail} className="list-disc">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className={`mb-12 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Skills
          </h2>
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
        <section className="py-16">
          <h2 className={`mb-3 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            GitHub Activity
          </h2>
          <p className={`mb-8 text-center text-xs ${sectionLabelClass}`}>
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
          <div className="mx-auto max-w-2xl px-8">
            <h2 className={`mb-8 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
              Get In Touch
            </h2>
            <p className={`mx-auto mb-12 text-center text-lg ${bodyTextClass}`}>
              Let's connect! I'd love to collaborate, chat about opportunities, or mentor together.
            </p>

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
          <div
            className={`relative mx-4 max-w-md rounded-3xl border-2 p-10 text-center shadow-2xl ${
              isDarkMode
                ? 'border-emerald-400/60 bg-slate-900 shadow-emerald-500/30'
                : 'border-blue-400/60 bg-white shadow-blue-500/30'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-6xl">🎮</div>
            <h2 className={`mb-3 text-2xl font-bold ${isDarkMode ? 'text-emerald-300' : 'text-blue-600'}`}>
              You found the secret!
            </h2>
            <p className={`mb-2 text-sm ${bodyTextClass}`}>
              Welcome to the inner circle. Mohit would be impressed.
            </p>
            <p className={`mb-6 text-xs ${sectionLabelClass}`}>↑↑↓↓←→←→BA — classic.</p>
            <button
              onClick={() => setShowEasterEgg(false)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${buttonClass}`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className={`py-8 text-center text-sm ${bodyTextClass}`}>
        <p>
          © 2026 Mohit Unecha. All rights reserved. • Want to play a{" "}
          <span
            className={`cursor-pointer font-semibold underline decoration-dotted ${accentTextClass} hover:opacity-70`}
            onClick={() => setShowGameSelector(true)}
          >
            game
          </span>
          ?
        </p>
        {visitorCount !== null && (
          <p className={`mt-2 text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
            <span className={`font-semibold ${accentTextClass}`}>{visitorCount.toLocaleString()}</span> visitors and counting
          </p>
        )}
        <p className="mt-2">
          Contact: {" "}
          <a
            href="mailto:contact@mohitunecha.com"
            className={`font-semibold underline decoration-dotted transition ${accentTextClass} hover:opacity-70`}
          >
            contact@mohitunecha.com
          </a>
        </p>
        <p className="mt-4 text-xs opacity-20 select-none tracking-widest" title="You know what to do 😉">↑↑↓↓←→←→BA</p>
      </footer>

      {isHeaderVisible && (
        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          className={`fixed bottom-6 left-6 z-40 flex items-center justify-center rounded-full p-3 transition-all duration-300 ${
            isDarkMode
              ? "border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20"
              : "border border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20"
          }`}
          aria-label="Toggle dark/light mode"
        >
          <span className="text-2xl" style={{ filter: "brightness(0)" }}>{isDarkMode ? "🌙" : "☀️"}</span>
        </button>
      )}

      {isHeaderVisible && <ChatbotPanel isDarkMode={isDarkMode} />}

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
                      className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex-shrink-0 w-[calc(33.333%-0.67rem)] md:w-[calc(33.333%-0.67rem)] ${
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
