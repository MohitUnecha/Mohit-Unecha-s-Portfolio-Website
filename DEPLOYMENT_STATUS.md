# Deployment Complete! 🎉

## URLs

**Frontend (Custom Domain):**
https://mohitunecha.com/

**Backend (Vercel):**
https://mohit-unecha-s-portfolio-website.vercel.app/

## Important: Update Vercel Environment Variables

You MUST update the `FRONTEND_ORIGIN` variable in your Vercel dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project: `mohit-unecha-s-portfolio-website`
3. Go to **Settings** → **Environment Variables**
4. Update `FRONTEND_ORIGIN` to:
   ```
   https://mohitunecha.com
   ```
5. **Redeploy** your backend for changes to take effect

This allows the backend to accept requests from your custom domain (CORS).

## Current Configuration

### Frontend
- Configured to call backend at: `https://mohit-unecha-s-portfolio-website.vercel.app`
- Hosted on GitHub Pages with automatic deployments on push to main

### Backend
- Hosted on Vercel
- Accepts requests from GitHub Pages origin
- All environment variables configured

## Testing

Visit: https://mohitunecha.github.io/Mohit-Unecha-s-Portfolio-Website/

The chatbot should now work with your live backend!
