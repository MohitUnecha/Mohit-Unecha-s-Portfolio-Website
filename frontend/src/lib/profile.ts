export type ExperienceItem = {
  role: string;
  company: string;
  location?: string;
  timeline: string;
  highlights: string[];
};

export type ProjectItem = {
  name: string;
  summary: string;
  technicalDetails: string[];
  stack: string[];
  impact: string[];
  link?: string;
  linkLabel?: string;
};

export type EducationItem = {
  school: string;
  degree: string;
  timeline: string;
  details?: string[];
  gpa?: string;
};

export type StatItem = {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  sub: string;
};

export type ProgramItem = {
  name: string;
  org: string;
  year: string;
  detail: string;
};

export type VolunteeringItem = {
  role: string;
  org: string;
  timeline: string;
  detail: string;
};

export const profile = {
  name: "Mohit Unecha",
  headline: "SWE/PM Intern @ Microsoft | CS & Economics @ Rutgers",
  location: "New York City Metropolitan Area",
  heroBackgroundImage: "/pexels-adrian-falcon-1778067-3359250.jpg",
  photoUrl: "/mohit.jpg",
  agentName: "Jarvis",
  email: "mohitkunecha@gmail.com",
  phone: "(848) 248 6750",
  linkedIn: "linkedin.com/in/mohitunecha",
  github: "github.com/MohitUnecha",
  summary: [
    "I'm a Computer Science & Economics student at Rutgers (Data Science minor, 3.9 GPA) currently in Redmond as an Explore SWE/PM Intern at Microsoft, building AI-powered tooling on the Microsoft 365 Core team. My mission is simple: leverage technology, data, and empathy to build products that genuinely improve people's lives.",
    "I live at the intersection of software, product, and finance — from shipping an AI copilot at Microsoft, to leading the technology roadmap at a global nonprofit, to winning hackathons with ML-driven fintech tools. I'm a Break Through Tech AI Fellow at Cornell Tech and an alum of selective programs at Goldman Sachs, Capital One, BCG, Bain, Oracle, PayPal, and Vanguard.",
    "Beyond work, you'll find me watching F1, exploring new cuisines, mountain biking, and chasing bucket-list adventures — Kilimanjaro, Everest Base Camp, and the Camino de Santiago are all on the list.",
  ],
  strengths: [
    "Product discovery and user-centered design",
    "Full-stack development and scalable engineering",
    "Data-driven and analytical problem solving",
    "Cross-functional collaboration and stakeholder alignment",
    "Strategic thinking and go-to-market planning",
    "Rapid prototyping and experimentation",
    "Clear technical communication and storytelling",
    "AI/ML and data analytics integration",
  ],
  stats: [
    { value: 1050, suffix: "+", label: "Volunteer Hours", sub: "Lead Volunteer at Hands of Hope Food Pantry" },
    { value: 250, suffix: "+", label: "Students Mentored", sub: "Coding & chess — Alpha Minds Academy & varsity chess" },
    { value: 2, suffix: "×", label: "Hackathon Wins", sub: "Barclays Data Hackathon & SignalForge Datathon" },
    { value: 400, suffix: "+", label: "Hours Automated", sub: "Workflow automation at Kumon & Samaya Global" },
    { value: 10, suffix: "+", label: "Selective Programs", sub: "Microsoft, Goldman Sachs, Capital One, BCG & more" },
    { value: 3.9, decimals: 1, label: "GPA at Rutgers", sub: "Dean's List × 3 — CS & Economics" },
  ] as StatItem[],
  experience: [
  {
    role: "Explore Intern — SWE & Product Management",
    company: "Microsoft",
    location: "Redmond, WA",
    timeline: "May 2026 – Present",
    highlights: [
      "Working on Microsoft Secure Score within Microsoft 365 Core, splitting the internship across product management and software development",
      "Leading a team to define and ship Headroom Copilot — an AI-powered product enabling natural-language querying over telemetry data",
      "Aiming to cut time to headroom insights by 30–50% and roughly double analysis efficiency",
      "Further details under NDA 🤐"
    ]
  },
  {
    role: "Machine Learning / AI Fellow",
    company: "Break Through Tech @ Cornell Tech",
    location: "Remote",
    timeline: "Mar 2026 – Present",
    highlights: [
      "Selected from 5,000+ applicants for the Break Through Tech AI Program at Cornell Tech",
      "Completing a 12-month program of technical AI/ML coursework, hands-on experiential learning, and industry mentorship",
      "Building applied machine learning skills through real-world projects and career development with industry partners"
    ]
  },
  {
    role: "Career Academy Extern",
    company: "PayPal",
    location: "Remote",
    timeline: "Feb 2026 – Present",
    highlights: [
      "Selected for PayPal's Career Academy Program — a year-long fintech immersion built around mentorship, workshops, and hands-on learning",
      "Developing product thinking, business-focused communication, and cross-functional collaboration alongside PayPal professionals"
    ]
  },
  {
    role: "Technology Lead",
    company: "Samaya Global",
    location: "Edison, NJ (Remote)",
    timeline: "Jan 2025 – Present",
    highlights: [
      "Leading end-to-end development of an internal ticketing system for a nonprofit uplifting women and children through education, care, and community empowerment",
      "Managing a small team of developers, setting the technical roadmap, and partnering with operations to turn program needs into scalable tools across sites in the US, India, and beyond",
      "Designed and launched samayaglobal.org — the organization's public home for events, ticketing, donations, and volunteer sign-ups",
      "Saved 100+ hours of manual operational work, improving response times, reducing errors, and freeing staff for direct community impact"
    ]
  },
  {
    role: "Project Manager",
    company: "Rutgers Consulting Group (RCG)",
    location: "New Brunswick, NJ",
    timeline: "Sep 2025 – Present",
    highlights: [
      "Developed the full business plan for a client product launch — detailed financial modeling, competitive ecosystem mapping, and go-to-market strategy",
      "Supported a launch that generated nearly $100K in revenue within its first week",
      "Built dashboards and analytical models evaluating 3+ business scenarios to quantify revenue potential, risk, and scalability",
      "Partnered with a 4-person consulting team to define problem statements, test hypotheses, and deliver client-ready recommendations"
    ]
  },
  {
    role: "Hackathon Winner & AI/ML Developer",
    company: "Rutgers University (Barclays Data Hackathon)",
    location: "New Jersey",
    timeline: "Nov 2025",
    highlights: [
      "Led a team to 1st place by designing and building an AI Stock Predictor using a Retrieval-Augmented Transformer (RAT) model",
      "Integrated real-time market data, financial news, and sentiment analysis to generate data-backed trading signals",
      "Built a functional prototype within 48 hours, demonstrating technical execution, teamwork, and rapid iteration under pressure"
    ]
  },
  {
    role: "Project Manager",
    company: "Satrangi School of Fusion",
    location: "Edison, NJ",
    timeline: "Jun 2025 – Present",
    highlights: [
      "Managed 50+ client relationships, coordinating schedules, payments, communications, and performance logistics",
      "Led planning and execution for a 3-day cultural dance festival featuring 50+ performers and reaching an audience of 1M+ viewers",
      "Coordinated cross-functional teams across choreography, stage production, marketing, and operations to ensure on-time delivery"
    ]
  },
  {
    role: "Jr. Data Research Intern",
    company: "Right Angle Solutions",
    location: "New Brunswick, NJ",
    timeline: "Jun 2024 – Present",
    highlights: [
      "Analyzed 15,000+ rows of tri-state charter, private, and public school data using SQL, Excel, and Power BI",
      "Identified key demographic and enrollment trends that informed strategy and messaging for a successful campaign launch",
      "Designed data visualizations and reports to communicate insights clearly to non-technical stakeholders"
    ]
  },
  {
    role: "Coding & Chess Teacher",
    company: "Alpha Minds Academy",
    location: "Jersey City, NJ",
    timeline: "Sep 2024 – Present",
    highlights: [
      "Taught and mentored 250+ students in Python, Scratch, and computational thinking through structured lesson plans",
      "Developed customized learning materials to improve student engagement and retention",
      "Maintained strong relationships with parents and students, consistently receiving positive feedback"
    ]
  },
  {
    role: "Automation Administrator",
    company: "Kumon",
    location: "Edison, NJ",
    timeline: "Aug 2022 – Sep 2024",
    highlights: [
      "Built 50+ automation tools in C++ and HTML to streamline grading, reporting, and student tracking",
      "Reduced manual workload by 300+ staff hours per semester through process automation",
      "Standardized workflows for multiple instructors, improving consistency and efficiency across the center"
    ]
  }
] as ExperienceItem[],
  programs: [
    {
      name: "Break Through Tech AI Fellowship",
      org: "Cornell Tech",
      year: "2026",
      detail: "Selected from 5,000+ applicants for a 12-month applied AI/ML program with coursework, projects, and mentorship.",
    },
    {
      name: "North Star Fellowship",
      org: "Vanguard",
      year: "2026",
      detail: "2026 Fellow in Vanguard's selective early-talent community at the intersection of tech, product, and finance.",
    },
    {
      name: "Career Academy Program",
      org: "PayPal",
      year: "2026",
      detail: "Year-long fintech immersion — mentorship, workshops, and hands-on product learning.",
    },
    {
      name: "Engineering Possibilities Summit",
      org: "Goldman Sachs",
      year: "2025",
      detail: "Year-long engineering program — selected from 10,000+ applicants; training across Operations, Risk, and Controllers.",
    },
    {
      name: "Launchpad: Legacy & Leadership",
      org: "Capital One",
      year: "2025",
      detail: "1 of 100 students chosen from 1,200+ applicants for a 5-day immersive program and case competition at HQ.",
    },
    {
      name: "BCG Launch",
      org: "Boston Consulting Group",
      year: "2025",
      detail: "Selective consulting discovery program covering casework, problem structuring, and client strategy.",
    },
    {
      name: "Oracle Reach",
      org: "Oracle",
      year: "2025",
      detail: "Early-talent technology program exploring cloud, enterprise software, and tech careers.",
    },
    {
      name: "Consulting Kickstart",
      org: "Bain & Company",
      year: "2025",
      detail: "Intensive introduction to consulting frameworks, case interviews, and structured problem solving.",
    },
    {
      name: "Expedition EY",
      org: "Ernst & Young",
      year: "2025",
      detail: "Structured consulting experience focused on technology-enabled business transformation.",
    },
    {
      name: "Freshman Jumpstart",
      org: "BNY Mellon",
      year: "2025",
      detail: "Early-insight program in finance and technology with industry mentorship.",
    },
  ] as ProgramItem[],
  volunteering: [
    {
      role: "Lead Volunteer",
      org: "Hands of Hope Food Pantry",
      timeline: "Jun 2020 – Present",
      detail: "1,050+ hours serving the people of Middlesex County — leading volunteer teams, food distribution, and community health fairs.",
    },
    {
      role: "Explorer",
      org: "Edison Police Department",
      timeline: "Oct 2022 – Jun 2024",
      detail: "Supported community programs and learned day-to-day public safety operations alongside officers.",
    },
    {
      role: "Technology Lead (Pro Bono)",
      org: "Samaya Global",
      timeline: "Jan 2025 – Present",
      detail: "Donating engineering leadership to a nonprofit uplifting women and children — building the tools that power its operations.",
    },
  ] as VolunteeringItem[],
  projects: [
    {
      name: "Every Lap — F1 Analytics",
      summary:
        "A Formula 1 analytics platform that predicts race outcomes, replays races on an interactive track map, and lets you explore 25 years of telemetry data.",
      technicalDetails: [
        "Ensemble ML models (XGBoost + LightGBM + CatBoost) achieve 85% podium hit rate via walk-forward validation",
        "40+ engineered features across driver form, team performance, track history, practice pace, qualifying, strategy, weather, and context",
        "SHAP-based model explainability with human-readable explanations for every prediction",
        "DuckDB + Parquet columnar storage for high-performance telemetry queries",
        "FastAPI REST backend serving data to Next.js frontend with React Query and Zustand state management",
      ],
      stack: ["Python", "FastAPI", "FastF1", "XGBoost", "LightGBM", "CatBoost", "PostgreSQL", "DuckDB", "Redis", "Next.js", "TypeScript", "Canvas API"],
      link: "https://github.com/MohitUnecha/formula1",
      impact: [
        "Interactive 60 FPS Canvas-based race replay with tyre compounds, pit events, and safety car visualization",
        "Predicts win, podium, and top-10 probabilities using historical telemetry and weekend data",
        "Covers 2000–2026 F1 seasons with full data ingestion pipeline",
      ],
    },
    {
      name: "Samaya Global Ticketing System",
      summary:
        "An internal ticketing and workflow management system for a nonprofit supporting women and children. Streamlines operations across multiple sites, enabling teams to focus on community impact instead of manual administrative work.",
      technicalDetails: [
        "Multi-site support across US and India with role-based access control (RBAC) for staff, managers, and admins",
        "Real-time ticket tracking with status workflows, priority queuing, and SLA enforcement",
        "Automated email notifications to stakeholders with ticket updates and escalation alerts",
        "Reporting dashboard with metrics on ticket resolution times, staff workload, and operational bottlenecks",
        "Built and deployed to production managing 100+ operational tickets per month",
      ],
      stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Express", "Nodemailer"],
      impact: [
        "Saved 100+ hours of manual operational work per cycle across multiple sites",
        "Improved ticket resolution times by automating workflow coordination and notifications",
        "Reduced administrative errors through centralized ticketing and audit logs",
        "Enabled staff to redirect time from data entry to direct community impact",
      ],
    },
    {
      name: "Basement at 6:17",
      summary:
        "A web app for hosting in-person murder mystery game nights. The host gets a control panel to reveal clues, manage votes, and call players — while 13+ players join from their phones.",
      technicalDetails: [
        "Token-based authentication with separate host and player PINs supporting 13+ concurrent sessions",
        "Host-only admin APIs for clue reveals, vote management, tally computation, and round reset",
        "Twilio SDK integration for phone call notifications with graceful fallback to in-app alerts",
        "Deployed on Vercel with serverless backend functions and GitHub Actions CI/CD",
        "Detective vote weighting system for balanced game mechanics",
      ],
      stack: ["React", "Vite", "Node.js", "Express", "Vercel", "Twilio", "JavaScript", "CSS"],
      link: "https://github.com/MohitUnecha/basement-murder-mystery",
      impact: [
        "Supports 13+ concurrent players with real-time clue reveals and voting",
        "Host control panel with full game state management",
        "Optional Twilio phone calls when meetings start",
      ],
    },
    {
      name: "SignalForge",
      summary:
        "A datathon-winning app that checks if a company actually failed, compares it to survivors, simulates what-if scenarios, and writes a polished analyst report — all powered by AI.",
      technicalDetails: [
        "End-to-end pipeline: failure verification gate → survivor cohort benchmarking → digital twin risk simulation → NLP forensics",
        "Negation-aware distress parsing with theme-level severity scoring and evidence extraction",
        "Multi-LLM provider support (Groq + IBM watsonx.ai) with runtime switching and automatic failover",
        "Trained local logistic classifier on distress scenarios for offline reasoning",
        "JSON + Markdown export for judge-ready deliverables",
      ],
      stack: ["Python", "Streamlit", "Groq", "IBM watsonx.ai", "Tavily", "NLP", "Scikit-learn", "SHAP"],
      link: "https://github.com/Hitayu12/Datathon_S26",
      impact: [
        "Datathon winner — built in 48 hours",
        "Digital twin counterfactual simulation for failure analysis",
        "Interactive Scenario Lab and Ask Report Q&A for judges",
      ],
    },
    {
      name: "Scarlet Agent",
      summary:
        "An AI assistant for college students that pulls assignments from Canvas, finds files in Google Drive, and talks to you via text or voice — all in one dashboard.",
      technicalDetails: [
        "Multi-agent AI ecosystem orchestrating Canvas LMS scraping, Google Drive search, and conversational AI",
        "ElevenLabs voice synthesis for natural text-to-speech interaction",
        "Gemini API for intelligent reasoning and context-aware responses",
        "Snowflake integration for structured data queries",
        "Built as HackRU Fall 2025 submission with working prototype",
      ],
      stack: ["Python", "Streamlit", "Gemini API", "ElevenLabs", "Snowflake", "Node.js", "HTML/CSS"],
      impact: [
        "Real-time assignment deadlines and resource discovery from Canvas",
        "Multi-modal interface with text and voice interaction",
        "HackRU Fall 2025 submission with working multi-agent system",
      ],
    },
    {
      name: "AI Stock Predictor",
      summary:
        "1st place hackathon project that predicts stock market moves by combining real-time market data with AI-powered news sentiment analysis.",
      technicalDetails: [
        "Custom Retrieval-Augmented Transformer (RAT) model architecture for context-aware predictions",
        "Real-time market data ingestion from financial APIs with streaming pipeline",
        "NLP sentiment analysis on financial news for signal generation",
        "Buy/sell signal generation by fusing technical indicators with sentiment scores",
        "Built and deployed functional prototype within 48 hours under competition pressure",
      ],
      stack: ["Python", "Machine Learning", "NLP", "Sentiment Analysis", "Finance APIs"],
      link: "https://github.com/CANTSOAR/bitsdatathon",
      impact: [
        "1st place at Rutgers Data Hackathon sponsored by Barclays",
        "Generates actionable buy/sell signals from news sentiment and market trends",
        "Demonstrated rapid prototyping and teamwork under pressure",
      ],
    },
    {
      name: "Personal Creative Platform",
      summary:
        "A minimalist website for sharing writing, projects, poetry, and podcasts with a clean multimedia experience.",
      technicalDetails: [
        "Static site architecture with GitHub Pages deployment",
        "Responsive design with custom CSS animations",
        "Audio and image integration for multimedia storytelling",
      ],
      stack: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
      link: "https://github.com/MohitUnecha/tech_portfolio_site",
      impact: [
        "Clean design for sharing poetry, essays, and podcasts",
        "Multimedia-rich storytelling with audio and images",
        "Active creative outlet blending tech and art",
      ],
    },
    {
      name: "Personal Portfolio Website",
      summary:
        "This website! A full-stack portfolio with an AI chatbot assistant (Jarvis), contact form, dark mode, and mini games hidden in the footer.",
      technicalDetails: [
        "Next.js frontend with TypeScript and Tailwind CSS deployed on GitHub Pages",
        "Express.js backend on Vercel with Groq API (Llama 3.3) powering Jarvis chatbot",
        "Nodemailer contact form with rate limiting and reCAPTCHA v3 verification",
        "13 playable mini games (Pong, Tetris, Flappy Bird, etc.) built with Canvas API",
        "Vercel Analytics for page view tracking",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Express.js", "Node.js", "Groq API", "Nodemailer", "reCAPTCHA"],
      link: "https://github.com/MohitUnecha/Mohit-Unecha-s-Portfolio-Website",
      impact: [
        "AI chatbot for interactive career guidance",
        "Contact form with email notifications and spam protection",
        "Responsive dark/light mode with smooth animations",
      ],
    },
  ] as ProjectItem[],
  education: [
    {
      school: "Rutgers University",
      degree: "B.A. Computer Science & Economics (Dual Major), Minor in Data Science",
      timeline: "Jun 2024 – May 2028 (Expected)",
      gpa: "3.9",
      details: [
        "Dean's List × 3 for academic excellence",
        "Active in ColorStack, Rutgers Consulting Group, and Men of Character",
        "1st place — Barclays Data Hackathon; datathon winner with SignalForge",
        "Interdisciplinary focus positioning for roles at the intersection of tech, product, and business strategy",
      ],
    },
    {
      school: "John P Stevens High School",
      degree: "High School Diploma — Computer Science & Business Management",
      timeline: "2020 – 2024",
      details: [
        "Strong foundation in STEM with honors in Computer Science and Mathematics",
        "Inducted member of Mu Alpha Theta (Math Honor Society), tutoring students in math",
        "Member of various National Honor Societies and Vice President of the Spanish Honor Society",
      ],
    },
  ] as EducationItem[],
  skills: {
    product: ["Product Strategy", "PRDs & Roadmapping", "Go-to-Market Planning", "Financial Modeling", "Cross-functional Leadership", "AI/ML Strategy", "MVP Development"],
    engineering: ["Python", "TypeScript", "React / Next.js", "Node.js", "SQL", "Java", "C++", "R", "Machine Learning", "NLP"],
    tools: ["Power BI", "Snowflake", "Streamlit", "Gemini API", "Groq", "ElevenLabs", "Git", "Jupyter", "Excel", "Canvas LMS"],
  },
  certifications: [
    "Harvard CS50P — Programming with Python",
    "Google Cloud — Generative AI, Intro to Large Language Models, Responsible AI",
    "BCG Launch Intern — Boston Consulting Group (Jun 2025)",
    "Oracle Reach Intern — Oracle (May 2025)",
    "Capital One Launchpad: Legacy & Leadership — 1 of 100 from 1,200+ applicants",
    "Goldman Sachs Engineering Possibilities Summit — Selected from 10,000+ applicants",
    "Bain & Company Consulting Kickstart Program",
    "BNY Mellon Freshman Jumpstart Program",
    "Power BI Essential Training — Data Modeling & Visualization",
  ],
  pmSpecSheet: {
    vision: "I build products at the intersection of engineering and strategy — translating user pain into shipped solutions that move metrics. My approach combines hands-on technical execution with rigorous discovery, data-driven prioritization, and cross-functional alignment.",
    pillars: [
      {
        title: "Discovery & Research",
        items: [
          "User interviews, survey design, and behavioral analytics",
          "Competitive landscape mapping and market sizing",
          "Jobs-to-be-done framework for opportunity identification",
          "Hypothesis-driven experimentation and A/B testing",
        ],
      },
      {
        title: "Strategy & Prioritization",
        items: [
          "RICE / ICE scoring for feature prioritization",
          "OKR definition and roadmap planning",
          "Go-to-market strategy and launch planning",
          "Stakeholder alignment through structured decision frameworks",
        ],
      },
      {
        title: "Execution & Delivery",
        items: [
          "Writing PRDs, user stories, and acceptance criteria",
          "Sprint planning, backlog grooming, and agile ceremonies",
          "Cross-functional collaboration with design & engineering",
          "Release management and feature rollout strategies",
        ],
      },
      {
        title: "Measurement & Iteration",
        items: [
          "KPI definition and dashboard design",
          "Funnel analysis and conversion optimization",
          "Post-launch retrospectives and iteration cycles",
          "Data storytelling for executive stakeholder updates",
        ],
      },
    ],
    caseStudies: [
      {
        product: "Headroom Copilot — Microsoft 365 Core",
        role: "SWE/PM Intern",
        problem: "Engineers needed faster access to headroom insights buried in telemetry data.",
        approach: "Led a team from problem identification through validation and iteration to ship an AI-powered natural-language querying product. Further details under NDA.",
        outcome: "Aiming to cut time to headroom insights by 30–50% and roughly double analysis efficiency.",
      },
      {
        product: "Every Lap — F1 Analytics",
        role: "Solo Builder & PM",
        problem: "F1 fans lacked a unified platform to explore historical race data, predictions, and telemetry in one place.",
        approach: "Defined user personas (casual fans vs. data analysts), scoped MVP features via impact/effort matrix, built ML pipeline and interactive replay system.",
        outcome: "85% podium prediction accuracy, 40+ engineered features, full-stack platform with real-time race replay at 60 FPS.",
      },
      {
        product: "SignalForge — Failure Intelligence",
        role: "Co-builder & Technical PM",
        problem: "Datathon judges needed a tool to verify company failures and understand root causes through data, not just narratives.",
        approach: "Rapid prototyping with Streamlit, multi-LLM reasoning for robustness, designed judge-facing UX with export capabilities.",
        outcome: "Datathon winner. Delivered failure verification, digital twin simulation, NLP forensics, and polished report export in 48 hours.",
      },
    ],
  },
};
