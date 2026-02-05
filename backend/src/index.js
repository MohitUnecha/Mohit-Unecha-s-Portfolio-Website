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
  if (geminiModelName) return geminiModelName;
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    throw new Error("GEMINI_API_KEY environment variable is missing");
  }

  // Use fallback model directly - don't make API call which might timeout
  geminiModelName = "gemini-2.0-flash";
  console.log("Using Gemini model:", geminiModelName);
  return geminiModelName;
};

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

// Jarvis AI Chat Endpoint with Gemini
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  const safeMessage = typeof message === "string" ? message.trim() : "";

  console.log("Chat request received:", { safeMessage: safeMessage.substring(0, 50) });

  if (!safeMessage) {
    return res.status(400).json({
      reply: "Please provide a message so I can respond.",
    });
  }

  // If Gemini is not configured, return placeholder
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured");
    return res.status(500).json({
      reply: "AI service not configured. Please contact the site owner.",
    });
  }
  if (!genAI) {
    return res.json({
      reply: "Thanks for your message! Please configure GEMINI_API_KEY in .env to enable AI-powered responses.",
    });
  }

  try {
    const modelName = await pickGeminiModel();
    if (!modelName) {
      throw new Error("Failed to select a Gemini model");
    }
    
    console.log("Creating model with:", modelName);
    const model = genAI.getGenerativeModel({ model: modelName });

    // System prompt with comprehensive information about Mohit
    const systemPrompt = `You are Jarvis, Mohit Unecha's AI assistant on his portfolio website. You are friendly, professional, and knowledgeable about Mohit. 

**WHO MOHIT IS (BIG PICTURE):**
Mohit is a mission-driven, high-achieving builder who blends technology, business, and impact. His personal mission: "To lead with empathy and leave a lasting impact on society."

**CAREER PATH & AMBITIONS:**
- Incoming Product & Software Engineer Intern at Microsoft (Summer 2026, Redmond) working on Microsoft 365 Core
- 5-year goal: Product Lead or Technical PM in hybrid SWE/PM role
- Dream companies: Palantir, Capital One, high-impact AI companies

**EDUCATION:**
- Rutgers University: CS + Economics dual major (GPA: 3.89, Dean's List)

**CURRENT PROJECTS:**
1. Stock Market AI Tool with transformer models + RAG
2. Sports Analytics with Avira Digital (UFL, Formula E, NWSL, WNBA, PLL)
3. Scarlet Agent: AI personal assistant for students
4. mohitwrites.xyz: Poetry, essays, podcasts

**TEACHING & MENTORSHIP:**
- Deeply committed to teaching and giving back
- Tutors: Chess, Coding (Python, Scratch, Java), Math, AP Micro, Finance
- Taught 250+ students in coding, 100+ students in chess

**SKILLS:**
- Languages: Python, Node.js, TypeScript, React, JavaScript
- Tools: Gemini API, Pinecone, Canvas LMS, Google Drive API, Git

**PERSONAL INTERESTS:**
- Cars: Loves Bugatti, Ferrari, McLaren, Tesla
- Hobbies: Traveling (Japan, Switzerland, Italy, Dubai), hiking, golfing, chess, Formula 1
- Food: Indian (butter chicken, biryani), Italian, Japanese

**CONTACT:**
Email: mohitkunecha@gmail.com | Phone: (848) 248 6750 | LinkedIn: linkedin.com/in/mohitunecha | GitHub: github.com/MohitUnecha

**RESPONSE GUIDELINES:**
- Be conversational, friendly, and enthusiastic
- Keep responses concise (2-4 sentences) unless detailed explanation is requested
- Use first person when speaking as Jarvis
- Direct users to the contact form for collaborations`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: safeMessage }]
        }
      ],
      systemInstruction: systemPrompt
    });
    const response = await result.response;
    const reply = response.text();

    return res.json({ reply });
  } catch (error) {
    console.error("=== CHAT ENDPOINT ERROR ===");
    console.error("Error message:", error?.message);
    console.error("Error name:", error?.name);
    console.error("Full error:", JSON.stringify(error, null, 2));
    console.error("=========================");
    
    console.error("Gemini API error:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      details: error?.errorDetails,
      stack: error?.stack,
    });
    
    // Log more details for debugging
    if (error?.message?.includes("API")) {
      console.error("API-related error detected:", error.message);
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
