import katex from "katex";
import { marked, Renderer } from "marked";

type MathReplacement = {
  marker: string;
  html: string;
};

const previewCache = new Map<string, string>();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripRepeatedQuestionHeading(markdown: string, questionNumber: string) {
  const heading = markdown.match(/^\s*#{1,6}\s+([^\r\n]+)(?:\r?\n+|$)/);
  if (!heading || !heading[1].includes(questionNumber)) return markdown;
  return markdown.slice(heading[0].length);
}

function prepareMath(markdown: string) {
  const replacements: MathReplacement[] = [];
  const token = (latex: string, displayMode: boolean) => {
    const source = latex.trim();
    if (!source) return "";
    const marker = `QUESTION_PREVIEW_MATH_${replacements.length}_END`;
    replacements.push({
      marker,
      html: katex.renderToString(source, {
        displayMode,
        throwOnError: false,
        strict: "ignore",
        trust: false,
      }),
    });
    return marker;
  };
  const prepared = markdown.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g).map((segment) => {
    if (segment.startsWith("`") || segment.startsWith("~~~")) return segment;
    return segment
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, latex: string) => `\n\n${token(latex, true)}\n\n`)
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, latex: string) => `\n\n${token(latex, true)}\n\n`)
      .replace(/\\\(([\s\S]+?)\\\)/g, (_, latex: string) => token(latex, false))
      .replace(/(?<!\\)\$([^\n$]+?)(?<!\\)\$/g, (_, latex: string) => token(latex, false));
  }).join("");
  return { prepared, replacements };
}

/** Render trusted, locally imported question Markdown as a compact, non-interactive card preview. */
export function renderQuestionPreviewMarkdown(markdown: string, questionNumber: string) {
  const cacheKey = `${questionNumber}\u0000${markdown}`;
  const cached = previewCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const { prepared, replacements } = prepareMath(stripRepeatedQuestionHeading(markdown, questionNumber));
  const renderer = new Renderer();
  renderer.html = ({ text }) => text.startsWith("<!--") ? "" : escapeHtml(text);
  renderer.link = function link({ tokens }) {
    return this.parser.parseInline(tokens);
  };
  renderer.image = ({ text }) => `<span class="question-preview-image">题图：${escapeHtml(text || "教材插图")}</span>`;

  try {
    const parsed = marked.parse(prepared, { gfm: true, breaks: false, renderer });
    const html = replacements.reduce(
      (value, replacement) => value.replaceAll(replacement.marker, replacement.html),
      typeof parsed === "string" ? parsed : "",
    );
    previewCache.set(cacheKey, html);
    return html;
  } catch {
    const fallback = `<p>${escapeHtml(markdown)}</p>`;
    previewCache.set(cacheKey, fallback);
    return fallback;
  }
}
