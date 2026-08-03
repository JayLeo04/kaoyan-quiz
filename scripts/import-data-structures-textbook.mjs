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
const visualTypes = new Set([
  "growth-curves",
  "algorithm-trace",
  "memory-scale",
  "process-flow",
  "state-machine",
  "timeline",
  "comparison",
  "address-fields",
  "banker-simulator",
  "resource-allocation-graph",
  "semaphore-lab",
  "scheduler-queue",
  "concurrency-lab",
]);
const visualMarkerPattern = /<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/g;
const visualMarkerExactPattern = /^<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->$/;
const visualIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbiddenVisualKey = /^(html|script|style|src|url|href|onclick|onchange|oninput)$/i;

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

function assertSafeVisualConfig(value, manifestPath, trail = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSafeVisualConfig(item, manifestPath, [...trail, String(index)]));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const nextTrail = [...trail, key];
    if (forbiddenVisualKey.test(key) || /^on[A-Z]/.test(key)) {
      throw new Error(`${manifestPath}: 可视化配置字段 ${nextTrail.join(".")} 不允许包含渲染代码或事件处理器`);
    }
    if (key === "autoPlay" && child === true) {
      throw new Error(`${manifestPath}: 可视化不得默认自动播放`);
    }
    if (typeof child === "string" && /https?:\/\//i.test(child)) {
      throw new Error(`${manifestPath}: 可视化配置字段 ${nextTrail.join(".")} 不允许包含外部 URL`);
    }
    assertSafeVisualConfig(child, manifestPath, nextTrail);
  }
}

function assertTextbookTraceSpec(spec, manifestPath) {
  if (spec.type !== "algorithm-trace") return;
  const config = spec.config;
  const steps = Array.isArray(config.steps) ? config.steps : [];
  if (steps.length < 2 || steps.some((step) => !step || typeof step !== "object" || !String(step.label || "").trim() || !String(step.note || "").trim())) {
    throw new Error(`${manifestPath}: ${spec.id} 的每个动画步骤都必须有 label 和 note`);
  }
  if (config.variant === "hanoi-recursion") {
    const pegs = Array.isArray(config.pegs) ? config.pegs : [];
    const pegIds = pegs.map((peg) => peg?.id);
    if (pegIds.join(",") !== "a,b,c") throw new Error(`${manifestPath}: ${spec.id} 必须声明 a、b、c 三根柱`);
    for (const step of steps) {
      const towers = step.towers;
      const stack = step.stack;
      if (!Array.isArray(stack) || !towers || typeof towers !== "object" || ["a", "b", "c"].some((peg) => !Array.isArray(towers[peg]))) {
        throw new Error(`${manifestPath}: ${spec.id} 的每一步必须完整给出工作栈与三根柱状态`);
      }
      const disks = ["a", "b", "c"].flatMap((peg) => towers[peg]);
      if (disks.length !== 3 || disks.some((disk) => !Number.isInteger(disk)) || new Set(disks).size !== 3 || ![1, 2, 3].every((disk) => disks.includes(disk))) {
        throw new Error(`${manifestPath}: ${spec.id} 的每一步必须完整保留 1、2、3 号圆盘`);
      }
    }
    return;
  }
  if (config.variant === "bank-event-queue") {
    for (const step of steps) {
      const queues = step.queues;
      if (!Array.isArray(step.eventList) || !queues || typeof queues !== "object" || ["q1", "q2", "q3", "q4"].some((queue) => !Array.isArray(queues[queue]))) {
        throw new Error(`${manifestPath}: ${spec.id} 的每一步必须完整给出事件表与四个窗口队列`);
      }
    }
    return;
  }
  if (config.variant === "kmp-next-fallback") {
    const main = config.main;
    const pattern = config.pattern;
    const nextValues = config.next;
    if (typeof main !== "string" || !main.length || typeof pattern !== "string" || !pattern.length || !Array.isArray(nextValues) || nextValues.length !== pattern.length) {
      throw new Error(`${manifestPath}: ${spec.id} 必须完整给出主串、模式串和等长的 next 表`);
    }
    if (nextValues.some((value, index) => !Number.isInteger(value) || value < 0 || value > index) || nextValues[0] !== 0) {
      throw new Error(`${manifestPath}: ${spec.id} 的 next 表必须是从 0 开始的合法回退位置`);
    }
    for (const step of steps) {
      const { i, j, patternStart, matched, nextJump } = step;
      if (!Number.isInteger(i) || i < 1 || i > main.length || !Number.isInteger(j) || j < 0 || j > pattern.length + 1 || !Number.isInteger(patternStart) || patternStart < 1 || patternStart > main.length || !Number.isInteger(matched) || matched < 0 || matched > pattern.length || (nextJump !== null && !Number.isInteger(nextJump))) {
        throw new Error(`${manifestPath}: ${spec.id} 的每一步必须给出范围合法的 i、j、对齐位置、已匹配长度与回退位置`);
      }
    }
    return;
  }
  throw new Error(`${manifestPath}: ${spec.id} 的 algorithm-trace 必须声明受支持的教材动画 variant`);
}

