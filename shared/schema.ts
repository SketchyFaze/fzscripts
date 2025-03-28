import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  profilePicture: text("profile_picture").default(""),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  category: text("category").notNull(),
  userId: integer("user_id").notNull(),
  downloads: integer("downloads").default(0),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  profilePicture: true,
});

export const insertScriptSchema = createInsertSchema(scripts).pick({
  title: true,
  description: true,
  code: true,
  language: true,
  category: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scripts.$inferSelect;

export const loginSchema = insertUserSchema;
export type LoginData = z.infer<typeof loginSchema>;
