import fs from "node:fs";
import path from "node:path";
import { marked, Renderer } from "marked";
import katex from "katex";

const projectRoot = path.resolve(import.meta.dirname, "..");
const textbookSourceRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin");
const exerciseSourceRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin-exercises");
const outputPath = path.join(projectRoot, "app", "data", "textbook-data-structures.json");
const textbookPublicRoot = path.join(projectRoot, "public", "textbooks", "data-structures");
const textbookPublicBase = "/textbooks/data-structures";
const exercisePublicRoot = path.join(textbookPublicRoot, "exercises");
const exercisePublicBase = `${textbookPublicBase}/exercises`;
const skippedDirectories = new Set(["assets", "audits", "tmp", "work", "__page_review", "review"]);
const mediaExtension = /\.(?:svg|png|jpe?g|gif|webp)$/i;

function asPosix(value) {
  return value.split(path.sep).join("/");
}

function walkMarkdown(root) {
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name, "en"))) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!skippedDirectories.has(entry.name)) walk(target);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(target);
      }
    }
  };
  walk(root);
  return files;
}

function copyMediaFile(source, output) {
  if (path.extname(source).toLowerCase() === ".svg") {
    const svg = fs.readFileSync(source, "utf8").replace(/[ \t]+(?=\r?\n)/g, "");
    fs.writeFileSync(output, svg);
    return;
  }
  fs.copyFileSync(source, output);
}

function copyMedia(sourceRoot, destinationRoot) {
  let count = 0;
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!new Set(["audits", "tmp", "work", "__page_review", "review"]).has(entry.name)) walk(target);
      } else if (entry.isFile() && mediaExtension.test(entry.name)) {
        const relative = path.relative(sourceRoot, target);
        const output = path.join(destinationRoot, relative);
        fs.mkdirSync(path.dirname(output), { recursive: true });
        copyMediaFile(target, output);
        count += 1;
      }
    }
  };
  walk(sourceRoot);
  return count;
}

function copyExerciseImageAliases(questions) {
  const byName = new Map();
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!new Set(["audits", "tmp", "work", "__page_review", "review"]).has(entry.name)) walk(target);
      } else if (entry.isFile() && mediaExtension.test(entry.name)) {
        const records = byName.get(entry.name) || [];
        records.push(target);
        byName.set(entry.name, records);
      }
    }
  };
  walk(exerciseSourceRoot);
  let copied = 0;
  const copiedOutputs = new Set();
  for (const question of questions) {
    for (const image of question.images) {
      const output = path.resolve(exercisePublicRoot, image.path);
      if (!output.startsWith(`${exercisePublicRoot}${path.sep}`)) continue;
      if (copiedOutputs.has(output)) continue;
      const source = byName.get(path.basename(image.path))?.[0];
      if (!source) continue;
      fs.mkdirSync(path.dirname(output), { recursive: true });
      copyMediaFile(source, output);
      copiedOutputs.add(output);
      copied += 1;
    }
  }
  return copied;
}

function extractAttributes(value) {
  return Object.fromEntries([...value.matchAll(/([a-z_]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3] ?? ""]));
}

function sourceMetadata(markdown) {
  const comments = [...markdown.matchAll(/<!--\s*luna:([a-z-]+)\s+([\s\S]*?)-->/g)];
  const source = comments.find((comment) => comment[1] === "source");
  return {
    attributes: source ? extractAttributes(source[2]) : {},
    pageMarkers: comments.filter((comment) => comment[1] === "page").map((comment) => extractAttributes(comment[2])),
  };
}

function cleanForRender(markdown) {
  return markdown.replace(/<!--\s*luna:[\s\S]*?-->/g, "");
}

function expandFootnotes(markdown) {
  const notes = [];
  const body = markdown.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, (_, identifier, text) => {
    notes.push({ identifier, text });
    return "";
  }).replace(/\[\^([^\]]+)\]/g, (_, identifier) => `〔注 ${identifier}〕`);
  if (!notes.length) return body;
  return `${body.trim()}\n\n## 注释\n\n${notes.map((note) => `- 〔注 ${note.identifier}〕 ${note.text}`).join("\n")}`;
}

