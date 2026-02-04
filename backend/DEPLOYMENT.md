# Backend Deployment Guide

## Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI (optional but recommended)

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from backend directory:**
   ```bash
   cd backend
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? (accept default or customize)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. **Set environment variables:**
   ```bash
   vercel env add FRONTEND_ORIGIN
   vercel env add RECAPTCHA_SECRET_KEY
   vercel env add GEMINI_API_KEY
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** backend
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
4. Add environment variables in settings:
   - `FRONTEND_ORIGIN` - Your frontend URL
   - `RECAPTCHA_SECRET_KEY` - Your reCAPTCHA secret
   - `GEMINI_API_KEY` - Your Gemini API key
   - `EMAIL_USER` - Your email for nodemailer
   - `EMAIL_PASS` - Your email password/app password
5. Click **Deploy**

### After Deployment

Your backend will be available at: `https://your-project-name.vercel.app`

Update your frontend to use this URL for API calls.
