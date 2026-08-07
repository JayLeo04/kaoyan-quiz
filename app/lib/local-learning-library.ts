export type LearningResourceKind = "knowledge" | "textbook-page" | "question" | "textbook-question";

export type LearningResource = {
  id: string;
  kind: LearningResourceKind;
  title: string;
  href: string;
  context?: string;
};

export type LearningResourceRecord = LearningResource & {
  updatedAt: string;
};

export type LearningBookmark = {
  savedAt: string;
};

export type LearningNote = {
  body: string;
  updatedAt: string;
};

export type TextAnnotationStyle = "highlight" | "underline";

export type TextAnnotation = {
  id: string;
  style: TextAnnotationStyle;
  start: number;
  end: number;
  quote: string;
  prefix: string;
  suffix: string;
  createdAt: string;
};

export type LocalLearningLibrary = {
  version: 1;
  resources: Record<string, LearningResourceRecord>;
  bookmarks: Record<string, LearningBookmark>;
  notes: Record<string, LearningNote>;
  annotations: Record<string, TextAnnotation[]>;
};

export const LOCAL_LEARNING_LIBRARY_STORAGE_KEY = "yanshua-408-learning-library-v1";
export const LOCAL_LEARNING_LIBRARY_EVENT = "yanshua-408-learning-library-change";
export const MAX_LEARNING_NOTE_LENGTH = 50_000;
export const MAX_ANNOTATION_QUOTE_LENGTH = 2_000;

const MAX_RESOURCES = 4_000;
const MAX_ANNOTATIONS = 10_000;

export const EMPTY_LOCAL_LEARNING_LIBRARY: LocalLearningLibrary = {
  version: 1,
  resources: {},
  bookmarks: {},
  notes: {},
  annotations: {},
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeDate(value: unknown) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : new Date().toISOString();
}

function safeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function safeResource(value: unknown, fallbackId = ""): LearningResourceRecord | null {
  if (!isRecord(value)) return null;
  const id = safeText(value.id || fallbackId, 240);
  const title = safeText(value.title, 300);
  const href = safeText(value.href, 700);
  const kind = value.kind;
  if (!id || !title || !href || !["knowledge", "textbook-page", "question", "textbook-question"].includes(String(kind))) return null;
  const context = safeText(value.context, 300);
  return {
    id,
    kind: kind as LearningResourceKind,
    title,
    href,
    ...(context ? { context } : {}),
    updatedAt: safeDate(value.updatedAt),
  };
}

function safeAnnotation(value: unknown): TextAnnotation | null {
  if (!isRecord(value)) return null;
  const id = safeText(value.id, 160);
  const quote = safeText(value.quote, MAX_ANNOTATION_QUOTE_LENGTH);
  const start = typeof value.start === "number" && Number.isInteger(value.start) ? value.start : -1;
  const end = typeof value.end === "number" && Number.isInteger(value.end) ? value.end : -1;
  const style = value.style === "underline" ? "underline" : value.style === "highlight" ? "highlight" : null;
  if (!id || !quote || !style || start < 0 || end <= start || end - start > MAX_ANNOTATION_QUOTE_LENGTH) return null;
  return {
    id,
    style,
    start,
    end,
    quote,
    prefix: safeText(value.prefix, 80),
    suffix: safeText(value.suffix, 80),
    createdAt: safeDate(value.createdAt),
  };
}

export function normalizeLocalLearningLibrary(value: unknown): LocalLearningLibrary {
  const raw = isRecord(value) ? value : {};
  const resources: LocalLearningLibrary["resources"] = {};
  const bookmarks: LocalLearningLibrary["bookmarks"] = {};
  const notes: LocalLearningLibrary["notes"] = {};
  const annotations: LocalLearningLibrary["annotations"] = {};

  if (isRecord(raw.resources)) {
    for (const [resourceId, resource] of Object.entries(raw.resources)) {
      if (Object.keys(resources).length >= MAX_RESOURCES) break;
      const safe = safeResource(resource, resourceId);
      if (safe) resources[safe.id] = safe;
    }
  }

  if (isRecord(raw.bookmarks)) {
    for (const [resourceId, bookmark] of Object.entries(raw.bookmarks)) {
      if (!resources[resourceId] || !isRecord(bookmark)) continue;
      bookmarks[resourceId] = { savedAt: safeDate(bookmark.savedAt) };
    }
  }

  if (isRecord(raw.notes)) {
    for (const [resourceId, note] of Object.entries(raw.notes)) {
      if (!resources[resourceId] || !isRecord(note) || typeof note.body !== "string") continue;
      const body = note.body.slice(0, MAX_LEARNING_NOTE_LENGTH);
      if (body.trim()) notes[resourceId] = { body, updatedAt: safeDate(note.updatedAt) };
    }
  }

  let annotationCount = 0;
  if (isRecord(raw.annotations)) {
    for (const [resourceId, values] of Object.entries(raw.annotations)) {
      if (!resources[resourceId] || !Array.isArray(values) || annotationCount >= MAX_ANNOTATIONS) continue;
      const safeValues: TextAnnotation[] = [];
      for (const value of values) {
        const safe = safeAnnotation(value);
        if (!safe || safeValues.some((item) => item.id === safe.id)) continue;
        safeValues.push(safe);
        annotationCount += 1;
        if (annotationCount >= MAX_ANNOTATIONS) break;
      }
      if (safeValues.length) annotations[resourceId] = safeValues;
    }
  }

  return { version: 1, resources, bookmarks, notes, annotations };
}

