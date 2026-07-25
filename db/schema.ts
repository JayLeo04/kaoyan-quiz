import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  email: text("email").primaryKey(),
  displayName: text("display_name").notNull(),
  createdAt: text("created_at").notNull(),
  lastSeenAt: text("last_seen_at").notNull(),
});

export const practiceProgress = sqliteTable("practice_progress", {
  userEmail: text("user_email").primaryKey(),
  progressJson: text("progress_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});
