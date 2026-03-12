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

export const profile = {
  name: "Mohit Unecha",
  headline: "Aspiring Software Engineer & Product Manager",
  location: "Based in [City, State]",
  heroBackgroundImage: "/pexels-adrian-falcon-1778067-3359250.jpg",
  photoUrl: "/mohit.jpg",
  agentName: "Jarvis",
  email: "mohitkunecha@gmail.com",
  phone: "(848) 248 6750",
  linkedIn: "linkedin.com/in/mohitunecha",
  github: "github.com/MohitUnecha",
  summary: [
    "I am a mission-driven builder at the intersection of software, product, and business, focused on creating user-centered products that solve real problems at scale. I thrive in fast-paced, collaborative environments where I can blend technical execution with strategic thinking to deliver measurable impact. With experience spanning AI/ML, consulting, automation, and product development, I aim to build technology that is both innovative and meaningful.",
    "Outside of work, I enjoy traveling, hiking, golfing, and go-karting, which fuel my curiosity, competitiveness, and appreciation for new perspectives.",
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
  experience: [
  {
    role: "Incoming Product & Software Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    timeline: "May 2026",
    highlights: [
      "Selected to work on the core Microsoft 365 suite, contributing to products used by 10M+ users globally",
      "Will collaborate with product, design, and engineering teams to define requirements, build scalable features, and ship production-ready software within a cloud-first ecosystem",
      "Expected to balance technical execution with product strategy, aligning user needs with business impact"
    ]
  },
  {
    role: "Technology Lead",
    company: "Samaya Global",
    location: "Edison, NJ (Remote)",
    timeline: "Jan 2025 – Present",
    highlights: [
      "Leading end-to-end development of an internal ticketing system for a nonprofit focused on uplifting women and children through education, care, and community empowerment",
      "Managing a small team of developers, setting the technical roadmap, and collaborating with operations to turn program needs into scalable tools",
      "Saved over 100 hours of manual operational work by streamlining workflows across sites in the US, India, and beyond",
      "Improving response times, reducing errors, and enabling staff to spend more time on direct community impact"
    ]
  },
  {
    role: "Business Consulting Analyst",
    company: "Rutgers Consulting Group (RCG)",
    location: "New Brunswick, NJ",
    timeline: "Sep 2025 – Present",
    highlights: [
      "Built data-driven go-to-market models using market sizing, competitor benchmarking, and financial analysis to inform strategy for multiple client engagements",
      "Developed dashboards and analytical models evaluating 3+ business scenarios to quantify revenue potential, risk, and scalability",
      "Synthesized qualitative and quantitative insights into structured frameworks and slide-ready deliverables for stakeholders",
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
    company: "Right Angle Solution",
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
    role: "2025 Possibilities Summit",
    company: "Goldman Sachs",
    location: "New York, NY",
    timeline: "Jan 2025 – Jan 2026",
    highlights: [
      "Completed training in Operations, Risk, and Controllers, gaining technical exposure to financial controls, risk frameworks, and compliance processes",
      "Engaged in case-based workshops on data-driven decision making, emerging technologies, and cross-functional collaboration",
      "Networked with industry professionals and developed professional communication and problem-solving skills"
    ]
  },
  {
    role: "Expedition EY Intern",
    company: "Ernst & Young",
    location: "New York, NY",
    timeline: "Mar 2025 – May 2025",
    highlights: [
      "Completed Expedition EY, a structured virtual consulting experience focused on technology-enabled business transformation",
      "Gained a practical understanding of what consulting entails, including problem structuring, stakeholder management, and solution delivery",
      "Worked through real-world case scenarios involving client discovery, data analysis, and strategic recommendations",
      "Learned how consultants balance technical insights with business strategy to create measurable client impact"
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
      degree: "B.A. Computer Science & Economics (Dual Major)",
      timeline: "Sep 2024 – Dec 2028 (Expected)",
      gpa: "3.89",
      details: [
        "Dean's List Scholar for academic excellence",
        "Active in tech communities: Data Hackathon winner, Business Information Technology Society",
        "Interdisciplinary focus positioning for roles at intersection of tech and business strategy",
      ],
    },
    {
      school: "John P Stevens High School",
      degree: "High School Diploma",
      timeline: "2020 – 2024",
      details: [
        "Strong foundation in STEM with honors in Computer Science and Mathematics",
        "Early passion for technology and innovation",
        "In various National Honor Societies and was the Vice President of the Spanish Honor Society"
      ],
    },
  ] as EducationItem[],
  skills: {
    product: ["Hackathon Innovation", "AI/ML Strategy", "Fintech Thinking", "MVP Development", "Cross-functional Leadership"],
    engineering: ["Python", "Node.js", "TypeScript", "React", "Streamlit", "Machine Learning", "NLP", "APIs"],
    tools: ["Gemini API", "ElevenLabs", "Snowflake", "Power BI", "Canvas LMS", "Google Drive API", "Git", "Jupyter"],
  },
  certifications: [
    "Power BI Essential Training – LinkedIn Learning (Data Modeling & Visualization)",
    "Dean's List Scholar – Rutgers University",
    "Goldman Sachs Engineering Possibilities Summit – Selected from 10,000+ applicants",
    "BNY Mellon Freshman Jumpstart Program – 2025",
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
      {
        product: "Basement at 6:17 — Murder Mystery",
        role: "Solo Builder & Game Designer",
        problem: "Running in-person murder mystery games required manual coordination for 13+ players with no real-time host dashboard.",
        approach: "Designed token-based auth for host/player separation, built real-time clue reveal system, integrated Twilio for phone notifications.",
        outcome: "Deployed game engine supporting 13+ concurrent players with host admin panel, vote weighting, and round reset on Vercel.",
      },
    ],
  },
};
