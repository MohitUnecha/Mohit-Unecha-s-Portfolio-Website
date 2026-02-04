# Contact Form Setup Instructions

The contact form is now fully implemented with **production-ready spam protection**! Here's what was done:

## Frontend Changes
- ✅ Replaced the "Get In Touch" section with a functional contact form
- ✅ Form includes fields for: Name, Email, Subject, Message
- ✅ Form has theme-aware styling (emerald accents in dark mode, blue in light mode)
- ✅ Shows loading state while sending
- ✅ Displays success/error messages
- ✅ Auto-clears after successful submission
- ✅ **NEW:** Integrated Google reCAPTCHA v3 for bot protection

## Backend Changes
- ✅ Added `/api/contact` endpoint to handle form submissions
- ✅ Validates all required fields
- ✅ Validates email format
- ✅ Sends email via nodemailer + Gmail SMTP
- ✅ Sets reply-to header to sender's email
- ✅ **NEW:** Rate limiting (5 submissions per IP per 15 minutes)
- ✅ **NEW:** reCAPTCHA verification with bot detection

## Email Configuration (IMPORTANT)

To enable email sending, you need to:

### 1. Enable 2-Factor Authentication on your Gmail account
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

### 2. Create an App Password
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password

### 3. Update `.env` file in `/backend/.env`
```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
EMAIL_USER=mohitkunecha@gmail.com
EMAIL_PASS=paste-your-16-char-app-password-here
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key-here
```

### 4. Restart the backend server
```bash
cd backend
npm run dev
```

## reCAPTCHA Setup (Optional but Recommended for Production)

To enable invisible bot protection:

### 1. Get reCAPTCHA Keys
   - Go to https://www.google.com/recaptcha/admin
   - Create a new site
   - Choose reCAPTCHA v3 (invisible bot detection)
   - Add your domain(s)
   - Copy the **Site Key** and **Secret Key**

### 2. Update Environment Variables

**Backend (`/backend/.env`):**
```env
RECAPTCHA_SECRET_KEY=your-google-recaptcha-secret-key
```

**Frontend (`/frontend/.env.local`):**
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-google-recaptcha-site-key
```

### 3. How reCAPTCHA v3 Works
- **Invisible:** No user interaction needed
- **Score-based:** Returns a score 0.0-1.0 indicating likelihood of bot (0=bot, 1=human)
- **Threshold:** Requests with score < 0.5 are blocked
- **No UI:** Users won't see any CAPTCHA challenge

## Rate Limiting

The contact form is protected with rate limiting:
- **Limit:** 5 submissions per IP address
- **Window:** 15 minutes
- **Response:** HTTP 429 Too Many Requests when limit exceeded
- **Purpose:** Prevents spam and DoS attacks

## How It Works

1. User fills out the form (Name, Email, Subject, Message)
2. JavaScript executes reCAPTCHA v3 silently in background
3. Form submission sends reCAPTCHA token + form data to `/api/contact`
4. Backend validates:
   - Rate limit (5 per 15 min per IP)
   - Email format
   - reCAPTCHA score (if configured)
5. Backend sends email to `mohitkunecha@gmail.com` with:
   - Subject: `Portfolio Contact: [User's Subject]`
   - HTML formatted content with all form details
   - Reply-To: User's email address
6. Frontend shows success/error message
7. Form clears automatically after success

## Testing

### Test Without reCAPTCHA (Local Development)
1. Leave `RECAPTCHA_SECRET_KEY` empty in `.env`
2. The form will submit without CAPTCHA verification
3. Rate limiting will still protect against spam

### Test Rate Limiting
```bash
# Send 5 successful requests (all succeed)
for i in {1..5}; do
  curl -X POST http://localhost:4000/api/contact \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Message\"}"
  echo ""
done

# 6th request will be blocked (HTTP 429)
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Message\"}"
```

## Security Considerations

### ✅ Implemented Protections
- Email validation (regex check for valid email format)
- Required field validation
- CORS configured to accept only frontend origin
- Rate limiting per IP address
- Bot detection via reCAPTCHA v3
- No sensitive data exposed in responses
- Error messages don't leak system information

### 🔒 Production Recommendations
- Keep API keys secure (never commit to git)
- Monitor rate limiting metrics
- Log all contact form submissions
- Set up email alerts for spam patterns
- Consider additional validation (honeypot field)
- Review reCAPTCHA scores regularly
- Implement request signing for additional security

## Troubleshooting

### "Too many contact form submissions" error
- Rate limit exceeded (5 per 15 min)
- Wait 15 minutes or use different IP address
- Can be configured in `/backend/src/index.js` line ~19

### "CAPTCHA verification failed" error
- Might indicate bot activity
- Refresh page and try again
- Or check reCAPTCHA dashboard for blocked requests

### Email not sending
- Check Gmail app password is entered correctly (remove spaces)
- Verify 2FA is enabled on Gmail account
- Check SMTP credentials in `.env`
- Review backend logs for detailed error messages

### reCAPTCHA not loading
- Verify Site Key is correct in `.env.local`
- Check browser console for errors
- Ensure reCAPTCHA admin dashboard has your domain
- Clear browser cache and reload

---

## Copyright & License

© 2026 Mohit Unecha. All rights reserved.

This contact form documentation and implementation is part of the personal portfolio website. All code and documentation are provided as-is for personal use. Unauthorized reproduction or distribution without permission is prohibited.

**Third-party Services:**
- Google reCAPTCHA: Subject to [Google's Terms of Service](https://policies.google.com/terms)
- Nodemailer: Licensed under [MIT License](https://github.com/nodemailer/nodemailer/blob/master/LICENSE)
- Express.js: Licensed under [MIT License](https://github.com/expressjs/express/blob/master/LICENSE)
