import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWebappSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/webapps", async (_req, res) => {
    try {
      const webapps = await storage.getWebapps();
      res.json(webapps);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van web apps" });
    }
  });

  app.get("/api/webapps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Ongeldig ID" });
      }
      const webapp = await storage.getWebapp(id);
      if (!webapp) {
        return res.status(404).json({ message: "Web app niet gevonden" });
      }
      res.json(webapp);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van web app" });
    }
  });

  app.post("/api/webapps", async (req, res) => {
    try {
      const parsed = insertWebappSchema.parse(req.body);
      const webapp = await storage.createWebapp(parsed);
      res.status(201).json(webapp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Fout bij indienen van web app" });
    }
  });

  app.post("/api/votes", async (req, res) => {
    try {
      const parsed = insertVoteSchema.parse(req.body);

      if (!parsed.voterName || parsed.voterName.trim().length < 1) {
        return res.status(400).json({ message: "Vul je naam in" });
      }

      if (parsed.criterium1 < 0 || parsed.criterium1 > 2 ||
          parsed.criterium2 < 0 || parsed.criterium2 > 2 ||
          parsed.criterium3 < 0 || parsed.criterium3 > 2) {
        return res.status(400).json({ message: "Scores moeten tussen 0 en 2 liggen" });
      }

      const webapp = await storage.getWebapp(parsed.webappId);
      if (!webapp) {
        return res.status(404).json({ message: "Web app niet gevonden" });
      }

      const vote = await storage.createVote(parsed);
      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Fout bij opslaan van stem" });
    }
  });

  app.get("/api/webapps/:id/votes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Ongeldig ID" });
      }
      const votes = await storage.getVotesForWebapp(id);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ message: "Fout bij ophalen van stemmen" });
    }
  });

  return httpServer;
}
