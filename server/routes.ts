import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWebappSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Niet geautoriseerd" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        return res.status(500).json({ message: "Admin configuratie ontbreekt" });
      }

      if (email === adminEmail && password === adminPassword) {
        req.session.isAdmin = true;
        return res.json({ message: "Ingelogd", isAdmin: true });
      }

      return res.status(401).json({ message: "Ongeldige inloggegevens" });
    } catch (error) {
      res.status(500).json({ message: "Fout bij inloggen" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Fout bij uitloggen" });
      }
      res.json({ message: "Uitgelogd" });
    });
  });

  app.get("/api/admin/status", (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

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

  app.delete("/api/webapps/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Ongeldig ID" });
      }
      await storage.deleteWebapp(id);
      res.json({ message: "Web app verwijderd" });
    } catch (error) {
      res.status(500).json({ message: "Fout bij verwijderen van web app" });
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
