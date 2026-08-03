import katex from "katex";
import { marked, Renderer } from "marked";
import type { TextbookDataset, TextbookQuestion } from "@/app/data/textbook-types";

type AnswerStatus = TextbookQuestion["answer"]["status"];

export type TextbookAnswerAuditUpdate = {
  id: string;
  answer: {
    status: AnswerStatus;
    origin: "verified";
    verified: string;
    explanation?: string;
    /** A peer-reviewed replacement for the independently written supplement. */
    correction?: {
      verified: string;
      explanation?: string;
      reason: string;
    };
  };
  review: {
    status: string;
    resolvedFlagCodes?: string[];
    notes?: string;
  };
};

export type TextbookAnswerAudit = {
  schemaVersion: "textbook-answer-audit-v1";
  bookId: string;
  scope: string[];
  updates: TextbookAnswerAuditUpdate[];
  unresolved?: Array<{
    id: string;
    reason: string;
  }>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function prepareMath(markdown: string) {
  const replacements: Array<{ marker: string; html: string }> = [];
  const token = (latex: string, displayMode: boolean) => {
    const source = latex.trim();
    if (!source) return "";
    const marker = `TEXTBOOK_AUDIT_MATH_${replacements.length}_END`;
    replacements.push({
      marker,
      html: katex.renderToString(source, { displayMode, throwOnError: false, strict: "ignore", trust: false }),
    });
    return marker;
  };

  const rendered = markdown.split(/(```[\s\S]*?```|`[^`\n]*`)/g).map((segment) => {
    if (segment.startsWith("`")) return segment;
    return segment
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => `\n\n${token(latex, true)}\n\n`)
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, latex) => `\n\n${token(latex, true)}\n\n`)
      .replace(/\\\(([\s\S]+?)\\\)/g, (_, latex) => token(latex, false))
      .replace(/(?<!\\)\$([^\n$]+?)(?<!\\)\$/g, (_, latex) => token(latex, false));
  }).join("");

  return { markdown: rendered, replacements };
}