function storedLibrary() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(LOCAL_LEARNING_LIBRARY_STORAGE_KEY);
    return value ? JSON.parse(value) as unknown : null;
  } catch {
    return null;
  }
}

export function readLocalLearningLibrary() {
  return normalizeLocalLearningLibrary(storedLibrary());
}

export function writeLocalLearningLibrary(value: LocalLearningLibrary) {
  if (typeof window === "undefined") return false;
  const normalized = normalizeLocalLearningLibrary(value);
  try {
    const hasData = Object.keys(normalized.resources).length > 0;
    if (hasData) window.localStorage.setItem(LOCAL_LEARNING_LIBRARY_STORAGE_KEY, JSON.stringify(normalized));
    else window.localStorage.removeItem(LOCAL_LEARNING_LIBRARY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(LOCAL_LEARNING_LIBRARY_EVENT, { detail: normalized }));
    return true;
  } catch {
    return false;
  }
}

function rememberResource(library: LocalLearningLibrary, resource: LearningResource) {
  const now = new Date().toISOString();
  return {
    ...library,
    resources: {
      ...library.resources,
      [resource.id]: { ...resource, updatedAt: now },
    },
  };
}

function removeUnusedResource(library: LocalLearningLibrary, resourceId: string) {
  if (library.bookmarks[resourceId] || library.notes[resourceId] || library.annotations[resourceId]?.length) return library;
  const resources = { ...library.resources };
  delete resources[resourceId];
  return { ...library, resources };
}

export function updateLocalLearningLibrary(
  update: (current: LocalLearningLibrary) => LocalLearningLibrary,
) {
  const next = normalizeLocalLearningLibrary(update(readLocalLearningLibrary()));
  return { library: next, saved: writeLocalLearningLibrary(next) };
}

export function toggleLearningBookmark(resource: LearningResource) {
  return updateLocalLearningLibrary((current) => {
    let next = rememberResource(current, resource);
    const bookmarks = { ...next.bookmarks };
    if (bookmarks[resource.id]) delete bookmarks[resource.id];
    else bookmarks[resource.id] = { savedAt: new Date().toISOString() };
    next = { ...next, bookmarks };
    return removeUnusedResource(next, resource.id);
  });
}

export function saveLearningNote(resource: LearningResource, body: string) {
  return updateLocalLearningLibrary((current) => {
    let next = rememberResource(current, resource);
    const notes = { ...next.notes };
    const safeBody = body.slice(0, MAX_LEARNING_NOTE_LENGTH);
    if (safeBody.trim()) notes[resource.id] = { body: safeBody, updatedAt: new Date().toISOString() };
    else delete notes[resource.id];
    next = { ...next, notes };
    return removeUnusedResource(next, resource.id);
  });
}

export function saveTextAnnotation(resource: LearningResource, annotation: TextAnnotation) {
  return updateLocalLearningLibrary((current) => {
    const next = rememberResource(current, resource);
    const previous = next.annotations[resource.id] || [];
    const annotations = {
      ...next.annotations,
      [resource.id]: [
        ...previous.filter((item) => item.end <= annotation.start || item.start >= annotation.end),
        annotation,
      ].sort((left, right) => left.start - right.start),
    };
    return { ...next, annotations };
  });
}

export function removeTextAnnotations(resourceId: string, start: number, end: number) {
  return updateLocalLearningLibrary((current) => {
    const remaining = (current.annotations[resourceId] || []).filter((item) => item.end <= start || item.start >= end);
    const annotations = { ...current.annotations };
    if (remaining.length) annotations[resourceId] = remaining;
    else delete annotations[resourceId];
    return removeUnusedResource({ ...current, annotations }, resourceId);
  });
}
