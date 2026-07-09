const links = {
  email: "mailto:mohitkunecha@gmail.com",
  github: "https://github.com/MohitUnecha",
  linkedin: "https://linkedin.com/in/mohitunecha",
};

const experience = [
  {
    period: "2026 —",
    role: "Explore Intern, SWE & Product",
    org: "Microsoft",
    note: "Building Headroom Copilot on the Microsoft 365 Core team — natural-language querying over telemetry, aiming to cut time-to-insight by 30–50%. Split across product and engineering; details under NDA.",
  },
  {
    period: "2026 —",
    role: "AI/ML Fellow",
    org: "Break Through Tech @ Cornell Tech",
    note: "Selected from 5,000+ applicants for a 12-month applied machine learning program with industry mentorship.",
  },
  {
    period: "2025 —",
    role: "Technology Lead",
    org: "Samaya Global",
    note: "Built and launched samayaglobal.org and an internal ticketing system used across the US and India — saving a nonprofit's staff 100+ hours of manual work.",
  },
  {
    period: "2025 —",
    role: "Project Manager",
    org: "Rutgers Consulting Group",
    note: "Wrote the business plan and financial model behind a client launch that generated nearly $100K in its first week.",
  },
  {
    period: "2024 —",
    role: "Coding & Chess Teacher",
    org: "Alpha Minds Academy",
    note: "Taught 250+ students Python, Scratch, and computational thinking.",
  },
  {
    period: "2022 – 24",
    role: "Automation Administrator",
    org: "Kumon",
    note: "Built 50+ automation tools that cut 300+ staff-hours of manual work per semester.",
  },
];

const projects = [
  {
    name: "Every Lap",
    href: "https://github.com/MohitUnecha/formula1",
    note: "F1 analytics platform — ensemble ML models with an 85% podium hit rate and an interactive 60 fps race replay across 25 years of telemetry.",
    stack: "Python · FastAPI · XGBoost · Next.js",
  },
  {
    name: "SignalForge",
    href: "https://github.com/Hitayu12/Datathon_S26",
    note: "Datathon winner — verifies corporate failures, benchmarks them against survivors, simulates counterfactuals, and writes the analyst report.",
    stack: "Python · Streamlit · Groq · watsonx.ai",
  },
  {
    name: "AI Stock Predictor",
    href: "https://github.com/CANTSOAR/bitsdatathon",
    note: "1st place at the Barclays Data Hackathon — a Retrieval-Augmented Transformer fusing live market data with news sentiment into trading signals.",
    stack: "Python · ML · NLP",
  },
  {
    name: "Basement at 6:17",
    href: "https://github.com/MohitUnecha/basement-murder-mystery",
    note: "A web app for hosting in-person murder-mystery nights — host control panel, Twilio phone-in clues, 13+ players joining from their phones.",
    stack: "React · Node · Twilio",
  },
];

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-sm font-medium uppercase tracking-widest text-zinc-500">
      {children}
    </h2>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
      className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition-colors hover:decoration-emerald-400"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <header className="mb-20 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-200">Mohit Unecha</span>
        <nav className="flex gap-5 text-zinc-500">
          <a href="#experience" className="transition-colors hover:text-zinc-200">Experience</a>
          <a href="#projects" className="transition-colors hover:text-zinc-200">Projects</a>
          <a href="#contact" className="transition-colors hover:text-zinc-200">Contact</a>
        </nav>
      </header>

      <main className="space-y-20">
        {/* Intro */}
        <section className="space-y-5">
          <img
            src="/mohit.jpg"
            alt="Mohit Unecha"
            className="h-16 w-16 rounded-full object-cover ring-1 ring-zinc-800"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Software engineer &amp; product builder.
          </h1>
          <p className="leading-relaxed">
            I&apos;m a Computer Science &amp; Economics student at Rutgers (3.9 GPA), currently in
            Redmond as an Explore SWE/PM intern at Microsoft, helping ship an AI copilot on the
            Microsoft 365 Core team. I&apos;m also a Break Through Tech AI Fellow at Cornell Tech
            and the technology lead at Samaya Global, a nonprofit supporting women and children.
          </p>
          <p className="leading-relaxed">
            I like building at the intersection of software, product, and finance — ML-driven
            fintech tools, F1 analytics, and systems that save real people real hours.
          </p>
          <p className="flex gap-5 text-sm">
            <ExternalLink href={links.github}>GitHub</ExternalLink>
            <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={links.email}>Email</ExternalLink>
          </p>
        </section>

        {/* Experience */}
        <section className="space-y-8">
          <SectionHeading id="experience">Experience</SectionHeading>
          <ul className="space-y-8">
            {experience.map((job) => (
              <li key={job.org + job.role} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
                <span className="text-sm text-zinc-500">{job.period}</span>
                <div className="space-y-1.5">
                  <h3 className="font-medium text-zinc-100">
                    {job.role} · {job.org}
                  </h3>
                  <p className="text-sm leading-relaxed">{job.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-zinc-500">
            Also selected for early-talent programs at Goldman Sachs (from 10,000+ applicants),
            Capital One (1 of 100), Vanguard, PayPal, BCG, Bain, Oracle, EY, and BNY Mellon.
          </p>
        </section>

        {/* Projects */}
        <section className="space-y-8">
          <SectionHeading id="projects">Projects</SectionHeading>
          <ul className="space-y-8">
            {projects.map((project) => (
              <li key={project.name} className="space-y-1.5">
                <h3 className="font-medium">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-100 transition-colors hover:text-emerald-400"
                  >
                    {project.name} <span aria-hidden>↗</span>
                  </a>
                </h3>
                <p className="text-sm leading-relaxed">{project.note}</p>
                <p className="text-xs text-zinc-600">{project.stack}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Community */}
        <section className="space-y-4">
          <SectionHeading id="community">Community</SectionHeading>
          <p className="text-sm leading-relaxed">
            1,050+ volunteer hours as a lead volunteer at Hands of Hope Food Pantry, serving
            Middlesex County since 2020 — plus pro-bono engineering leadership at Samaya Global.
          </p>
        </section>

        {/* Education */}
        <section className="space-y-4">
          <SectionHeading id="education">Education</SectionHeading>
          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
            <span className="text-sm text-zinc-500">2024 – 28</span>
            <div className="space-y-1.5">
              <h3 className="font-medium text-zinc-100">Rutgers University</h3>
              <p className="text-sm leading-relaxed">
                B.A. Computer Science &amp; Economics, minor in Data Science. 3.9 GPA,
                Dean&apos;s List ×3.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <SectionHeading id="contact">Contact</SectionHeading>
          <p className="leading-relaxed">
            The fastest way to reach me is email —{" "}
            <ExternalLink href={links.email}>mohitkunecha@gmail.com</ExternalLink>. Always happy
            to talk internships, product ideas, F1, or nonprofit tech.
          </p>
        </section>
      </main>

      <footer className="mt-24 flex items-center justify-between border-t border-zinc-900 pt-8 text-xs text-zinc-600">
        <span>© 2026 Mohit Unecha</span>
        <span className="flex gap-4">
          <a href={links.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-zinc-300">GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-zinc-300">LinkedIn</a>
        </span>
      </footer>
    </div>
  );
}