/** Renders agent-authored supplemental Markdown without accepting raw HTML or local file links. */
export function renderVerifiedAnswerMarkdown(markdown: string) {
  const prepared = prepareMath(markdown);
  const renderer = new Renderer();
  renderer.html = ({ text }) => escapeHtml(text);
  renderer.link = function link({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    const safeHref = String(href || "").trim();
    if (!/^https?:\/\//i.test(safeHref)) return label;
    return `<a href="${escapeHtml(safeHref)}"${title ? ` title="${escapeHtml(title)}"` : ""} target="_blank" rel="noreferrer">${label}</a>`;
  };
  renderer.image = ({ text }) => `<span class="textbook-missing-image">[图片：${escapeHtml(text || "未内嵌")}]</span>`;
  const parsed = String(marked.parse(prepared.markdown, { gfm: true, breaks: false, renderer }));
  return prepared.replacements.reduce((html, replacement) => html.replaceAll(replacement.marker, replacement.html), parsed);
}

function originalStatus(question: TextbookQuestion): AnswerStatus {
  return question.answer.originalStatus || question.answer.status;
}

function verifiedContent(update: TextbookAnswerAuditUpdate) {
  return update.answer.correction?.verified || update.answer.verified;
}

function verifiedExplanation(update: TextbookAnswerAuditUpdate) {
  return update.answer.correction?.explanation || update.answer.explanation;
}

function validateAudits(dataset: TextbookDataset, audits: readonly TextbookAnswerAudit[]) {
  const questionById = new Map(dataset.questions.map((question) => [question.id, question]));
  const seenUpdates = new Set<string>();
  const seenUnresolved = new Set<string>();

  for (const audit of audits) {
    if (audit.schemaVersion !== "textbook-answer-audit-v1") throw new Error(`未知答案审计格式：${audit.schemaVersion}`);
    if (audit.bookId !== dataset.book.id) throw new Error(`答案审计书籍不匹配：${audit.bookId}`);
    for (const update of audit.updates) {
      const question = questionById.get(update.id);
      if (!question) throw new Error(`答案审计引用了不存在的题目：${update.id}`);
      if (!audit.scope.includes(question.chapterId)) throw new Error(`答案审计越界：${update.id} 不属于声明的 scope`);
      if (seenUpdates.has(update.id)) throw new Error(`同一道题被多个答案审计重复补写：${update.id}`);
      if (update.answer.origin !== "verified" || !verifiedContent(update).trim()) throw new Error(`核验答案格式无效：${update.id}`);
      if (update.answer.correction && !update.answer.correction.reason.trim()) throw new Error(`核验修正缺少原因：${update.id}`);
      seenUpdates.add(update.id);
    }
    for (const item of audit.unresolved || []) {
      const question = questionById.get(item.id);
      if (!question) throw new Error(`未决审计引用了不存在的题目：${item.id}`);
      if (!audit.scope.includes(question.chapterId)) throw new Error(`未决审计越界：${item.id}`);
      if (seenUnresolved.has(item.id)) throw new Error(`同一道题被多个未决审计重复记录：${item.id}`);
      if (!item.reason.trim()) throw new Error(`未决审计缺少原因：${item.id}`);
      seenUnresolved.add(item.id);
    }
  }
}

function refreshedStats(dataset: TextbookDataset): TextbookDataset["stats"] {
  const questions = dataset.questions;
  return {
    ...dataset.stats,
    answersProvided: questions.filter((question) => originalStatus(question) === "provided").length,
    answersMissing: questions.filter((question) => originalStatus(question) === "missing").length,
    answersHintOnly: questions.filter((question) => originalStatus(question) === "hint-only").length,
    answersVerified: questions.filter((question) => Boolean(question.answer.verified?.trim())).length,
    openReviewFlags: questions.flatMap((question) => question.review.flags).filter((flag) => flag.status === "open").length,
  };
}

/**
 * Applies independently-reviewed supplements on top of the generated book index.
 * The original book transcription stays intact; supplements are stored separately
 * in `answer.verified` and keep their own provenance in the UI.
 */
export function applyTextbookAnswerAudits(dataset: TextbookDataset, audits: readonly TextbookAnswerAudit[]): TextbookDataset {
  validateAudits(dataset, audits);
  const updates = new Map(audits.flatMap((audit) => audit.updates.map((update) => [update.id, update])));
  const unresolved = new Map(audits.flatMap((audit) => (audit.unresolved || []).map((item) => [item.id, item])));

  const questions = dataset.questions.map((question) => {
    const update = updates.get(question.id);
    const unresolvedItem = unresolved.get(question.id);
    if (!update && !unresolvedItem) return question;

    const baseStatus = originalStatus(question);
    const resolvedCodes = new Set(update?.review.resolvedFlagCodes || []);
    const flags = question.review.flags.map((flag) => resolvedCodes.has(flag.code) ? { ...flag, status: "resolved" } : { ...flag });
    if (unresolvedItem && !flags.some((flag) => flag.code === "VERIFIED_ANSWER_UNRESOLVED" && flag.status === "open")) {
      flags.push({
        code: "VERIFIED_ANSWER_UNRESOLVED",
        message: unresolvedItem.reason,
        severity: "warning",
        status: "open",
      });
    }
    const hasOpenFlags = flags.some((flag) => flag.status === "open");
    const verified = update ? verifiedContent(update) : "";
    const explanation = update ? verifiedExplanation(update) : undefined;

    return {
      ...question,
      answer: update ? {
        ...question.answer,
        originalStatus: baseStatus,
        status: update.answer.status,
        origin: question.answer.original.trim() ? "book+verified" : "verified",
        verified,
        verifiedHtml: renderVerifiedAnswerMarkdown(verified),
        explanation,
      } : question.answer,
      review: {
        ...question.review,
        status: hasOpenFlags ? "needs-review" : (update?.review.status || question.review.status),
        flags,
        notes: [question.review.notes, update?.review.notes].filter(Boolean).join("\n") || undefined,
      },
    };
  });

  const next = { ...dataset, questions };
  return { ...next, stats: refreshedStats(next) };
}
