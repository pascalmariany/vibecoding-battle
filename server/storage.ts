import {
  users, webapps, votes,
  type User, type InsertUser,
  type Webapp, type InsertWebapp,
  type Vote, type InsertVote,
  type WebappWithScores,
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWebapps(): Promise<WebappWithScores[]>;
  getWebapp(id: number): Promise<WebappWithScores | undefined>;
  createWebapp(webapp: InsertWebapp): Promise<Webapp>;
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesForWebapp(webappId: number): Promise<Vote[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getWebapps(): Promise<WebappWithScores[]> {
    const allWebapps = await db.select().from(webapps).orderBy(desc(webapps.createdAt));

    const result: WebappWithScores[] = [];
    for (const webapp of allWebapps) {
      const webappVotes = await db.select().from(votes).where(eq(votes.webappId, webapp.id));
      const voteCount = webappVotes.length;

      let avgC1 = 0, avgC2 = 0, avgC3 = 0;
      if (voteCount > 0) {
        avgC1 = webappVotes.reduce((sum, v) => sum + v.criterium1, 0) / voteCount;
        avgC2 = webappVotes.reduce((sum, v) => sum + v.criterium2, 0) / voteCount;
        avgC3 = webappVotes.reduce((sum, v) => sum + v.criterium3, 0) / voteCount;
      }

      result.push({
        ...webapp,
        avgCriterium1: avgC1,
        avgCriterium2: avgC2,
        avgCriterium3: avgC3,
        totalAvg: avgC1 + avgC2 + avgC3,
        voteCount,
      });
    }

    return result.sort((a, b) => b.totalAvg - a.totalAvg);
  }

  async getWebapp(id: number): Promise<WebappWithScores | undefined> {
    const [webapp] = await db.select().from(webapps).where(eq(webapps.id, id));
    if (!webapp) return undefined;

    const webappVotes = await db.select().from(votes).where(eq(votes.webappId, id));
    const voteCount = webappVotes.length;

    let avgC1 = 0, avgC2 = 0, avgC3 = 0;
    if (voteCount > 0) {
      avgC1 = webappVotes.reduce((sum, v) => sum + v.criterium1, 0) / voteCount;
      avgC2 = webappVotes.reduce((sum, v) => sum + v.criterium2, 0) / voteCount;
      avgC3 = webappVotes.reduce((sum, v) => sum + v.criterium3, 0) / voteCount;
    }

    return {
      ...webapp,
      avgCriterium1: avgC1,
      avgCriterium2: avgC2,
      avgCriterium3: avgC3,
      totalAvg: avgC1 + avgC2 + avgC3,
      voteCount,
    };
  }

  async createWebapp(insertWebapp: InsertWebapp): Promise<Webapp> {
    const [webapp] = await db.insert(webapps).values(insertWebapp).returning();
    return webapp;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const [vote] = await db.insert(votes).values(insertVote).returning();
    return vote;
  }

  async getVotesForWebapp(webappId: number): Promise<Vote[]> {
    return db.select().from(votes).where(eq(votes.webappId, webappId));
  }
}

export const storage = new DatabaseStorage();
