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
  heroBackgroundImage: "/hero-bg.jpg",
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
      name: "Scarlet Agent",
      summary:
        "AI-driven personal assistant for students that integrates Canvas LMS, Google Drive, and multi-modal communication (text & voice) to streamline academic life.",
      stack: ["Python", "Streamlit", "Gemini API", "ElevenLabs", "Snowflake", "Node.js", "HTML/CSS"],
      impact: [
        "Successfully scraped Canvas data when API access failed",
        "Real-time assignment deadline pulling and resource discovery",
        "Multi-modal interface enabling text and voice interaction",
        "HackRU Fall 2025 submission demonstrating working multi-agent AI ecosystem",
      ],
    },
    {
      name: "AI Stock Predictor",
      summary:
        "Barclays Data Hackathon winner: Stock market prediction system fusing market data, financial news, and AI sentiment analysis into actionable trading signals.",
      stack: ["Python", "Machine Learning", "NLP", "Sentiment Analysis", "Finance APIs"],
      link: "https://github.com/CANTSOAR/bitsdatathon",
      impact: [
        "1st place winner at Rutgers Data Hackathon sponsored by Barclays",
        "Custom Retrieval-Augmented Transformer (RAT) model for real-time predictions",
        "Generated buy/sell signals by analyzing news sentiment and market trends",
        "Showcased creativity and teamwork under tight competition deadlines",
      ],
    },
    {
      name: "Personal Creative Platform",
      summary:
        "Minimalist personal website (mohitwrites.xyz) showcasing writing, projects, and creative storytelling with multimedia integration.",
      stack: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
      link: "https://github.com/MohitUnecha/tech_portfolio_site",
      impact: [
        "Clean, modern design for sharing poetry, essays, and podcasts",
        "Multimedia-rich storytelling experience with audio and image integration",
        "Demonstrates web development skills and design sensibility",
        "Active creative outlet blending technical skills with artistic expression",
      ],
    },
    {
      name: "Personal Portfolio Website",
      summary:
        "Full-stack portfolio website showcasing projects, experience, and AI-powered chatbot assistant. Built with Next.js frontend deployed on GitHub Pages and Express backend on Vercel.",
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Express.js", "Node.js", "Groq API", "Nodemailer", "reCAPTCHA"],
      link: "https://github.com/MohitUnecha/Mohit-Unecha-s-Portfolio-Website",
      impact: [
        "Deployed full-stack application with GitHub Pages (frontend) and Vercel (backend)",
        "Integrated Jarvis AI chatbot powered by Groq API with Llama 3.3 model for interactive career guidance",
        "Implemented contact form with email notifications, rate limiting, and reCAPTCHA v3 verification",
        "Responsive design with dark mode support and smooth animations using Tailwind CSS",
        "Auto-scrolling chat with clickable email and social media links",
      ],
    },
    {
      name: "Everything F1",
      summary:
        "Full-stack Formula 1 analytics platform combining machine learning predictions with interactive race visualization. Predicts race outcomes using telemetry data and replays races on an interactive track map with lap-by-lap analysis.",
      stack: ["Python", "FastF1", "LightGBM", "XGBoost", "PostgreSQL", "FastAPI", "Next.js", "React", "WebGL", "Pandas", "NumPy", "Scikit-learn"],
      link: "https://github.com/MohitUnecha/Everything-F1",
      linkLabel: "Incoming",
      impact: [
        "Developed ML models predicting F1 race outcomes including win, podium, and top-10 probabilities using historical telemetry and weekend data",
        "Built interactive race replay system allowing users to scrub through races, visualize car positions, tyre strategies, pit stops, and safety cars on track map",
        "Integrated FastF1 library to ingest official F1 timing data, telemetry (speed, throttle, brake, gears), and race control messages",
        "Created explainable predictions showing pace comparisons, tyre degradation analysis, strategy impacts, and overtaking difficulty metrics",
        "Designed scalable architecture with PostgreSQL for structured data and Parquet columnar storage for large telemetry time series",
        "Built REST APIs with FastAPI serving race data, predictions, and replay frames to Next.js/React frontend",
      ],
    },
  ] as ProjectItem[],
  education: [
    {
      school: "Rutgers University",
      degree: "B.A. Computer Science & Economics (Dual Major)",
      timeline: "Sep2024 – Dec 2027 (Expected)",
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
};