function loadTextbookVisualManifest(sourceRoot) {
  const manifestPath = path.join(sourceRoot, "_visualizations.json");
  if (!fs.existsSync(manifestPath)) return { manifestPath, byRoute: new Map(), ids: new Set() };
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.version !== 1 || manifest.subject !== "ds" || !Array.isArray(manifest.visualizations)) {
    throw new Error(`${manifestPath}: 教材可视化清单顶层格式无效`);
  }
  const byRoute = new Map();
  const ids = new Set();
  for (const candidate of manifest.visualizations) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error(`${manifestPath}: 可视化 spec 必须为对象`);
    const spec = { ...candidate, sourceLatex: candidate.sourceLatex || [] };
    if (!visualIdPattern.test(spec.id || "") || !spec.id.startsWith("ds-") || ids.has(spec.id)) {
      throw new Error(`${manifestPath}: 可视化 ID ${JSON.stringify(spec.id)} 无效或重复`);
    }
    if (typeof spec.route !== "string" || path.isAbsolute(spec.route) || spec.route.split(/[\\/]/).includes("..")) {
      throw new Error(`${manifestPath}: ${spec.id} 的 route 不安全`);
    }
    if (!visualTypes.has(spec.type) || typeof spec.title !== "string" || !spec.title.trim() || typeof spec.summary !== "string" || !spec.summary.trim() || !spec.config || typeof spec.config !== "object" || Array.isArray(spec.config)) {
      throw new Error(`${manifestPath}: ${spec.id} 的通用字段无效`);
    }
    if (!Array.isArray(spec.sourceLatex) || spec.sourceLatex.some((item) => typeof item !== "string")) {
      throw new Error(`${manifestPath}: ${spec.id}.sourceLatex 必须为字符串数组`);
    }
    assertSafeVisualConfig(spec.config, manifestPath);
    assertTextbookTraceSpec(spec, manifestPath);
    const formulaHtml = Object.fromEntries(spec.sourceLatex.map((latex) => [latex, katex.renderToString(latex, { throwOnError: false, strict: "ignore" })]));
    const enriched = { ...spec, formulaHtml };
    ids.add(spec.id);
    byRoute.set(spec.route, [...(byRoute.get(spec.route) || []), enriched]);
  }
  return { manifestPath, byRoute, ids };
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
  renderer.html = ({ text }) => {
    const trimmed = text.trim();
    // The reader hydrates only approved visual markers into React components;
    // all other raw HTML remains escaped or removed as before.
    if (visualMarkerExactPattern.test(trimmed)) return trimmed;
    return text.startsWith("<!--") ? "" : escapeHtml(text);
  };
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

