"use client";

import ChatbotPanel from "@/components/ChatbotPanel";
import { profile } from "@/lib/profile";
import { useState, useEffect } from "react";

export default function Home() {
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [displayedText, setDisplayedText] = useState("");
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
  const accentHoverTextClass = isDarkMode ? "hover:text-emerald-300" : "hover:text-blue-700";
  const accentBorderHoverClass = isDarkMode ? "hover:border-emerald-400/50" : "hover:border-blue-500/50";
  const accentBgHoverClass = isDarkMode ? "hover:bg-emerald-400/10" : "hover:bg-blue-50";
  const projectHoverClass = isDarkMode ? "group-hover:text-emerald-300" : "group-hover:text-blue-700";
  const buttonClass = isDarkMode
    ? "border-white/20 bg-white/5 text-slate-100"
    : "border-slate-300 bg-white text-slate-700";
  const overlayClass = isDarkMode
    ? "from-slate-950/90 via-slate-950/85 to-slate-950/90"
    : "from-white/85 via-white/70 to-white/85";

  return (
    <div className={`min-h-screen ${pageClass}`}>
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
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass}`} />
        <div className="relative z-10 flex flex-col items-center text-center">
            <div
              className={`mb-8 h-48 w-48 overflow-hidden rounded-full border-4 shadow-2xl ${
                isDarkMode ? "border-emerald-400/40" : "border-blue-600/40"
              }`}
            >

              <img
                src={profile.photoUrl}
                alt={`${profile.name} headshot`}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mb-4 text-6xl font-bold tracking-tight md:text-7xl">
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className={`mb-8 max-w-2xl text-2xl font-light ${bodyTextClass}`}>
              {profile.headline}
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              <a
                href={`https://${profile.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center rounded-full border p-2 transition hover:opacity-70 ${isDarkMode ? "border-white/40" : "border-black/40"}`}
                aria-label="LinkedIn"
              >
                <img src="/LinkedinLogo.png" alt="LinkedIn" className="h-7 w-7" style={{ filter: 'grayscale(1) brightness(2)' }} />
              </a>
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center rounded-full border p-2 transition hover:opacity-70 ${isDarkMode ? "border-white/40" : "border-black/40"}`}
                aria-label="GitHub"
              >
                <img src="/Githublogo.png" alt="GitHub" className="h-7 w-7" style={{ filter: 'grayscale(1) brightness(2.8)' }} />
              </a>
            </div>
            <a
              href="#about"
              className={`mt-12 animate-bounce transition ${accentHoverTextClass} ${sectionLabelClass}`}
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
          <section id="about" className="py-24">
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

        <section id="experience" className="py-24">
          <h2 className={`mb-16 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Experience
          </h2>
          <div className="mx-auto max-w-4xl space-y-16">
            {profile.experience.map((item) => (
              <article key={`${item.company}-${item.role}`} className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <h3 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {item.role}
                    </h3>
                    <p className={`text-xl ${bodyTextClass}`}>{item.company}</p>
                    <p className={`text-base ${sectionLabelClass}`}>{item.location}</p>
                  </div>
                  <p className={`text-sm font-medium uppercase tracking-wider ${accentTextClass}`}>
                    {item.timeline}
                  </p>
                </div>
                <ul className={`ml-6 space-y-2 ${bodyTextClass}`}>
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="list-disc leading-relaxed">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="py-24">
          <h2 className={`mb-16 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
            Projects
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((project) => (
              <article
                key={project.name}
                className={`group rounded-2xl border p-6 transition ${cardClass} ${cardHoverClass}`}
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
                  {project.stack.map((tech) => (
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
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${accentBorderHoverClass} ${accentBgHoverClass} ${buttonClass}`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Repository
                  </a>
                )}
              </article>
            ))}
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

        <section id="contact" className="py-24">
          <div className="mx-auto max-w-2xl px-8">
            <h2 className={`mb-8 text-center text-sm font-bold uppercase tracking-[0.3em] ${sectionLabelClass}`}>
              Get In Touch
            </h2>
            <p className={`mx-auto mb-12 text-center text-lg ${bodyTextClass}`}>
              Reach out for SWE or PM opportunities, collaborations, or mentorship.
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

                  const response = await fetch("/api/contact", {
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
                  className={`rounded-lg border px-4 py-3 text-sm transition ${
                    isDarkMode
                      ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                      : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                  } focus:outline-none focus:ring-2`}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={formStatus === "loading"}
                  className={`rounded-lg border px-4 py-3 text-sm transition ${
                    isDarkMode
                      ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                      : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                  } focus:outline-none focus:ring-2`}
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                disabled={formStatus === "loading"}
                className={`w-full rounded-lg border px-4 py-3 text-sm transition ${
                  isDarkMode
                    ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                    : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-2`}
              />

              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                disabled={formStatus === "loading"}
                rows={5}
                className={`w-full rounded-lg border px-4 py-3 text-sm transition ${
                  isDarkMode
                    ? "border-white/10 bg-white/5 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                    : "border-slate-200 bg-slate-50 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-2`}
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
    </div>
  );
}
