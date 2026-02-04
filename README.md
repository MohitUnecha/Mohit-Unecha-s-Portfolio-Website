# Mohit Unecha Portfolio 
[mohitunecha.com
](mohitunecha.com)

This repository contains a full-stack personal portfolio with an AI chatbot placeholder.

## Monorepo Structure
- frontend: Next.js (App Router, Tailwind)
- backend: Node/Express API

## Local Development
1. Frontend
   - Create env file: `frontend/.env.local`
   - Add: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
   - Install & run:
     - `npm install`
     - `npm run dev`

2. Backend
   - Create env file: `backend/.env`
   - Add:
     - `PORT=4000`
     - `FRONTEND_ORIGIN=http://localhost:3000`
   - Install & run:
     - `npm install`
     - `npm run dev`

## Deployment (Fully Deployable)
### Backend
- Host the backend with any Node-compatible host.
- Set environment variables:
  - `PORT` (provided by host)
  - `FRONTEND_ORIGIN` (your deployed frontend URL)
- Start command: `npm run start`

### Frontend
- Host the frontend with any Next.js-compatible host.
- Set environment variables:
  - `NEXT_PUBLIC_API_BASE_URL` (your deployed backend URL)
- Build command: `npm run build`
- Start command: `npm run start`

## Chatbot
The chatbot is a placeholder that returns a canned response. You can connect a trained model later by updating `backend/src/index.js` and the frontend `ChatbotPanel` if needed.
