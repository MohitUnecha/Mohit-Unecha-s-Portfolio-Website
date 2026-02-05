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
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-3.5-turbo";

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

// Jarvis AI Chat Endpoint with OpenAI
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  const safeMessage = typeof message === "string" ? message.trim() : "";

  console.log("Chat request received:", { safeMessage: safeMessage.substring(0, 50) });

  if (!safeMessage) {
    return res.status(400).json({
      reply: "Please provide a message so I can respond.",
    });
  }

  // If OpenAI key is not configured, return placeholder
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not configured");
    return res.status(500).json({
      reply: "AI service not configured. Please contact the site owner.",
    });
  }

  try {
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
- Tools: OpenAI API, Canvas LMS, Google Drive API, Git

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

    console.log("Calling OpenAI API with model:", OPENAI_MODEL);
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
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
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    console.log("OpenAI response received successfully");
    
    return res.json({ reply });
  } catch (error) {
    console.error("=== CHAT ENDPOINT ERROR ===");
    console.error("Error message:", error?.message);
    console.error("Error status:", error?.response?.status);
    console.error("Error data:", error?.response?.data);
    console.error("=========================");
    
    // Check for specific OpenAI errors
    if (error?.response?.status === 401) {
      console.error("Invalid OpenAI API key");
    } else if (error?.response?.status === 429) {
      console.error("OpenAI API rate limited");
    } else if (error?.response?.status === 500) {
      console.error("OpenAI API server error");
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
