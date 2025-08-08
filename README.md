### Mystery Message — Anonymous Messaging Platform

A Next.js app that lets users create public profiles and receive anonymous messages with optional AI-suggested prompts.

## Features
- **Auth**: Sign up, email verification, credentials sign-in (NextAuth)
- **Messaging**: Send anonymous messages to `/u/[username]`
- **Dashboard**: Copy profile link, toggle accepting messages, list/delete messages
- **AI Suggestions**: Generate suggested prompts via any AI
- **Validation**: Zod schemas, client + server validation
- **Email**: Verification emails via Resend
- **DB**: MongoDB + Mongoose models

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Auth**: NextAuth (JWT)
- **DB**: MongoDB, Mongoose
- **Email**: Resend
- **AI**: Used Gemini but can be used by any AI of your choice
- **Validation**: Zod, React Hook Form

## Project Structure
```
src/
  app/
    (auth)/sign-in | sign-up | verify/[username]
    (app)/dashboard
    u/[username]
    api/
      auth/[...nextauth]
      sign-up
      verify-code
      check-username-unique
      accept-messages
      get-messages
      send-messages
      delete-message/[messageid]
      suggest-messages
  components/        # UI & shared components
  lib/               # dbConnect, resend instance, utils
  models/            # Mongoose models
  Schemas/           # Zod schemas
  types/             # NextAuth and API types
```

## Prerequisites
- Node.js 18+
- MongoDB connection string
- Resend account (for emails)
- Google Gemini API key

## Environment Variables
Create `.env.local` in the project root:
```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=complex_random_string
# Optional for production
NEXTAUTH_URL=https://your-deployed-domain.com

# Resend (email)
RESEND_API_KEY=your_resend_api_key

# Google Gemini (AI suggestions)
GEMENI_API_KEY=your_gemini_api_key
```

## Setup
```bash
# Install deps
npm install

# Dev
npm run dev

# Build & Start
npm run build
npm start
```
Open `http://localhost:3000`.

## Core Flows
- **Sign Up**: `/sign-up` → checks username availability → registers user → sends code → redirects to `/verify/[username]`
- **Verify Email**: submit code at `/verify/[username]`
- **Sign In**: `/sign-in` (NextAuth Credentials)
- **Dashboard**: `/dashboard` (protected)
- **Public Profile**: `/u/[username]` → send anonymous messages → fetch AI suggestions

## API Endpoints (Summary)
- `POST /api/sign-up` — register user
- `POST /api/verify-code` — verify email with code
- `GET /api/check-username-unique?username=...` — validate username
- `GET /api/get-messages` — fetch user’s messages (auth)
- `POST /api/accept-messages` — toggle accepting messages (auth)
- `POST /api/send-messages` — send message `{ username, content }`
- `DELETE /api/delete-message/[messageid]` — delete a message (auth)
- `POST /api/suggest-messages` — AI suggestions 

## Email (Resend) Setup
- Add `RESEND_API_KEY` to `.env.local`
- Ensure your sender domain is verified in Resend
- Check `src/helpers/sendVerificationEmail.ts` for the email content/template and adjust sender as needed

## AI Suggestions (For Gemini)
- Get a Gemini API key and set `GEMENI_API_KEY`
- Endpoint called by the public profile page: `/api/suggest-messages`

## Authentication & Access Control
- Middleware redirects:
  - Authenticated users → `/dashboard` when visiting `/`, `/sign-in`, `/sign-up`, `/verify/*`
  - Guests → `/sign-in` when visiting `/dashboard`
- Session stored as JWT; extra fields added to token/session

## Troubleshooting
- “Error while checking username”: ensure `MONGODB_URI` is set and reachable
- AI suggestions not working: ensure `GEMENI_API_KEY` is valid
- Emails not arriving: verify sender domain in Resend and check logs
- Build errors about React hooks/component names: ensure page components are exported with a capitalized name

## Scripts
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Lint
```

## License
Add your preferred license here.
