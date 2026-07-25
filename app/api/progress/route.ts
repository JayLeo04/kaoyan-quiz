import { getChatGPTUser } from "@/app/chatgpt-auth";
import { registerAndLoadProgress, saveProgress } from "@/db/progress";

export const dynamic = "force-dynamic";

const json = (value: unknown, status = 200) => Response.json(value, { status });

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return json({ error: "请先登录" }, 401);
  const progressJson = await registerAndLoadProgress(user);
  return new Response(progressJson, { headers: { "content-type": "application/json; charset=utf-8" } });
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return json({ error: "请先登录" }, 401);
  const value = await request.json() as {
    completed?: unknown;
    bookmarks?: unknown;
    attempts?: unknown;
  };
  if (!Array.isArray(value.completed) || !Array.isArray(value.bookmarks) || !value.attempts || typeof value.attempts !== "object" || Array.isArray(value.attempts)) {
    return json({ error: "无效的刷题记录" }, 400);
  }
  const progressJson = JSON.stringify({
    completed: value.completed.filter((item): item is string => typeof item === "string").slice(0, 10000),
    bookmarks: value.bookmarks.filter((item): item is string => typeof item === "string").slice(0, 10000),
    attempts: value.attempts,
  });
  if (progressJson.length > 2_000_000) return json({ error: "刷题记录过大" }, 413);
  await saveProgress(user, progressJson);
  return json({ saved: true });
}
