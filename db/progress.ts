import type { ChatGPTUser } from "@/app/chatgpt-auth";

const EMPTY_PROGRESS_JSON = JSON.stringify({ completed: [], bookmarks: [], attempts: {} });

async function ensureProgressTables() {
  const { env } = await import("cloudflare:workers");
  const d1 = env.DB;
  if (!d1) throw new Error("D1 binding `DB` is unavailable.");
  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY NOT NULL,
      display_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL
    )`),
    d1.prepare(`CREATE TABLE IF NOT EXISTS practice_progress (
      user_email TEXT PRIMARY KEY NOT NULL,
      progress_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
  ]);
  return d1;
}

export async function registerAndLoadProgress(user: ChatGPTUser) {
  const d1 = await ensureProgressTables();
  const now = new Date().toISOString();
  await d1.prepare(`INSERT INTO users (email, display_name, created_at, last_seen_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET display_name = excluded.display_name, last_seen_at = excluded.last_seen_at`)
    .bind(user.email, user.displayName, now, now)
    .run();
  const row = await d1.prepare("SELECT progress_json FROM practice_progress WHERE user_email = ?")
    .bind(user.email)
    .first<{ progress_json: string }>();
  return row?.progress_json || EMPTY_PROGRESS_JSON;
}

export async function saveProgress(user: ChatGPTUser, progressJson: string) {
  const d1 = await ensureProgressTables();
  const now = new Date().toISOString();
  await d1.batch([
    d1.prepare(`INSERT INTO users (email, display_name, created_at, last_seen_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET display_name = excluded.display_name, last_seen_at = excluded.last_seen_at`)
      .bind(user.email, user.displayName, now, now),
    d1.prepare(`INSERT INTO practice_progress (user_email, progress_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(user_email) DO UPDATE SET progress_json = excluded.progress_json, updated_at = excluded.updated_at`)
      .bind(user.email, progressJson, now),
  ]);
}
