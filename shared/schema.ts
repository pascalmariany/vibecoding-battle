import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const webapps = pgTable("webapps", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  appName: text("app_name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  webappId: integer("webapp_id").notNull(),
  voterName: text("voter_name").notNull(),
  criterium1: integer("criterium1").notNull(),
  criterium2: integer("criterium2").notNull(),
  criterium3: integer("criterium3").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webappsRelations = relations(webapps, ({ many }) => ({
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  webapp: one(webapps, {
    fields: [votes.webappId],
    references: [webapps.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebappSchema = createInsertSchema(webapps).omit({
  id: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWebapp = z.infer<typeof insertWebappSchema>;
export type Webapp = typeof webapps.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

export type WebappWithScores = Webapp & {
  avgCriterium1: number;
  avgCriterium2: number;
  avgCriterium3: number;
  totalAvg: number;
  voteCount: number;
};
