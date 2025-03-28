import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertScriptSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // set up authentication routes
  await setupAuth(app);

  // Scripts routes
  app.get("/api/scripts", async (req, res) => {
    try {
      const scripts = await storage.getScripts();
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scripts" });
    }
  });

  app.get("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid script ID" });
      }

      const script = await storage.getScriptById(id);
      if (!script) {
        return res.status(404).json({ error: "Script not found" });
      }

      res.json(script);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch script" });
    }
  });

  app.get("/api/scripts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const scripts = await storage.getScriptsByUserId(userId);
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user scripts" });
    }
  });

  app.post("/api/scripts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const scriptData = {
        ...req.body,
        userId: req.user!.id
      };
      
      const validatedData = insertScriptSchema.parse(scriptData);
      const script = await storage.createScript(validatedData);
      res.status(201).json(script);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create script" });
    }
  });

  app.post("/api/scripts/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid script ID" });
      }

      const script = await storage.updateScriptDownloads(id);
      if (!script) {
        return res.status(404).json({ error: "Script not found" });
      }

      res.json(script);
    } catch (error) {
      res.status(500).json({ error: "Failed to update script downloads" });
    }
  });

  // Users routes
  // Check username availability - this must come before the more generic /api/users/:id route
  app.get("/api/users/check-username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      res.json({ available: !user });
    } catch (error) {
      res.status(500).json({ error: "Failed to check username" });
    }
  });
  
  // Update profile picture
  app.post("/api/users/:id/profile-picture", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      // Only allow users to update their own profile picture
      if (req.user!.id !== id) {
        return res.status(403).json({ error: "Not authorized to update this user's profile" });
      }
      
      const { profilePicture } = req.body;
      if (!profilePicture) {
        return res.status(400).json({ error: "Profile picture URL is required" });
      }
      
      const user = await storage.updateUserProfilePicture(id, profilePicture);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't send the password to the client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile picture" });
    }
  });
  
  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't send the password to the client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  
  // Verify a user (admin only)
  app.post("/api/users/:id/verify", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      // Check if the current user is an admin
      if (!req.user!.isAdmin) {
        return res.status(403).json({ error: "Only admins can verify users" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const { verified } = req.body;
      if (verified === undefined) {
        return res.status(400).json({ error: "Verified status is required" });
      }
      
      const user = await storage.updateUserVerification(id, verified);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't send the password to the client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user verification status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
