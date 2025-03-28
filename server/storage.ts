import { users, type User, type InsertUser, type Script, type InsertScript, scripts } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, and, asc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const PostgresSessionStore = connectPg(session);
const scryptAsync = promisify(scrypt);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateUserVerification(id: number, verified: boolean): Promise<User | undefined>;
  updateUserProfilePicture(id: number, profilePicture: string): Promise<User | undefined>;
  getScripts(): Promise<Script[]>;
  getScriptById(id: number): Promise<Script | undefined>;
  getScriptsByUserId(userId: number): Promise<Script[]>;
  createScript(script: InsertScript): Promise<Script>;
  updateScriptDownloads(id: number): Promise<Script | undefined>;
  initializeDatabase(): Promise<void>;
  sessionStore: any; // Using any type to avoid SessionStore type errors
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Create the session store
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  async hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async initializeDatabase(): Promise<void> {
    try {
      // Check if admin user exists
      const adminUser = await this.getUserByUsername("Faze");
      
      if (!adminUser) {
        // Create admin user
        const hashedPassword = await this.hashPassword("fzx");
        
        const [admin] = await db.insert(users).values({
          username: "Faze",
          password: hashedPassword,
          verified: true,
          isAdmin: true,
          profilePicture: "",
        }).returning();
        
        if (admin) {
          // Create sample script for admin
          await db.insert(scripts).values({
            title: "Auto Game Bot",
            description: "A powerful automation script for Roblox games that handles resource collection and combat.",
            code: `-- Auto Game Bot by Faze
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local Player = Players.LocalPlayer

local Bot = {}
Bot.Running = false

function Bot:Start()
    self.Running = true
    
    -- Connection that will run every frame
    self.Connection = RunService.RenderStepped:Connect(function(deltaTime)
        if not self.Running then return end
        
        -- Bot logic here
        self:CollectResources()
        self:AttackEnemies()
    end)
    
    print("Bot started successfully!")
end

function Bot:Stop()
    self.Running = false
    if self.Connection then
        self.Connection:Disconnect()
        self.Connection = nil
    end
    print("Bot stopped")
end

function Bot:CollectResources()
    -- Add your resource collection logic here
    local resources = workspace:FindFirstChild("Resources")
    if resources then
        -- Collect nearby resources
    end
end

function Bot:AttackEnemies()
    -- Add your combat logic here
    local enemies = workspace:FindFirstChild("Enemies")
    if enemies then
        -- Attack nearby enemies
    end
end

return Bot`,
            language: "lua",
            category: "combat",
            userId: admin.id,
          });
        }
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Hash the password
      const hashedPassword = await this.hashPassword(insertUser.password);
      
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          password: hashedPassword,
          verified: insertUser.username === "Faze", // Only Faze is verified by default
          isAdmin: insertUser.username === "Faze", // Only Faze is admin
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async updateUserVerification(id: number, verified: boolean): Promise<User | undefined> {
    return this.updateUser(id, { verified });
  }

  async updateUserProfilePicture(id: number, profilePicture: string): Promise<User | undefined> {
    return this.updateUser(id, { profilePicture });
  }

  async getScripts(): Promise<Script[]> {
    try {
      const allScripts = await db
        .select()
        .from(scripts)
        .orderBy(asc(scripts.id));
      return allScripts;
    } catch (error) {
      console.error("Error getting all scripts:", error);
      return [];
    }
  }

  async getScriptById(id: number): Promise<Script | undefined> {
    try {
      const [script] = await db
        .select()
        .from(scripts)
        .where(eq(scripts.id, id));
      return script;
    } catch (error) {
      console.error("Error getting script by ID:", error);
      return undefined;
    }
  }

  async getScriptsByUserId(userId: number): Promise<Script[]> {
    try {
      const userScripts = await db
        .select()
        .from(scripts)
        .where(eq(scripts.userId, userId));
      return userScripts;
    } catch (error) {
      console.error("Error getting scripts by user ID:", error);
      return [];
    }
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    try {
      const [script] = await db
        .insert(scripts)
        .values(insertScript)
        .returning();
      return script;
    } catch (error) {
      console.error("Error creating script:", error);
      throw error;
    }
  }

  async updateScriptDownloads(id: number): Promise<Script | undefined> {
    try {
      // Get current script first to get download count
      const currentScript = await this.getScriptById(id);
      if (!currentScript) return undefined;
      
      const [updatedScript] = await db
        .update(scripts)
        .set({
          downloads: (currentScript.downloads || 0) + 1
        })
        .where(eq(scripts.id, id))
        .returning();
      return updatedScript;
    } catch (error) {
      console.error("Error updating script downloads:", error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();
