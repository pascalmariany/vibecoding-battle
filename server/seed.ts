import { db } from "./db";
import { webapps, votes } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existing = await db.select({ count: sql<number>`count(*)` }).from(webapps);
  if (existing[0].count > 0) return;

  const seedApps = [
    {
      teamName: "Team Rekenmeesters",
      appName: "MathQuest",
      description: "Een interactieve wiskunde-app waar studenten door levels heen werken door vergelijkingen op te lossen. Met een progress bar en badges voor elke behaalde vaardigheid.",
      url: "https://mathquest-demo.replit.app",
    },
    {
      teamName: "De Taalvirtuozen",
      appName: "TaalHero",
      description: "Een gamified spelling- en grammatica trainer. Studenten verdienen punten door correct Nederlands te schrijven en kunnen hun scores vergelijken op een leaderboard.",
      url: "https://taalhero-demo.replit.app",
    },
    {
      teamName: "Code Creators",
      appName: "BioFlash",
      description: "Flashcard-app voor biologie met spaced repetition. De app past zich aan op basis van wat de student al kent en focust op zwakke punten.",
      url: "https://bioflash-demo.replit.app",
    },
    {
      teamName: "Team Innovation",
      appName: "GeoChallenge",
      description: "Een aardrijkskunde quiz-game waarbij studenten landen, steden en rivieren moeten plaatsen op een interactieve kaart. Inclusief multiplayer modus.",
      url: "https://geochallenge-demo.replit.app",
    },
  ];

  const insertedApps = await db.insert(webapps).values(seedApps).returning();

  const seedVotes = [
    { webappId: insertedApps[0].id, voterName: "Lisa", criterium1: 2, criterium2: 2, criterium3: 2 },
    { webappId: insertedApps[0].id, voterName: "Tom", criterium1: 2, criterium2: 1, criterium3: 2 },
    { webappId: insertedApps[0].id, voterName: "Sara", criterium1: 1, criterium2: 2, criterium3: 1 },
    { webappId: insertedApps[1].id, voterName: "Jan", criterium1: 2, criterium2: 1, criterium3: 1 },
    { webappId: insertedApps[1].id, voterName: "Eva", criterium1: 1, criterium2: 2, criterium3: 1 },
    { webappId: insertedApps[2].id, voterName: "Mark", criterium1: 1, criterium2: 1, criterium3: 2 },
    { webappId: insertedApps[2].id, voterName: "Anna", criterium1: 2, criterium2: 1, criterium3: 1 },
    { webappId: insertedApps[3].id, voterName: "Piet", criterium1: 1, criterium2: 1, criterium3: 1 },
  ];

  await db.insert(votes).values(seedVotes);

  console.log("Database seeded with example data");
}
