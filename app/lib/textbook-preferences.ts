export type TextbookReadingMode = "original" | "condensed";

export type TextbookReaderPreferences = {
  readingMode: TextbookReadingMode;
};

export const DEFAULT_TEXTBOOK_READER_PREFERENCES: TextbookReaderPreferences = {
  readingMode: "original",
};

function safeBookStorageId(bookSlug: string) {
  const normalized = bookSlug.toLocaleLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "unknown";
}

export function textbookReaderPreferencesStorageKey(bookSlug: string) {
  return `yanshua-textbook-${safeBookStorageId(bookSlug)}-reader-preferences-v1`;
}

export function normalizeTextbookReaderPreferences(value: unknown): TextbookReaderPreferences {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return {
    readingMode: record.readingMode === "condensed" ? "condensed" : "original",
  };
}

export function readTextbookReaderPreferences(bookSlug: string): TextbookReaderPreferences {
  if (typeof window === "undefined") return DEFAULT_TEXTBOOK_READER_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(textbookReaderPreferencesStorageKey(bookSlug));
    return stored ? normalizeTextbookReaderPreferences(JSON.parse(stored)) : DEFAULT_TEXTBOOK_READER_PREFERENCES;
  } catch {
    return DEFAULT_TEXTBOOK_READER_PREFERENCES;
  }
}

export function writeTextbookReaderPreferences(bookSlug: string, value: TextbookReaderPreferences) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(
      textbookReaderPreferencesStorageKey(bookSlug),
      JSON.stringify(normalizeTextbookReaderPreferences(value)),
    );
    return true;
  } catch {
    return false;
  }
}
