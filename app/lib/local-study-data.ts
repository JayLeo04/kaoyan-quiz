import {
  EMPTY_LOCAL_LEARNING_LIBRARY,
  LOCAL_LEARNING_LIBRARY_STORAGE_KEY,
  normalizeLocalLearningLibrary,
  type LocalLearningLibrary,
} from "@/app/lib/local-learning-library";

export type AttemptRecord = {
  selectedOption: string | null;
  correct: boolean | null;
  answeredAt: string;
};

export type PracticeProgress = {
  completed: string[];
  bookmarks: string[];
  attempts: Record<string, AttemptRecord>;
};

export type QuestionNotes = Record<string, string>;

export type LocalStudySnapshot = {
  progress: PracticeProgress;
  notes: QuestionNotes;
  learning: LocalLearningLibrary;
};

export type LocalStudyBackup = {
  format: "yanshua-408-local-backup";
  version: 2;
  exportedAt: string;
  data: LocalStudySnapshot;
};

export const PROGRESS_STORAGE_KEY = "yanshua-408-progress-v1";
export const QUESTION_NOTES_STORAGE_KEY = "yanshua-408-question-notes-v1";
export const MAX_QUESTION_NOTE_LENGTH = 50_000;
const RETIRED_WORD_PROGRESS_STORAGE_KEY = "yanshua-kaoyan-word-progress-v1";

const MAX_TRACKED_QUESTIONS = 10_000;
const MAX_NOTES = 2_000;

export const EMPTY_PROGRESS: PracticeProgress = { completed: [], bookmarks: [], attempts: {} };
export const EMPTY_LOCAL_STUDY_SNAPSHOT: LocalStudySnapshot = {
  progress: EMPTY_PROGRESS,
  notes: {},
  learning: EMPTY_LOCAL_LEARNING_LIBRARY,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function uniqueQuestionIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string" || !item || item.length > 160) continue;
    ids.add(item);
    if (ids.size >= MAX_TRACKED_QUESTIONS) break;
  }
  return [...ids];
}

function normalizeAttempt(value: unknown): AttemptRecord | null {
  if (!isRecord(value) || typeof value.answeredAt !== "string" || !Number.isFinite(Date.parse(value.answeredAt))) return null;
  const selectedOption = typeof value.selectedOption === "string" && value.selectedOption.length <= 40
    ? value.selectedOption
    : null;
  const correct = typeof value.correct === "boolean" ? value.correct : null;
  return { selectedOption, correct, answeredAt: value.answeredAt };
}

export function normalizeProgress(value: unknown): PracticeProgress {
  const raw = isRecord(value) ? value : {};
  const attempts: Record<string, AttemptRecord> = {};
  if (isRecord(raw.attempts)) {
    for (const [questionId, attempt] of Object.entries(raw.attempts)) {
      if (!questionId || questionId.length > 160 || Object.keys(attempts).length >= MAX_TRACKED_QUESTIONS) continue;
      const safeAttempt = normalizeAttempt(attempt);
      if (safeAttempt) attempts[questionId] = safeAttempt;
    }
  }
  return {
    completed: uniqueQuestionIds(raw.completed),
    bookmarks: uniqueQuestionIds(raw.bookmarks),
    attempts,
  };
}

export function normalizeQuestionNotes(value: unknown): QuestionNotes {
  if (!isRecord(value)) return {};
  const notes: QuestionNotes = {};
  for (const [questionId, note] of Object.entries(value)) {
    if (!questionId || questionId.length > 160 || typeof note !== "string" || Object.keys(notes).length >= MAX_NOTES) continue;
    const safeNote = note.slice(0, MAX_QUESTION_NOTE_LENGTH);
    if (!safeNote) continue;
    notes[questionId] = safeNote;
  }
  return notes;
}

function parseStoredValue(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function readLocalStudySnapshot(): LocalStudySnapshot {
  if (typeof window === "undefined") return EMPTY_LOCAL_STUDY_SNAPSHOT;
  try {
    window.localStorage.removeItem(RETIRED_WORD_PROGRESS_STORAGE_KEY);
  } catch {
    // Storage may be unavailable; the retired feature remains inaccessible either way.
  }
  return {
    progress: normalizeProgress(parseStoredValue(PROGRESS_STORAGE_KEY)),
    notes: normalizeQuestionNotes(parseStoredValue(QUESTION_NOTES_STORAGE_KEY)),
    learning: normalizeLocalLearningLibrary(parseStoredValue(LOCAL_LEARNING_LIBRARY_STORAGE_KEY)),
  };
}

export function writeLocalStudySnapshot(value: LocalStudySnapshot) {
  const snapshot: LocalStudySnapshot = {
    progress: normalizeProgress(value.progress),
    notes: normalizeQuestionNotes(value.notes),
    learning: normalizeLocalLearningLibrary(value.learning),
  };
  try {
    window.localStorage.removeItem(RETIRED_WORD_PROGRESS_STORAGE_KEY);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(snapshot.progress));
    if (Object.keys(snapshot.notes).length) window.localStorage.setItem(QUESTION_NOTES_STORAGE_KEY, JSON.stringify(snapshot.notes));
    else window.localStorage.removeItem(QUESTION_NOTES_STORAGE_KEY);
    if (Object.keys(snapshot.learning.resources).length) window.localStorage.setItem(LOCAL_LEARNING_LIBRARY_STORAGE_KEY, JSON.stringify(snapshot.learning));
    else window.localStorage.removeItem(LOCAL_LEARNING_LIBRARY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function createLocalStudyBackup(value: LocalStudySnapshot): LocalStudyBackup {
  return {
    format: "yanshua-408-local-backup",
    version: 2,
    exportedAt: new Date().toISOString(),
    data: {
      progress: normalizeProgress(value.progress),
      notes: normalizeQuestionNotes(value.notes),
      learning: normalizeLocalLearningLibrary(value.learning),
    },
  };
}

export function parseLocalStudyBackup(value: unknown): LocalStudySnapshot | null {
  if (!isRecord(value) || value.format !== "yanshua-408-local-backup" || (value.version !== 1 && value.version !== 2 && value.version !== 3) || !isRecord(value.data)) return null;
  if (!("progress" in value.data) || !("notes" in value.data)) return null;
  return {
    progress: normalizeProgress(value.data.progress),
    notes: normalizeQuestionNotes(value.data.notes),
    learning: normalizeLocalLearningLibrary(value.version === 2 || value.version === 3 ? value.data.learning : null),
  };
}
