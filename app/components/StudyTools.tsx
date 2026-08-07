"use client";

import Link from "@/app/components/SiteLink";
import {
  EMPTY_LOCAL_LEARNING_LIBRARY,
  LOCAL_LEARNING_LIBRARY_EVENT,
  LOCAL_LEARNING_LIBRARY_STORAGE_KEY,
  MAX_LEARNING_NOTE_LENGTH,
  readLocalLearningLibrary,
  removeTextAnnotations,
  saveLearningNote,
  saveTextAnnotation,
  toggleLearningBookmark,
  type LearningResource,
  type LocalLearningLibrary,
  type TextAnnotation,
  type TextAnnotationStyle,
} from "@/app/lib/local-learning-library";
import {
  type CSSProperties,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectionAnchor = {
  start: number;
  end: number;
  quote: string;
  prefix: string;
  suffix: string;
  top: number;
  left: number;
};

const annotationSelector = "[data-study-annotation-fragment]";
const annotationExclusions = "[data-study-tools-ignore], button, input, textarea, select, script, style, .katex-mathml, .knowledge-visual, .mermaid";

function useLearningLibrary() {
  const [library, setLibrary] = useState<LocalLearningLibrary>(EMPTY_LOCAL_LEARNING_LIBRARY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setLibrary(readLocalLearningLibrary());
    // Browser-only learning data is loaded after hydration.
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      refresh();
      setReady(true);
    });
    const onLibraryChange = (event: Event) => {
      const detail = (event as CustomEvent<LocalLearningLibrary>).detail;
      setLibrary(detail || readLocalLearningLibrary());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === LOCAL_LEARNING_LIBRARY_STORAGE_KEY) refresh();
    };
    window.addEventListener(LOCAL_LEARNING_LIBRARY_EVENT, onLibraryChange);
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener(LOCAL_LEARNING_LIBRARY_EVENT, onLibraryChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { library, ready, setLibrary };
}