function sectionNumberFromHeading(markdown) {
  return String(markdown || "").match(/^#\s+(\d+\.\d+)(?:\s|　)/m)?.[1] || null;
}

function pageShell(markdown) {
  const title = String(markdown || "").match(/^#\s+.+$/m);
  if (!title || title.index === undefined) return String(markdown || "").trimEnd();
  const preamble = markdown.slice(0, title.index).trimEnd();
  return `${preamble}${preamble ? "\n" : ""}${title[0]}`;
}

function figureImages(markdown) {
  const byNumber = new Map();
  const unnamed = [];
  for (const match of String(markdown || "").matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const alt = match[1].trim();
    const image = `![${alt}](${match[2].trim()})`;
    const figureNumber = alt.match(/图\s*(\d+(?:\.\d+)+)/)?.[1];
    if (figureNumber) {
      byNumber.set(figureNumber, image);
    } else {
      unnamed.push(image);
    }
  }
  return { byNumber, unnamed };
}

function cleanFigurePlaceholderText(value) {
  return String(value || "")
    .replace(/^\[|\]$/g, "")
    .replaceAll("占位，", "，")
    .replaceAll("占位：", "：")
    .replaceAll("占位", "")
    .replace(/后续应据此重绘。?$/, "")
    .replace(/此图应按原图重绘(?:为[^。]*)?。?$/, "")
    .replace(/应按原图重绘。?$/, "")
    .trim();
}

function figurePlaceholderNote(attributes) {
  const { figure, pdf_page: pdfPage, book_page: bookPage, structure } = extractAttributes(attributes);
  const pages = [pdfPage && `PDF p${pdfPage}`, bookPage && `书内 p${bookPage}`].filter(Boolean).join("，");
  const label = figure ? `图 ${figure}` : "结构示意图";
  return `> **${label}${pages ? `（${pages}）` : ""}**${structure ? `：${structure}` : ""}`;
}

/**
 * Page-segment transcriptions are deliberately kept out of the navigation tree,
 * but some legacy OCR batches left a chapter's only full text in work/sections.
 * Reassemble those source-verified segments into their canonical section pages
 * during import so the public reader never turns a chapter into an outline.
 */
function workSectionBodies(sourceRoot) {
  const bodies = new Map();
  for (const chapter of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!chapter.isDirectory()) continue;
    const sectionsRoot = path.join(sourceRoot, chapter.name, "work", "sections");
    if (!fs.existsSync(sectionsRoot)) continue;
    const segmentFiles = fs.readdirSync(sectionsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(sectionsRoot, entry.name, "index.md")))
      .sort((left, right) => left.name.localeCompare(right.name, "en", { numeric: true }))
      .map((entry) => path.join(sectionsRoot, entry.name, "index.md"));
    const combined = segmentFiles.map((file) => fs.readFileSync(file, "utf8")
      // The section page already supplies the one public chapter title.
      .replace(/^#\s+.+\r?\n?/m, "").trim()).join("\n\n");
    // A continuation batch can restart a chapter/section at H1, while true
    // children such as 8.3.2 remain H1 in legacy OCR. Split only on a two-part
    // section number and retain the deeper headings inside its parent section.
    const headings = [...combined.matchAll(/^#+\s+(\d+\.\d+)(?!\.)(?:\s|　).+$/gm)];
    for (let index = 0; index < headings.length; index += 1) {
      const current = headings[index];
      const next = headings[index + 1];
      const start = (current.index || 0) + current[0].length;
      const body = combined.slice(start, next?.index).trim()
        .replace(/^#\s+(\d+\.\d+\.\d+)(?:\s|　)/gm, "### $1 ");
      if (!body) continue;
      const key = `${chapter.name}:${current[1]}`;
      const existing = bodies.get(key);
      bodies.set(key, existing ? `${existing}\n\n${body}` : body);
    }
  }
  return bodies;
}

function injectWorkFigureImages(markdown, canonicalMarkdown) {
  const images = figureImages(canonicalMarkdown);
  let unnamedIndex = 0;
  const imageFor = (figureNumber) => figureNumber ? images.byNumber.get(figureNumber) : images.unnamed[unnamedIndex++];
  const withCommentFigures = String(markdown || "").replace(/<!--\s*luna:figure-placeholder\s+([\s\S]*?)-->/g, (placeholder, attributes) => {
    const image = imageFor(extractAttributes(attributes).figure);
    return image ? `${image}\n\n${figurePlaceholderNote(attributes)}` : figurePlaceholderNote(attributes);
  });
  const withQuotedFigures = withCommentFigures.replace(/^>\s+\*\*图\s*(\d+(?:\.\d+)+)[^\r\n]*占位[^\r\n]*$/gm, (placeholder, figureNumber) => {
    const image = imageFor(figureNumber);
    const note = cleanFigurePlaceholderText(placeholder);
    return image ? `${image}\n\n${note}` : note;
  });
  return withQuotedFigures
    .replace(/\[图\s*(\d+(?:\.\d+)+)\s*占位[^\]]*\]/g, (placeholder, figureNumber) => {
      const image = imageFor(figureNumber);
      const note = `> ${cleanFigurePlaceholderText(placeholder)}`;
      return image ? `${image}\n\n${note}` : note;
    })
    .replace(/\[结构示意图占位[^\]]*\]/g, (placeholder) => {
      const image = imageFor();
      const note = `> ${cleanFigurePlaceholderText(placeholder)}`;
      return image ? `${image}\n\n${note}` : note;
    });
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
const segmentedBodies = workSectionBodies(textbookSourceRoot);
const canonicalPages = rawPages.map((page) => {
  const sectionNumber = sectionNumberFromHeading(page.markdown);
  const workBody = sectionNumber ? segmentedBodies.get(`${page.chapterId}:${sectionNumber}`) : null;
  if (!workBody) return page;
  const markdown = `${pageShell(page.markdown)}\n\n${injectWorkFigureImages(workBody, page.markdown).trim()}\n`;
  return {
    ...page,
    headings: [...markdown.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => cleanText(match[1])).filter(Boolean),
    source: sourceMetadata(markdown),
    markdown,
  };
});
const visualManifest = loadTextbookVisualManifest(textbookSourceRoot);
for (const route of visualManifest.byRoute.keys()) {
  if (!canonicalPages.some((page) => page.slug === route)) {
    throw new Error(`${visualManifest.manifestPath}: 可视化 route ${route || "."} 不存在对应教材页`);
  }
}
const pagesByPath = new Map(canonicalPages.map((page) => [page.sourcePath, page]));
const resolvedVisualIds = new Set();
const pages = canonicalPages.map((page) => {
  const declaredVisualizations = visualManifest.byRoute.get(page.slug) || [];
  const pageMarkers = [...page.markdown.matchAll(visualMarkerPattern)].map((match) => match[1]);
  const expectedIds = new Set(declaredVisualizations.map((spec) => spec.id));
  if (pageMarkers.length !== new Set(pageMarkers).size) {
    throw new Error(`${page.sourcePath}: 可视化标记不可重复`);
  }
  for (const markerId of pageMarkers) {
    if (!expectedIds.has(markerId)) throw new Error(`${page.sourcePath}: ${markerId} 没有匹配当前页面的可视化 spec`);
  }
  for (const spec of declaredVisualizations) {
    if (pageMarkers.filter((id) => id === spec.id).length !== 1) {
      throw new Error(`${visualManifest.manifestPath}: ${spec.id} 必须在目标 Markdown 中恰好出现一次`);
    }
    resolvedVisualIds.add(spec.id);
  }
  const visualById = new Map(declaredVisualizations.map((spec) => [spec.id, spec]));
  const pageVisualizations = pageMarkers.map((markerId) => visualById.get(markerId));
  const rendered = renderMarkdown(page.markdown, { sourcePath: page.sourcePath, pagesByPath, publicBase: textbookPublicBase });
  return {
    ...page,
    summary: firstSummary(page.markdown, page.title),
    sourceLatex: [...new Set([...rendered.sourceLatex, ...pageVisualizations.flatMap((spec) => spec.sourceLatex || [])])],
    visualizations: pageVisualizations,
    html: rendered.html,
  };
}).sort((left, right) => sortPages(left, right, chapterOrder));
if (resolvedVisualIds.size !== visualManifest.ids.size) {
  throw new Error(`${visualManifest.manifestPath}: 有可视化 spec 未被解析到对应教材页`);
}

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
