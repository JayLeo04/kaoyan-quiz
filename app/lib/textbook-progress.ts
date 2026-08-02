export type TextbookProgress = {
  mastered: string[];
  review: string[];
  bookmarks: string[];
};

const LEGACY_DATA_STRUCTURES_PROGRESS_KEY = "yanshua-data-structures-textbook-progress-v1";
export const EMPTY_TEXTBOOK_PROGRESS: TextbookProgress = { mastered: [], review: [], bookmarks: [] };

function safeBookStorageId(bookSlug: string) {
  const normalized = bookSlug.toLocaleLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "unknown";
}

export function textbookProgressStorageKey(bookSlug: string) {
  return `yanshua-textbook-${safeBookStorageId(bookSlug)}-progress-v1`;
}

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

export function readTextbookProgress(bookSlug: string): TextbookProgress {
  if (typeof window === "undefined") return EMPTY_TEXTBOOK_PROGRESS;
  try {
    const primaryKey = textbookProgressStorageKey(bookSlug);
    const stored = window.localStorage.getItem(primaryKey);
    if (stored) return normalizeTextbookProgress(JSON.parse(stored));

    // The first book shipped before book-scoped progress existed. Copy its local
    // state forward once, without deleting the legacy key or affecting other books.
    if (bookSlug === "data-structures") {
      const legacy = window.localStorage.getItem(LEGACY_DATA_STRUCTURES_PROGRESS_KEY);
      if (legacy) {
        const migrated = normalizeTextbookProgress(JSON.parse(legacy));
        window.localStorage.setItem(primaryKey, JSON.stringify(migrated));
        return migrated;
      }
    }
    return EMPTY_TEXTBOOK_PROGRESS;
  } catch {
    return EMPTY_TEXTBOOK_PROGRESS;
  }
}

export function writeTextbookProgress(bookSlug: string, value: TextbookProgress) {
  const normalized = normalizeTextbookProgress(value);
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(textbookProgressStorageKey(bookSlug), JSON.stringify(normalized));
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
