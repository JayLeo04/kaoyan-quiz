export type TextbookProgress = {
  mastered: string[];
  review: string[];
  bookmarks: string[];
};

export const TEXTBOOK_PROGRESS_STORAGE_KEY = "yanshua-data-structures-textbook-progress-v1";
export const EMPTY_TEXTBOOK_PROGRESS: TextbookProgress = { mastered: [], review: [], bookmarks: [] };

function uniqueIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  const result = new Set<string>();
  for (const id of value) {
    if (typeof id === "string" && id && id.length <= 160) result.add(id);
    if (result.size >= 2_000) break;
  }
  return [...result];
}

export function normalizeTextbookProgress(value: unknown): TextbookProgress {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return {
    mastered: uniqueIds(record.mastered),
    review: uniqueIds(record.review),
    bookmarks: uniqueIds(record.bookmarks),
  };
}

export function readTextbookProgress(): TextbookProgress {
  if (typeof window === "undefined") return EMPTY_TEXTBOOK_PROGRESS;
  try {
    return normalizeTextbookProgress(JSON.parse(window.localStorage.getItem(TEXTBOOK_PROGRESS_STORAGE_KEY) || "null"));
  } catch {
    return EMPTY_TEXTBOOK_PROGRESS;
  }
}

export function writeTextbookProgress(value: TextbookProgress) {
  const normalized = normalizeTextbookProgress(value);
  try {
    window.localStorage.setItem(TEXTBOOK_PROGRESS_STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch {
    return false;
  }
}

export function toggleTextbookStatus(progress: TextbookProgress, id: string, status: "mastered" | "review") {
  const removeFromOther = status === "mastered" ? progress.review : progress.mastered;
  const current = progress[status];
  const hasStatus = current.includes(id);
  return {
    ...progress,
    [status]: hasStatus ? current.filter((item) => item !== id) : [...current, id],
    [status === "mastered" ? "review" : "mastered"]: removeFromOther.filter((item) => item !== id),
  } as TextbookProgress;
}

export function toggleTextbookBookmark(progress: TextbookProgress, id: string): TextbookProgress {
  return {
    ...progress,
    bookmarks: progress.bookmarks.includes(id)
      ? progress.bookmarks.filter((item) => item !== id)
      : [...progress.bookmarks, id],
  };
}
