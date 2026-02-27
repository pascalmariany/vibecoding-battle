# Vibe Coden Battle - Technova College

## Overview
A voting platform for the Vibe Coden training at Technova College Ede. Participants can submit their web apps, vote on them using 3 criteria (each 0-2 points), and view a scoreboard with a top 3.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Technova College branding (#002F94 primary, Raleway font)

## Data Model
- `webapps`: Submitted web apps (teamName, appName, description, url)
- `votes`: Individual votes with 3 criteria scores (0-2 each)
- `users`: Base user table (not actively used yet)

## Scoring Criteria
1. **Leswaarde (0-2)**: Leerdoel & Student Output
2. **Creatieve Twist (0-2)**: Originele Invalshoek
3. **Gamification met Leerimpact (0-2)**: Game-Prikkel & Leergedrag

## Pages
- `/` - Home with hero, webapp grid, and criteria explanation
- `/indienen` - Submit a new web app
- `/stemmen/:id` - Vote on a specific web app
- `/scorebord` - Leaderboard with top 3 podium

## API Endpoints
- `GET /api/webapps` - List all webapps with scores
- `GET /api/webapps/:id` - Get single webapp with scores
- `POST /api/webapps` - Submit new webapp
- `POST /api/votes` - Cast a vote
- `GET /api/webapps/:id/votes` - Get votes for a webapp

## Key Files
- `shared/schema.ts` - Drizzle schema & types
- `server/db.ts` - Database connection
- `server/storage.ts` - DatabaseStorage class
- `server/routes.ts` - API routes
- `server/seed.ts` - Seed data
- `client/src/components/Header.tsx` - Navigation header
- `client/src/components/WebappCard.tsx` - Webapp display card
- `client/src/components/ScoreSlider.tsx` - Score input component
