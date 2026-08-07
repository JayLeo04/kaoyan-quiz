import { createTextbookPracticeResults, getTextbook } from "@/app/data/textbook-registry";
import type { TextbookPracticeQuery } from "@/app/data/textbook-types";

export const dynamic = "force-dynamic";

function shortString(value: unknown, fallback = "all") {
  return typeof value === "string" ? value.slice(0, 200) : fallback;
}

function idList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, 2_000)
    : [];
}

export async function POST(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const textbook = getTextbook(bookId);
  if (!textbook) return Response.json({ error: "教材不存在" }, { status: 404 });

  let value: Record<string, unknown>;
  try {
    value = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "无效的筛选请求" }, { status: 400 });
  }

  const query: TextbookPracticeQuery = {
    chapterId: shortString(value.chapterId),
    type: shortString(value.type),
    answer: shortString(value.answer),
    learning: shortString(value.learning),
    query: shortString(value.query, ""),
    page: typeof value.page === "number" ? value.page : 1,
    masteredIds: idList(value.masteredIds),
    reviewIds: idList(value.reviewIds),
  };
  return Response.json(createTextbookPracticeResults(textbook, query), {
    headers: { "cache-control": "no-store" },
  });
}
