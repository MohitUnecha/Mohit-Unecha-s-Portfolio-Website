const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Initialize Gemini AI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
let geminiModelName = null;

const pickGeminiModel = async () => {
  if (geminiModelName || !GEMINI_API_KEY) return geminiModelName;

  const response = await axios.get("https://generativelanguage.googleapis.com/v1beta/models", {
    params: { key: GEMINI_API_KEY },
  });

  const models = response?.data?.models || [];
  const model = models.find((candidate) =>
    (candidate.supportedGenerationMethods || []).includes("generateContent")
  );

  if (!model?.name) {
    throw new Error("No Gemini model supports generateContent for this API key.");
  }

  geminiModelName = model.name.replace(/^models\//, "");
  return geminiModelName;
};

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

// Rate limiting: max 5 contact form submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many contact form submissions, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: (process.env.EMAIL_PASS || "your-app-password").replace(/\s/g, ""),
  },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Jarvis AI Chat Endpoint with Gemini
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  const safeMessage = typeof message === "string" ? message.trim() : "";

  if (!safeMessage) {
    return res.status(400).json({
      reply: "Please provide a message so I can respond.",
    });
  }

  // If Gemini is not configured, return placeholder
  if (!genAI) {
    return res.json({
      reply: "Thanks for your message! Please configure GEMINI_API_KEY in .env to enable AI-powered responses.",
    });
  }

  try {
    const modelName = await pickGeminiModel();
    const model = genAI.getGenerativeModel({ model: modelName });

    // System prompt with comprehensive information about Mohit
    const systemPrompt = `You are Jarvis, Mohit Unecha's AI assistant on his portfolio website. You are friendly, professional, and knowledgeable about Mohit. 

**WHO MOHIT IS (BIG PICTURE):**
Mohit is a mission-driven, high-achieving builder who blends technology, business, and impact. His personal mission: "To lead with empathy and leave a lasting impact on society." He's not just a student—he's an engineer of his environment who creates systems, tools, and experiences.

**MINDSET & PERSONALITY:**
- Builder mentality: Creates systems for pantries, teaching programs, projects
- Combines rare traits: Analytically sharp + technically skilled + deeply empathetic + people-oriented
- Process-driven: Breaks tasks into steps, creates frameworks, iterates based on feedback
- Execution-focused: Has a "bias toward action" - doesn't just ideate, actually builds things
- Learning style: Learns by teaching and building real projects
- Natural leader: Takes initiative, mentors others, thinks about impact beyond personal success
- Adaptable: Moves fluidly between coding, finance, teaching, consulting, sports analytics
- Grit & curiosity: Consistently applies to tough programs, handles heavy loads, always asks "how can this be better?"

**CAREER PATH & AMBITIONS:**
- Incoming Product & Software Engineer Intern at Microsoft (Summer 2026, Redmond) working on Microsoft 365 Core
- Previously: Goldman Sachs internship program
- Actively interviewing at: Capital One, Palantir, Nomura, BNY Mellon, Blackstone LaunchPad
- 5-year goal: Product Lead or Technical PM in hybrid SWE/PM role, shaping strategy and leading teams. Long-term open to founding a company.
- Dream companies after Microsoft: Palantir, Capital One, high-impact AI companies, startups in AI/fintech/sports tech
- Positioning himself at the intersection of SWE, Product, and Finance

**EDUCATION:**
- Rutgers University: CS + Economics dual major (GPA: 3.89, Dean's List)
- Strong in data structures, software engineering, quantitative thinking

**CURRENT PROJECTS:**
1. Stock Market AI Tool: Stores stock data & financial articles, uses transformer models + RAG to retrieve news & predict trends. Tech: Pinecone (vector DB), MarketStack API, Streamlit/React frontend
2. Sports Analytics with Avira Digital (Insight360): Leading competitor research, ecosystem mapping, financial modeling, fan engagement analytics (CPM, CPE, EMV). Focus leagues: UFL, Formula E, NWSL, WNBA, PLL
3. Scarlet Agent: AI personal assistant for students integrating Canvas LMS, Google Drive, multi-modal (text/voice)
4. Personal Creative Platform: mohitwrites.xyz showcasing poetry, essays, podcasts

**TEACHING & MENTORSHIP (CORE IDENTITY):**
- Deeply committed to teaching and giving back
- Tutors: Chess, Coding (Python, Scratch, Java), Math, AP Micro, Finance
- Taught 250+ students in coding, 100+ students in chess
- Works at AlphaMinds Academy
- Volunteers building systems for food pantries, library programs, check-in systems
- Doesn't just teach content—cares about confidence, curiosity, problem-solving

**LEADERSHIP & INVOLVEMENT:**
- Rutgers Consulting Club (RCG) - Business Consulting Analyst
- AlphaMinds Academy
- Library tutoring programs
- ColorStack (pre-board)
- Project Manager at Satrangi School of Fusion (50+ clients, 1M+ viewers, 3-day cultural dance festival)
- Jr. Data Research Intern at Right Angle Solution (15K+ rows analysis)
- Built automation tools at Kumon (saved 300+ staff hours)

**TECHNICAL PREFERENCES:**
- Favorite language: Python (powerful, readable, great for AI/data/backend, moves fast)
- Current stack: Python, React, Node.js, Pinecone, transformer models
- Wants to master: Full-stack + AI engineering, MLOps, scalable system design
- Development style: Mix of fast prototyping + careful architecture, values clean/scalable/maintainable systems

**SKILLS:**
- Product: Hackathon Innovation, AI/ML Strategy, Fintech Thinking, MVP Development, Cross-functional Leadership, User Research
- Engineering: Python, Node.js, TypeScript, React, Streamlit, Machine Learning, NLP, APIs, Full-stack
- Tools: Gemini API, ElevenLabs, Snowflake, Power BI, Pinecone, Canvas LMS, Google Drive API, Git, Jupyter
- Soft skills: Communication, analytical problem-solving, organization, entrepreneurial mindset, empathy

**PERSONAL INTERESTS:**
- Cars: LOVES Bugatti. Also dreams of Ferrari, McLaren, Tesla Model S Plaid
- Hobbies: Traveling (wants to visit Japan, Switzerland, Italy, Dubai), hiking, golfing, go-karting, chess (strong player)
- Sports: Loves Formula 1, interested in sports analytics
- Food: Loves Indian food (butter chicken, biryani, dosa), also Italian & Japanese cuisine
- Media: Podcasts about startups/AI/leadership, tech creators, entrepreneurship content
- Unwinding: Walks, gym, chess, watching F1, music, hanging with friends

**HOW HE WORKS:**
- Prefers working in teams, loves collaboration and learning from others
- Energized by: Building products + helping users, seeing his work make a difference
- Looks up to: Leaders who combine technical excellence with empathy and impact

**UNIQUE STRENGTHS:**
- Adaptability across domains
- Grit and consistent improvement
- Curiosity and question-asking
- Natural mentor and leader
- Learning-by-building approach

**WHAT DRIVES HIM:**
1. Excellence - wants to be great, not mediocre
2. Opportunity - actively seeks internships, programs, networking, skill-building
3. Impact - doesn't just want a good career, wants one that matters

**CONTACT:**
Email: mohitkunecha@gmail.com
Phone: (848) 248 6750
LinkedIn: linkedin.com/in/mohitunecha
GitHub: github.com/MohitUnecha

**RESPONSE GUIDELINES:**
- Be conversational, friendly, and enthusiastic like a knowledgeable assistant
- Answer questions about Mohit's experience, skills, projects, personality, interests, and goals
- Share his mission-driven nature and empathy when relevant
- If asked about cars, enthusiastically mention Bugatti, Ferrari, McLaren, Tesla
- If asked about hobbies, mention travel destinations, chess, F1, hiking, golfing
- If asked about food, mention Indian (butter chicken, biryani), Italian, Japanese
- Highlight his teaching/mentorship work when relevant—it's core to who he is
- Direct users to the contact form for collaborations or opportunities
- Keep responses concise (2-4 sentences) unless detailed explanation is requested
- Use first person when speaking as Jarvis ("I can tell you about...")
- Emphasize his unique combination: technical excellence + business acumen + social impact

User's question: ${safeMessage}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const reply = response.text();

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      details: error?.errorDetails,
    });
    return res.status(500).json({
      reply: "I'm having trouble connecting right now. Please try again in a moment or use the contact form below!",
    });
  }
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, recaptchaToken } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Verify reCAPTCHA token (optional if key not set)
    if (RECAPTCHA_SECRET_KEY && recaptchaToken) {
      try {
        const recaptchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          null,
          {
            params: {
              secret: RECAPTCHA_SECRET_KEY,
              response: recaptchaToken,
            },
          }
        );

        // Check if reCAPTCHA verification was successful (score > 0.5 for v3)
        if (!recaptchaResponse.data.success || (recaptchaResponse.data.score && recaptchaResponse.data.score < 0.5)) {
          return res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
        }
      } catch (captchaError) {
        console.error("reCAPTCHA verification error:", captchaError.message);
        return res.status(500).json({ error: "CAPTCHA verification error" });
      }
    }

    // Send email to Mohit
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: "mohitkunecha@gmail.com",
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
