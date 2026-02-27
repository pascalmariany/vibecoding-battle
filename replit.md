# Vibe Coden Battle - Technova College

## Overview
A voting platform for the Vibe Coden training at Technova College Ede. Participants can submit their web apps, vote on them using 3 criteria (each 0-2 points), and view a scoreboard with a top 3.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js with express-session (pg-backed sessions)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Technova College branding (#3B28A0 purple-blue primary, Raleway font)
- **Auth**: Admin login via email/password (env vars ADMIN_EMAIL, ADMIN_PASSWORD)

## Data Model
- `webapps`: Submitted web apps (teamName, appName, description, url)
- `votes`: Individual votes with 3 criteria scores (0-2 each)
- `users`: Base user table (not actively used)

## Scoring Criteria
1. **Leswaarde (0-2)**: Leerdoel & Student Output
2. **Creatieve Twist (0-2)**: Originele Invalshoek
3. **Gamification met Leerimpact (0-2)**: Game-Prikkel & Leergedrag

## Pages
- `/` - Home with hero, webapp grid, and criteria explanation
- `/indienen` - Submit a new web app
- `/stemmen/:id` - Vote on a specific web app
- `/scorebord` - Leaderboard with top 3 podium
- `/admin/login` - Admin login page
- `/admin` - Admin panel (delete webapps, manage submissions)

## API Endpoints
- `GET /api/webapps` - List all webapps with scores
- `GET /api/webapps/:id` - Get single webapp with scores
- `POST /api/webapps` - Submit new webapp
- `DELETE /api/webapps/:id` - Delete webapp (admin only)
- `POST /api/votes` - Cast a vote
- `GET /api/webapps/:id/votes` - Get votes for a webapp
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/status` - Check admin status

## Environment Variables
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password (secret)
- `SESSION_SECRET` - Session encryption secret
- `DATABASE_URL` - PostgreSQL connection string

## Key Files
- `shared/schema.ts` - Drizzle schema & types
- `server/db.ts` - Database connection
- `server/storage.ts` - DatabaseStorage class (with deleteWebapp)
- `server/routes.ts` - API routes with admin auth middleware
- `client/src/components/Header.tsx` - Navigation header (shows Admin when logged in)
- `client/src/components/WebappCard.tsx` - Webapp display card
- `client/src/components/ScoreSlider.tsx` - Score input component
- `client/src/pages/Admin.tsx` - Admin panel
- `client/src/pages/AdminLogin.tsx` - Admin login form
