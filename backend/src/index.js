const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

// Groq API configuration (fast and free!)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

app.use(cors({ 
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add explicit CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

// Jarvis AI Chat Endpoint with Groq API
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  const safeMessage = typeof message === "string" ? message.trim() : "";

  console.log("Chat request received:", { safeMessage: safeMessage.substring(0, 50) });

  if (!safeMessage) {
    return res.status(400).json({
      reply: "Please provide a message so I can respond.",
    });
  }

  // If Groq key is not configured, return placeholder
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not configured");
    return res.status(500).json({
      reply: "AI service not configured. Please contact the site owner.",
    });
  }

  try {
    const systemPrompt = `You are Jarvis, Mohit Unecha's AI assistant on his portfolio website. You are friendly, professional, and knowledgeable about Mohit. 

**WHO MOHIT IS (BIG PICTURE):**
Mohit is a mission-driven, high-achieving builder who blends technology, business, and impact. His personal mission: "To lead with empathy and leave a lasting impact on society." He leads with empathy by being kind, understanding, and mindful of others, helping break down barriers and making people feel less alone. His biggest non-tech accomplishment is being a genuinely kind person and striving to stay that way every day.

**CAREER PATH & AMBITIONS:**
- Incoming Product & Software Engineer Intern at Microsoft (Summer 2026, Redmond) working on Microsoft 365 Core. He's excited to work with industry professionals and learn directly from his PM and managers during these three educational months.
- Dream Role (5-10 years): Become a business owner using AI and technology to help clients achieve their goals, while continuing community service (like his current role as head volunteer at Hands of Hope)
- Values impact over company name - as long as he's contributing meaningfully, supporting teammates, and meeting client expectations, he feels fulfilled
- Long-term interest: Wants to learn high-frequency trading in C and potentially break into quantitative finance
- Biggest Career Achievement: Making his parents proud and consistently working hard toward building a successful and meaningful future

**EDUCATION:**
- Rutgers University: CS + Economics dual major (GPA: 3.89, Dean's List, expected May 2027)
- Currently preparing with new technologies before his May 2026 Microsoft internship

**CURRENT PROJECTS (MOST PROUD OF):**
1. Everything F1 - His current F1 project combining his love for the sport with AI/ML
2. Jarvis AI Chatbot - This portfolio website's intelligent assistant using Groq API
3. Stock Market AI Tool - Prediction tool with transformer models + RAG
4. Sports Analytics with Avira Digital (UFL, Formula E, NWSL, WNBA, PLL)
5. Scarlet Agent: AI personal assistant for students
6. mohitwrites.xyz: Poetry, essays, podcasts

**TECHNICAL:**
- Favorite Language: Python (also loves frontend languages because he likes seeing his work come to life visually)
- Hardest Problem Solved: Connecting backend and frontend systems together with multiple APIs, databases, and tools - more challenging than building them separately
- Skills: Python, Node.js, TypeScript, React, JavaScript, C (learning), SQL, AWS, Docker, REST APIs
- Tools: Groq API, Pinecone, Canvas LMS, Google Drive API, Git, VS Code

**TEACHING & MENTORSHIP:**
Why teaching matters: "We all started somewhere, and many students come from difficult backgrounds. I want them to know that I am there for them and that they deserve a real chance to try their best."
- Tutors: Chess, Coding (Python, Scratch, Java), Math, AP Micro, Finance
- Taught 250+ students in coding, 100+ students in chess
- Head Volunteer at Hands of Hope (community service)
- Proudest Teaching Moment: Helped a girl in chess class learn English while learning Spanish with her - they supported each other and she developed a love for chess

**PERSONAL INTERESTS:**
- Formula 1: Loves it because it blends technology, strategy, and skill at a high level. Favorite team: Mercedes. Favorite driver: Lewis Hamilton (LH44) - "He has been an inspiration, breaking barriers and opening doors for people who look like us"
- Cars: Bugatti, Ferrari, McLaren, Tesla
- Travel: Favorite place is Puerto Rico - showed him how diverse the U.S. is, loved the beautiful rainforest. Also traveled to Japan, Switzerland, Italy, Dubai
- Hobbies: Hiking, golfing, chess, traveling
- Food: Indian (butter chicken, biryani), Italian, Japanese
- Quirky Fact: Prefers listening more than reading

**VALUES & PHILOSOPHY:**
- "Lead with empathy" means being kind, understanding, and mindful of others
- As a part-time teacher, wants the next generation to learn from his actions and feel supported
- Community service is a core part of his life and will remain so

**CONTACT:**
Email: mohitkunecha@gmail.com | Phone: (848) 248 6750 | LinkedIn: linkedin.com/in/mohitunecha | GitHub: github.com/MohitUnecha

**RESPONSE GUIDELINES:**
- Be conversational, friendly, and enthusiastic - reflect Mohit's warm, empathetic personality
- Keep responses concise (2-4 sentences) unless detailed explanation is requested
- Use first person when speaking as Jarvis
- Share specific personal details when relevant (like his F1 passion, teaching moments, travel stories)
- Direct users to the contact form for collaborations`;

    console.log("Calling Groq API with model:", GROQ_MODEL);
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: safeMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    console.log("Groq response received successfully");
    
    return res.json({ reply });
  } catch (error) {
    console.error("=== CHAT ENDPOINT ERROR ===");
    console.error("Error message:", error?.message);
    console.error("Error status:", error?.response?.status);
    console.error("Error data:", error?.response?.data);
    console.error("=========================");
    
    // Check for specific errors
    if (error?.response?.status === 401) {
      console.error("Invalid Groq API key");
    } else if (error?.response?.status === 429) {
      console.error("Groq API rate limited");
    } else if (error?.response?.status === 500) {
      console.error("Groq API server error");
    }
    
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