export function StudyResourceTools({
  resource,
  practiceHref,
  practiceLabel = "去做相关题目",
  className = "",
  showBookmark = true,
}: {
  resource: LearningResource;
  practiceHref?: string | null;
  practiceLabel?: string;
  className?: string;
  showBookmark?: boolean;
}) {
  const { library, ready, setLibrary } = useLearningLibrary();
  const [noteOpen, setNoteOpen] = useState(false);
  const [storageError, setStorageError] = useState("");
  const noteId = `study-note-${resource.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const saved = Boolean(library.bookmarks[resource.id]);
  const note = library.notes[resource.id]?.body || "";
  const annotationCount = library.annotations[resource.id]?.length || 0;

  useEffect(() => {
    // A newly opened resource starts with its note editor collapsed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNoteOpen(false);
    setStorageError("");
  }, [resource.id]);

  const toggleBookmark = () => {
    const result = toggleLearningBookmark(resource);
    setLibrary(result.library);
    setStorageError(result.saved ? "" : "当前浏览器无法保存收藏，请检查本地存储空间。");
  };

  const updateNote = (body: string) => {
    const result = saveLearningNote(resource, body);
    setLibrary(result.library);
    setStorageError(result.saved ? "" : "当前浏览器无法保存笔记，请先复制笔记内容后再重试。");
  };

  return (
    <section className={`study-resource-tools ${className}`.trim()} aria-label={`${resource.title}学习工具`}>
      <div className="study-resource-actions">
        {showBookmark ? (
          <button type="button" className={saved ? "is-active" : ""} aria-pressed={saved} onClick={toggleBookmark}>
            <span aria-hidden="true">{saved ? "◆" : "◇"}</span>{saved ? "已收藏知识点" : "收藏知识点"}
          </button>
        ) : null}
        <button
          type="button"
          className={noteOpen || note ? "is-active" : ""}
          aria-expanded={noteOpen}
          aria-controls={noteId}
          onClick={() => setNoteOpen((open) => !open)}
        >
          <span aria-hidden="true">✎</span>{note ? "查看笔记" : "添加笔记"}
        </button>
        {practiceHref === undefined ? null : practiceHref ? <Link href={practiceHref}><span aria-hidden="true">▶</span>{practiceLabel}</Link> : <span className="is-disabled" aria-label="当前知识点暂未关联题目">暂无关联题目</span>}
        <small>{annotationCount ? `${annotationCount} 处文本标注` : "选中文字可高亮或加下划线"}</small>
      </div>
      {noteOpen ? (
        <div className="study-resource-note" id={noteId}>
          <label htmlFor={`${noteId}-editor`}>
            <span>我的笔记</span>
            <small>{note.length} / {MAX_LEARNING_NOTE_LENGTH}</small>
          </label>
          <textarea
            id={`${noteId}-editor`}
            value={note}
            maxLength={MAX_LEARNING_NOTE_LENGTH}
            onChange={(event) => updateNote(event.target.value)}
            placeholder="记录定义、易错点、解题线索或下次复习提醒……"
          />
          <footer><span>{ready ? note.trim() ? "已自动保存到本机" : "输入后自动保存到本机" : "正在读取本地笔记"}</span>{note ? <button type="button" onClick={() => updateNote("")}>清空笔记</button> : null}</footer>
        </div>
      ) : null}
      {storageError ? <p className="study-tools-error" role="alert">{storageError}</p> : null}
    </section>
  );
}

function collectAnnotatableTextNodes(root: HTMLElement) {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue || !parent.closest('[data-study-annotatable="true"]')) return NodeFilter.FILTER_REJECT;
      if (parent.closest(annotationExclusions)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

function textSnapshot(root: HTMLElement) {
  const nodes = collectAnnotatableTextNodes(root);
  const starts = new Map<Text, number>();
  let text = "";
  for (const node of nodes) {
    starts.set(node, text.length);
    text += node.nodeValue || "";
  }
  return { nodes, starts, text };
}

function selectionAnchor(root: HTMLElement, range: Range): SelectionAnchor | null {
  if (!(range.startContainer instanceof Text) || !(range.endContainer instanceof Text)) return null;
  const snapshot = textSnapshot(root);
  const startBase = snapshot.starts.get(range.startContainer);
  const endBase = snapshot.starts.get(range.endContainer);
  if (startBase === undefined || endBase === undefined) return null;
  let start = startBase + range.startOffset;
  let end = endBase + range.endOffset;
  if (end <= start) return null;
  const rawQuote = snapshot.text.slice(start, end);
  const leading = rawQuote.match(/^\s+/)?.[0].length || 0;
  const trailing = rawQuote.match(/\s+$/)?.[0].length || 0;
  start += leading;
  end -= trailing;
  const quote = snapshot.text.slice(start, end);
  if (!quote || quote.length > 2_000) return null;
  const rectangle = range.getBoundingClientRect();
  if (!rectangle.width && !rectangle.height) return null;
  return {
    start,
    end,
    quote,
    prefix: snapshot.text.slice(Math.max(0, start - 48), start),
    suffix: snapshot.text.slice(end, end + 48),
    top: Math.max(12, rectangle.top - 48),
    left: Math.min(Math.max(104, rectangle.left + rectangle.width / 2), Math.max(104, window.innerWidth - 104)),
  };
}

function locateAnnotation(text: string, annotation: TextAnnotation) {
  if (text.slice(annotation.start, annotation.end) === annotation.quote) return { start: annotation.start, end: annotation.end };
  let bestStart = -1;
  let bestScore = -1;
  let cursor = text.indexOf(annotation.quote);
  while (cursor >= 0) {
    let score = 0;
    if (annotation.prefix && text.slice(Math.max(0, cursor - annotation.prefix.length), cursor) === annotation.prefix) score += 2;
    const end = cursor + annotation.quote.length;
    if (annotation.suffix && text.slice(end, end + annotation.suffix.length) === annotation.suffix) score += 2;
    score -= Math.min(1, Math.abs(cursor - annotation.start) / Math.max(1, text.length));
    if (score > bestScore) {
      bestScore = score;
      bestStart = cursor;
    }
    cursor = text.indexOf(annotation.quote, cursor + 1);
  }
  return bestStart >= 0 ? { start: bestStart, end: bestStart + annotation.quote.length } : null;
}

function unwrapAnnotations(root: HTMLElement) {
  const parents = new Set<Node>();
  for (const element of root.querySelectorAll<HTMLElement>(annotationSelector)) {
    const parent = element.parentNode;
    if (!parent) continue;
    parents.add(parent);
    parent.replaceChild(document.createTextNode(element.textContent || ""), element);
  }
  parents.forEach((parent) => parent.normalize());
}

function wrapAnnotation(root: HTMLElement, annotation: TextAnnotation, start: number, end: number) {
  const snapshot = textSnapshot(root);
  const fragments = snapshot.nodes.map((node) => {
    const nodeStart = snapshot.starts.get(node) || 0;
    return { node, nodeStart, nodeEnd: nodeStart + (node.nodeValue?.length || 0) };
  }).filter((item) => item.nodeEnd > start && item.nodeStart < end).reverse();

  for (const fragment of fragments) {
    const localStart = Math.max(0, start - fragment.nodeStart);
    const localEnd = Math.min(fragment.nodeEnd, end) - fragment.nodeStart;
    if (localEnd <= localStart) continue;
    const selected = fragment.node.splitText(localStart);
    selected.splitText(localEnd - localStart);
    const wrapper = document.createElement(annotation.style === "highlight" ? "mark" : "span");
    wrapper.className = `study-text-annotation is-${annotation.style}`;
    wrapper.dataset.studyAnnotationFragment = annotation.id;
    wrapper.textContent = selected.nodeValue || "";
    selected.parentNode?.replaceChild(wrapper, selected);
  }
}

function renderAnnotations(root: HTMLElement, annotations: TextAnnotation[]) {
  unwrapAnnotations(root);
  const text = textSnapshot(root).text;
  const located = annotations
    .map((annotation) => ({ annotation, range: locateAnnotation(text, annotation) }))
    .filter((item): item is { annotation: TextAnnotation; range: { start: number; end: number } } => Boolean(item.range))
    .sort((left, right) => right.range.start - left.range.start);
  for (const item of located) wrapAnnotation(root, item.annotation, item.range.start, item.range.end);
}

export function StudyAnnotationSurface({
  resource,
  contentKey,
  className = "",
  showHint = true,
  children,
}: PropsWithChildren<{
  resource: LearningResource;
  contentKey: string;
  className?: string;
  showHint?: boolean;
}>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const { library, setLibrary } = useLearningLibrary();
  const [selection, setSelection] = useState<SelectionAnchor | null>(null);
  const [status, setStatus] = useState("");
  const annotations = useMemo(() => library.annotations[resource.id] || [], [library.annotations, resource.id]);
  const hasOverlap = selection ? annotations.some((item) => item.end > selection.start && item.start < selection.end) : false;

  useEffect(() => {
    if (!status) return;
    const timeout = window.setTimeout(() => setStatus(""), 2_800);
    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    renderAnnotations(root, annotations);
    return () => unwrapAnnotations(root);
  }, [annotations, contentKey]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelection(null);
        savedRangeRef.current = null;
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const inspectSelection = useCallback(() => {
    window.setTimeout(() => {
      const root = rootRef.current;
      const currentSelection = window.getSelection();
      if (!root || !currentSelection || currentSelection.rangeCount === 0 || currentSelection.isCollapsed) {
        setSelection(null);
        return;
      }
      const range = currentSelection.getRangeAt(0);
      if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
        setSelection(null);
        return;
      }
      const anchor = selectionAnchor(root, range);
      savedRangeRef.current = anchor ? range.cloneRange() : null;
      setSelection(anchor);
    }, 0);
  }, []);

  const finishSelection = () => {
    window.getSelection()?.removeAllRanges();
    savedRangeRef.current = null;
    setSelection(null);
  };

  const applyStyle = (style: TextAnnotationStyle) => {
    if (!selection) return;
    const annotation: TextAnnotation = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      style,
      start: selection.start,
      end: selection.end,
      quote: selection.quote,
      prefix: selection.prefix,
      suffix: selection.suffix,
      createdAt: new Date().toISOString(),
    };
    const result = saveTextAnnotation(resource, annotation);
    setLibrary(result.library);
    setStatus(result.saved ? style === "highlight" ? "已添加高亮" : "已添加下划线" : "标注保存失败，请检查浏览器存储空间");
    finishSelection();
  };

  const clearSelectionAnnotations = () => {
    if (!selection) return;
    const result = removeTextAnnotations(resource.id, selection.start, selection.end);
    setLibrary(result.library);
    setStatus(result.saved ? "已取消所选文本的标注" : "标注更新失败，请检查浏览器存储空间");
    finishSelection();
  };

  const toolbarStyle = selection ? ({ top: selection.top, left: selection.left } satisfies CSSProperties) : undefined;

  return (
    <div
      ref={rootRef}
      className={`study-annotation-surface ${className}`.trim()}
      onPointerUp={inspectSelection}
      onKeyUp={inspectSelection}
    >
      {showHint ? <div className="study-annotation-hint" data-study-tools-ignore><span>选中文字</span><strong>高亮 · 下划线</strong>{annotations.length ? <small>本页 {annotations.length} 处</small> : null}</div> : null}
      {children}
      {selection ? (
        <div className="study-selection-toolbar" role="toolbar" aria-label="文本标注工具" style={toolbarStyle} data-study-tools-ignore onPointerDown={(event) => event.preventDefault()}>
          <button type="button" onClick={() => applyStyle("highlight")}><span aria-hidden="true">▰</span>高亮</button>
          <button type="button" onClick={() => applyStyle("underline")}><span aria-hidden="true">U</span>下划线</button>
          {hasOverlap ? <button type="button" className="remove" onClick={clearSelectionAnnotations}>取消标注</button> : null}
        </div>
      ) : null}
      {status ? <span className="study-tools-status" role="status" data-study-tools-ignore>{status}</span> : null}
    </div>
  );
}