function cleanText(value) {
  return value
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#|]/g, " ")
    .replace(/\$+([^$]+)\$+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSummary(markdown, fallback) {
  const lines = cleanForRender(markdown).split("\n");
  for (const line of lines) {
    const text = cleanText(line);
    if (!text || text === fallback || /^目录$/.test(text) || /^第\s*\d+\s*章/.test(text)) continue;
    if (text.length >= 14) return text.slice(0, 180);
  }
  return fallback;
}

function slugFor(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized === "index.md") return "";
  if (normalized.endsWith("/index.md")) return normalized.slice(0, -"/index.md".length);
  return normalized.replace(/\.md$/i, "");
}

function parentSlugFor(slug) {
  if (!slug) return null;
  const segments = slug.split("/");
  return segments.length > 1 ? segments.slice(0, -1).join("/") : null;
}

function routeFor(slug) {
  return slug ? `/textbook/data-structures/${slug}` : "/textbook/data-structures";
}

function safeHref(value) {
  return String(value || "").trim().replace(/[\u0000-\u001f\u007f]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function splitHref(value) {
  const marker = value.search(/[?#]/);
  return marker < 0 ? { pathname: value, suffix: "" } : { pathname: value.slice(0, marker), suffix: value.slice(marker) };
}

function localAssetHref(href, sourcePath, publicBase, rootAssetFallback = false) {
  const value = safeHref(href);
  if (!value || /^javascript:/i.test(value) || /^data:/i.test(value)) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return value;
  const { pathname, suffix } = splitHref(value);
  if (rootAssetFallback && pathname.replace(/^\.\//, "").startsWith("assets/")) return `${publicBase}/${pathname.replace(/^\.\//, "")}${suffix}`;
  const sourceDirectory = path.posix.dirname(sourcePath);
  const resolved = path.posix.normalize(path.posix.join(sourceDirectory === "." ? "" : sourceDirectory, pathname));
  if (resolved.startsWith("../")) return "";
  return `${publicBase}/${resolved}${suffix}`;
}

function localPageHref(href, sourcePath, pagesByPath, publicBase, rootAssetFallback) {
  const value = safeHref(href);
  if (!value || /^javascript:/i.test(value) || /^data:/i.test(value)) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("mailto:")) return value;
  if (value.startsWith("#")) return value;
  if (value.startsWith("/")) return value;
  const { pathname, suffix } = splitHref(value);
  const sourceDirectory = path.posix.dirname(sourcePath);
  let candidate = path.posix.normalize(path.posix.join(sourceDirectory === "." ? "" : sourceDirectory, pathname));
  if (candidate.startsWith("../")) return "";
  if (pagesByPath.has(candidate)) return `${pagesByPath.get(candidate).route}${suffix}`;
  if (!path.posix.extname(candidate)) candidate = path.posix.join(candidate, "index.md");
  if (pagesByPath.has(candidate)) return `${pagesByPath.get(candidate).route}${suffix}`;
  return mediaExtension.test(pathname) ? localAssetHref(value, sourcePath, publicBase, rootAssetFallback) : "";
}

function exerciseImageHref(imagePath, source) {
  const candidates = [source?.question?.markdown, source?.answer?.markdown, "index.md"].filter(Boolean);
  for (const sourcePath of candidates) {
    const sourceDirectory = path.posix.dirname(sourcePath);
    const resolved = path.resolve(exerciseSourceRoot, sourceDirectory === "." ? "" : sourceDirectory, imagePath);
    if (resolved.startsWith(`${exerciseSourceRoot}${path.sep}`) && fs.existsSync(resolved)) {
      return localAssetHref(imagePath, sourcePath, exercisePublicBase, true);
    }
  }
  return localAssetHref(imagePath, "index.md", exercisePublicBase, true);
}

function prepareMath(markdown) {
  const formulas = new Set();
  const replacements = [];
  const token = (latex, displayMode) => {
    const source = latex.trim();
    if (!source) return "";
    formulas.add(source);
    const marker = `TEXTBOOK_MATH_${replacements.length}_END`;
    replacements.push({
      marker,
      html: katex.renderToString(source, { displayMode, throwOnError: false, strict: "ignore", trust: false }),
    });
    return marker;
  };
  const replaced = markdown.split(/(```[\s\S]*?```|`[^`\n]*`)/g).map((segment) => {
    if (segment.startsWith("`")) return segment;
    return segment
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => `\n\n${token(latex, true)}\n\n`)
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, latex) => `\n\n${token(latex, true)}\n\n`)
      .replace(/\\\(([\s\S]+?)\\\)/g, (_, latex) => token(latex, false))
      .replace(/(?<!\\)\$([^\n$]+?)(?<!\\)\$/g, (_, latex) => token(latex, false));
  }).join("");
  return { markdown: replaced, formulas: [...formulas], replacements };
}

function renderMarkdown(markdown, { sourcePath, pagesByPath, publicBase, rootAssetFallback = false }) {
  const prepared = prepareMath(expandFootnotes(cleanForRender(markdown)));
  const renderer = new Renderer();
  renderer.html = ({ text }) => text.startsWith("<!--") ? "" : escapeHtml(text);
  renderer.link = function link({ href, title, tokens }) {
    const safe = localPageHref(href, sourcePath, pagesByPath, publicBase, rootAssetFallback);
    const label = this.parser.parseInline(tokens);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe) || /^mailto:/i.test(safe);
    return `<a href="${escapeHtml(safe)}"${title ? ` title="${escapeHtml(title)}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    const safe = localAssetHref(href, sourcePath, publicBase, rootAssetFallback);
    const alt = escapeHtml(text || "教材插图");
    if (!safe) return `<span class="textbook-missing-image">[图片：${alt}]</span>`;
    return `<img src="${escapeHtml(safe)}" alt="${alt}"${title ? ` title="${escapeHtml(title)}"` : ""} loading="lazy" decoding="async">`;
  };
  const parsed = marked.parse(prepared.markdown, { gfm: true, breaks: false, renderer });
  const html = prepared.replacements.reduce((current, replacement) => current.replaceAll(replacement.marker, replacement.html), String(parsed));
  return { html, sourceLatex: prepared.formulas };
}

function findInlineImageNames(markdown) {
  return new Set([...String(markdown || "").matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => path.posix.basename(splitHref(match[1]).pathname)));
}

function sortPages(left, right, chapterOrder) {
  if (!left.slug) return -1;
  if (!right.slug) return 1;
  const leftChapter = chapterOrder.get(left.chapterId || "") ?? Number.MAX_SAFE_INTEGER;
  const rightChapter = chapterOrder.get(right.chapterId || "") ?? Number.MAX_SAFE_INTEGER;
  if (leftChapter !== rightChapter) return leftChapter - rightChapter;
  const leftSegments = left.slug.split("/");
  const rightSegments = right.slug.split("/");
  for (let index = 0; index < Math.min(leftSegments.length, rightSegments.length); index += 1) {
    const difference = leftSegments[index].localeCompare(rightSegments[index], "en");
    if (difference) return difference;
  }
  return leftSegments.length - rightSegments.length;
}

if (!fs.existsSync(textbookSourceRoot) || !fs.existsSync(exerciseSourceRoot)) {
  throw new Error("找不到数据结构教材或习题集源材料；请先完成 OCR 产物准备。");
}

const manifest = JSON.parse(fs.readFileSync(path.join(textbookSourceRoot, "manifest.json"), "utf8"));
const exerciseCatalog = JSON.parse(fs.readFileSync(path.join(exerciseSourceRoot, "questions", "index.json"), "utf8"));
const chapterOrder = new Map(manifest.chapters.map((chapter, index) => [chapter.id, index]));
const sourceFiles = walkMarkdown(textbookSourceRoot);
const rawPages = sourceFiles.map((sourceFile) => {
  const relativePath = asPosix(path.relative(textbookSourceRoot, sourceFile));
  const slug = slugFor(relativePath);
  const chapterId = slug ? slug.split("/")[0] : null;
  const markdown = fs.readFileSync(sourceFile, "utf8");
  return {
    id: `textbook-ds:${slug || "root"}`,
    slug,
    route: routeFor(slug),
    sourcePath: relativePath,
    chapterId,
    title: markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || (slug ? path.posix.basename(slug) : manifest.title),
    summary: "",
    depth: slug ? slug.split("/").length : 0,
    parentSlug: parentSlugFor(slug),
    headings: [...markdown.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => cleanText(match[1])).filter(Boolean),
    source: sourceMetadata(markdown),
    markdown,
  };
});
const pagesByPath = new Map(rawPages.map((page) => [page.sourcePath, page]));
const pages = rawPages.map((page) => {
  const rendered = renderMarkdown(page.markdown, { sourcePath: page.sourcePath, pagesByPath, publicBase: textbookPublicBase });
  return {
    ...page,
    summary: firstSummary(page.markdown, page.title),
    sourceLatex: rendered.sourceLatex,
    html: rendered.html,
  };
}).sort((left, right) => sortPages(left, right, chapterOrder));

const chapters = exerciseCatalog.chapters.map((chapter) => ({
  id: chapter.id,
  title: chapter.title,
  bookPages: chapter.bookPages,
  pdfPages: chapter.pdfPages,
  route: pages.find((page) => page.slug === chapter.id)?.route || null,
  questionCount: chapter.questionCount,
  part: chapter.part,
}));

const questions = exerciseCatalog.questions.map((question) => {
  const questionPath = question.source?.question?.markdown || "index.md";
  const answerPath = question.source?.answer?.markdown || questionPath;
  const promptMarkdown = question.prompt?.markdown || "";
  const answerOriginal = question.answer?.original || "";
  const prompt = renderMarkdown(promptMarkdown, { sourcePath: questionPath, pagesByPath: new Map(), publicBase: exercisePublicBase, rootAssetFallback: true });
  const answer = renderMarkdown(answerOriginal, { sourcePath: answerPath, pagesByPath: new Map(), publicBase: exercisePublicBase, rootAssetFallback: true });
  const inlineNames = new Set([...findInlineImageNames(promptMarkdown), ...findInlineImageNames(answerOriginal)]);
  return {
    id: question.id,
    number: question.number,
    type: question.type,
    chapterId: question.chapterId,
    section: question.section,
    prompt: { markdown: promptMarkdown, html: prompt.html, plain: cleanText(promptMarkdown) },
    options: (question.options || []).map((option) => ({
      label: option.label,
      markdown: option.markdown || "",
      html: renderMarkdown(option.markdown || "", { sourcePath: questionPath, pagesByPath: new Map(), publicBase: exercisePublicBase, rootAssetFallback: true }).html,
    })),
    answer: {
      status: question.answer?.status || "missing",
      origin: question.answer?.origin || "missing",
      original: answerOriginal,
      html: answer.html,
    },
    knowledgePoints: question.knowledgePoints || [],
    images: (question.images || []).map((image) => ({
      ...image,
      src: exerciseImageHref(image.path, question.source),
      inline: inlineNames.has(path.posix.basename(image.path)),
    })),
    source: question.source || {},
    review: question.review || { status: "pending", flags: [] },
    isExercise: !(question.review?.flags || []).some((flag) => flag.code === "NO_INDEPENDENT_EXERCISES"),
  };
});

const knowledgeImageCount = copyMedia(textbookSourceRoot, textbookPublicRoot);
const exerciseImageCount = copyMedia(exerciseSourceRoot, exercisePublicRoot);
const exerciseImageAliases = copyExerciseImageAliases(questions);
const answersByStatus = Object.fromEntries(["provided", "missing", "hint-only"].map((status) => [status, questions.filter((question) => question.answer.status === status).length]));
const openReviewFlags = questions.flatMap((question) => question.review.flags).filter((flag) => flag.status === "open").length;
const dataset = {
  version: 1,
  generatedAt: new Date().toISOString(),
  book: {
    id: "data-structures-yan-weimin",
    title: manifest.title,
    author: manifest.author,
    sourcePdf: manifest.source_pdf,
  },
  stats: {
    knowledgePages: pages.length,
    knowledgeImages: knowledgeImageCount,
    chapters: manifest.chapters.length,
    exerciseRecords: questions.length,
    exerciseQuestions: questions.filter((question) => question.isExercise).length,
    exerciseImages: exerciseImageCount,
    answersProvided: answersByStatus.provided,
    answersMissing: answersByStatus.missing,
    answersHintOnly: answersByStatus["hint-only"],
    openReviewFlags,
  },
  chapters,
  pages,
  questions,
  knowledgePoints: exerciseCatalog.knowledgePoints,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`已导入 ${pages.length} 篇教材页、${questions.length} 条习题记录和 ${knowledgeImageCount + exerciseImageCount + exerciseImageAliases} 张图资产。`);
