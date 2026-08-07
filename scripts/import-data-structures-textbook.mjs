import fs from "node:fs";
import path from "node:path";
import { marked, Renderer } from "marked";
import katex from "katex";

const projectRoot = path.resolve(import.meta.dirname, "..");
const textbookSourceRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin");
const exerciseSourceRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin-exercises");
const condensedSourceRoot = path.join(projectRoot, "examples", "408-knowledge-distillation");
const outputPath = path.join(projectRoot, "app", "data", "textbook-data-structures.json");
const knowledgeLinksOutputPath = path.join(projectRoot, "app", "data", "textbook-knowledge-links.json");
const textbookPublicRoot = path.join(projectRoot, "public", "textbooks", "data-structures");
const textbookPublicBase = "/textbooks/data-structures";
const condensedPublicRoot = path.join(textbookPublicRoot, "condensed");
const condensedPublicBase = `${textbookPublicBase}/condensed`;
const exercisePublicRoot = path.join(textbookPublicRoot, "exercises");
const exercisePublicBase = `${textbookPublicBase}/exercises`;
const skippedDirectories = new Set(["assets", "audits", "tmp", "work", "__page_review", "__detail-render", "__page-render", "review"]);
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
const textbookPageBreakMarker = "<!-- textbook-page-break -->";
const textbookPageBreakExactPattern = /^<!--\s*textbook-page-break\s*-->$/;
const visualIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbiddenVisualKey = /^(html|script|style|src|url|href|onclick|onchange|oninput)$/i;
const imageDimensionCache = new Map();

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
    const svg = fs.readFileSync(source, "utf8").replace(/\r\n/g, "\n").replace(/[ \t]+(?=\n)/g, "");
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

function countMediaFiles(root) {
  if (!fs.existsSync(root)) return 0;
  let count = 0;
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile() && mediaExtension.test(entry.name)) count += 1;
    }
  };
  walk(root);
  return count;
}

function copyExerciseMedia(questions) {
  let copied = 0;
  const copiedPaths = new Set();
  for (const question of questions) {
    for (const image of question.images) {
      const relative = path.posix.normalize(String(image.path || "").replace(/\\/g, "/"));
      if (!relative || relative.startsWith("../") || path.posix.isAbsolute(relative) || !mediaExtension.test(relative)) {
        throw new Error(`${question.id}: 非法习题图片路径 ${image.path}`);
      }
      if (copiedPaths.has(relative)) continue;
      const source = path.resolve(exerciseSourceRoot, ...relative.split("/"));
      const output = path.resolve(exercisePublicRoot, ...relative.split("/"));
      if (!source.startsWith(`${exerciseSourceRoot}${path.sep}`) || !output.startsWith(`${exercisePublicRoot}${path.sep}`)) {
        throw new Error(`${question.id}: 习题图片越出托管目录 ${relative}`);
      }
      if (!fs.existsSync(source)) throw new Error(`${question.id}: 习题图片不存在 ${relative}`);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      copyMediaFile(source, output);
      copiedPaths.add(relative);
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
  return markdown
    .replace(/<!--\s*luna:page\b[\s\S]*?-->/g, `\n${textbookPageBreakMarker}\n`)
    .replace(/<!--\s*luna:[\s\S]*?-->/g, "");
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

function svgLength(value) {
  const match = String(value || "").trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/i);
  const number = match ? Number(match[1]) : 0;
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function svgDimensions(sourceFile) {
  if (imageDimensionCache.has(sourceFile)) return imageDimensionCache.get(sourceFile);
  let dimensions = null;
  if (path.extname(sourceFile).toLowerCase() === ".svg" && fs.existsSync(sourceFile)) {
    const svgTag = fs.readFileSync(sourceFile, "utf8").match(/<svg\b[^>]*>/i)?.[0] || "";
    const attribute = (name) => svgTag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1] || "";
    let width = svgLength(attribute("width"));
    let height = svgLength(attribute("height"));
    const viewBox = attribute("viewBox").trim().split(/[\s,]+/).map(Number);
    if (viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0) {
      width ||= viewBox[2];
      height ||= viewBox[3];
    }
    if (width > 0 && height > 0) dimensions = { width: Math.round(width), height: Math.round(height) };
  }
  imageDimensionCache.set(sourceFile, dimensions);
  return dimensions;
}

function localImageDimensions(href, sourcePath, sourceRoot, rootAssetFallback) {
  if (!sourceRoot) return null;
  const value = safeHref(href);
  if (!value || /^(?:https?:|data:|javascript:)/i.test(value) || value.startsWith("/")) return null;
  const { pathname } = splitHref(value);
  const normalizedPathname = pathname.replace(/^\.\//, "");
  const sourceDirectory = path.posix.dirname(sourcePath);
  const relative = rootAssetFallback && normalizedPathname.startsWith("assets/")
    ? normalizedPathname
    : path.posix.normalize(path.posix.join(sourceDirectory === "." ? "" : sourceDirectory, pathname));
  if (!relative || relative.startsWith("../")) return null;
  const resolvedRoot = path.resolve(sourceRoot);
  const sourceFile = path.resolve(resolvedRoot, relative);
  if (sourceFile !== resolvedRoot && !sourceFile.startsWith(`${resolvedRoot}${path.sep}`)) return null;
  return svgDimensions(sourceFile);
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

function exerciseImageHref(imagePath) {
  const relative = path.posix.normalize(String(imagePath || "").replace(/\\/g, "/"));
  if (!relative || relative.startsWith("../") || path.posix.isAbsolute(relative)) return "";
  return `${exercisePublicBase}/${relative}`;
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
      source,
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

function renderMarkdown(markdown, { sourcePath, sourceRoot, pagesByPath, publicBase, rootAssetFallback = false }) {
  const prepared = prepareMath(expandFootnotes(cleanForRender(markdown)));
  const plainMath = (value) => prepared.replacements.reduce(
    (current, replacement) => current.replaceAll(replacement.marker, replacement.source),
    String(value || ""),
  );
  const renderer = new Renderer();
  renderer.html = ({ text }) => {
    const trimmed = text.trim();
    // The reader hydrates only approved visual markers into React components;
    // all other raw HTML remains escaped or removed as before.
    if (visualMarkerExactPattern.test(trimmed)) return trimmed;
    if (textbookPageBreakExactPattern.test(trimmed)) return trimmed;
    return text.startsWith("<!--") ? "" : escapeHtml(text);
  };
  renderer.link = function link({ href, title, tokens }) {
    const safe = localPageHref(href, sourcePath, pagesByPath, publicBase, rootAssetFallback);
    const label = this.parser.parseInline(tokens);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe) || /^mailto:/i.test(safe);
    return `<a href="${escapeHtml(safe)}"${title ? ` title="${escapeHtml(plainMath(title))}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    const safe = localAssetHref(href, sourcePath, publicBase, rootAssetFallback);
    const alt = escapeHtml(plainMath(text || "教材插图"));
    if (!safe) return `<span class="textbook-missing-image">[图片：${alt}]</span>`;
    const dimensions = localImageDimensions(href, sourcePath, sourceRoot, rootAssetFallback);
    const size = dimensions ? ` width="${dimensions.width}" height="${dimensions.height}"` : "";
    return `<img src="${escapeHtml(safe)}" alt="${alt}"${title ? ` title="${escapeHtml(plainMath(title))}"` : ""}${size} loading="lazy" decoding="async">`;
  };
  const parsed = marked.parse(prepared.markdown, { gfm: true, breaks: false, renderer });
  const html = prepared.replacements.reduce((current, replacement) => current.replaceAll(replacement.marker, replacement.html), String(parsed));
  return { html, sourceLatex: prepared.formulas };
}

function loadCondensedPages(sourceRoot, canonicalPages, pagesByPath) {
  const condensedBySlug = new Map();
  if (!fs.existsSync(sourceRoot)) return condensedBySlug;
  const originalsBySlug = new Map(canonicalPages.map((page) => [page.slug, page]));
  const sourceFiles = walkMarkdown(sourceRoot).filter((sourceFile) => path.basename(sourceFile) === "index.md");

  for (const sourceFile of sourceFiles) {
    const sourcePath = asPosix(path.relative(sourceRoot, sourceFile));
    const slug = slugFor(sourcePath);
    const originalPage = originalsBySlug.get(slug);
    if (!originalPage) throw new Error(`${sourcePath}: 精简版没有匹配的教材页面`);
    if (condensedBySlug.has(slug)) throw new Error(`${sourcePath}: 精简版页面路径重复`);

    const reviewPath = path.join(path.dirname(sourceFile), "review.json");
    if (!fs.existsSync(reviewPath)) throw new Error(`${sourcePath}: 精简版缺少 review.json`);
    const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
    if (review.status !== "distilled") throw new Error(`${sourcePath}: 只有 distilled 精简稿可以进入教材页面`);

    const markdown = fs.readFileSync(sourceFile, "utf8");
    const rendered = renderMarkdown(markdown, {
      sourcePath,
      sourceRoot,
      pagesByPath,
      publicBase: condensedPublicBase,
    });
    condensedBySlug.set(slug, {
      sourcePath,
      title: markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || originalPage.title,
      summary: firstSummary(markdown, originalPage.title),
      headings: [...markdown.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => cleanText(match[1])).filter(Boolean),
      sourceLatex: rendered.sourceLatex,
      visualizations: [],
      source: sourceMetadata(markdown),
      markdown,
      html: rendered.html,
      audit: {
        status: "distilled",
        sourceFiles: Number(review.stats?.source_files ?? review.coverage?.length ?? 0),
        omitted: Number(review.stats?.omitted ?? 0),
        risks: Array.isArray(review.risks) ? review.risks.length : 0,
      },
    });
  }
  return condensedBySlug;
}

function findInlineImageNames(markdown) {
  return new Set([...String(markdown || "").matchAll(/!\[[^\r\n]*?\]\(([^)\r\n]+)\)/g)].map((match) => path.posix.basename(splitHref(match[1]).pathname)));
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
const previousDataset = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8").replace(/^\uFEFF/, "")) : null;
const hasCondensedSource = fs.existsSync(condensedSourceRoot);
if (exerciseCatalog.schemaVersion !== "luna-exercise-question-catalog-2") {
  throw new Error(`未知习题目录格式：${exerciseCatalog.schemaVersion || "missing"}`);
}
if (exerciseCatalog.stats?.questions !== 457 || exerciseCatalog.questions?.length !== 457) {
  throw new Error(`习题目录必须包含 457 道编号题，当前为 ${exerciseCatalog.questions?.length ?? 0}`);
}
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
const canonicalPages = rawPages;
const visualManifest = loadTextbookVisualManifest(textbookSourceRoot);
for (const route of visualManifest.byRoute.keys()) {
  if (!canonicalPages.some((page) => page.slug === route)) {
    throw new Error(`${visualManifest.manifestPath}: 可视化 route ${route || "."} 不存在对应教材页`);
  }
}
const pagesByPath = new Map(canonicalPages.map((page) => [page.sourcePath, page]));
const condensedPagesBySlug = hasCondensedSource
  ? loadCondensedPages(condensedSourceRoot, canonicalPages, pagesByPath)
  : new Map((previousDataset?.pages || [])
    .filter((page) => page.condensed && canonicalPages.some((candidate) => candidate.slug === page.slug))
    .map((page) => [page.slug, page.condensed]));
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
  const rendered = renderMarkdown(page.markdown, { sourcePath: page.sourcePath, sourceRoot: textbookSourceRoot, pagesByPath, publicBase: textbookPublicBase });
  return {
    ...page,
    summary: firstSummary(page.markdown, page.title),
    sourceLatex: [...new Set([...rendered.sourceLatex, ...pageVisualizations.flatMap((spec) => spec.sourceLatex || [])])],
    visualizations: pageVisualizations,
    html: rendered.html,
    condensed: condensedPagesBySlug.get(page.slug),
  };
}).sort((left, right) => sortPages(left, right, chapterOrder));
if (resolvedVisualIds.size !== visualManifest.ids.size) {
  throw new Error(`${visualManifest.manifestPath}: 有可视化 spec 未被解析到对应教材页`);
}

const chapters = exerciseCatalog.units.map((chapter) => ({
  id: chapter.id,
  title: chapter.title,
  bookPages: chapter.bookPages,
  pdfPages: chapter.pdfPages,
  route: pages.find((page) => page.slug === chapter.id)?.route || null,
  questionCount: chapter.questionCount,
  part: chapter.part,
}));

const exerciseKnowledgePoints = new Map(exerciseCatalog.knowledgePoints.map((point) => [point.id, point]));
const questions = exerciseCatalog.questions.map((question) => {
  const questionPath = question.source?.question?.markdown || "index.md";
  const answerPath = question.source?.answer?.markdown || questionPath;
  const promptMarkdown = question.prompt?.markdown || "";
  const answerOriginal = question.answer?.original || "";
  const prompt = renderMarkdown(promptMarkdown, { sourcePath: questionPath, sourceRoot: exerciseSourceRoot, pagesByPath: new Map(), publicBase: exercisePublicBase });
  const answer = renderMarkdown(answerOriginal, { sourcePath: answerPath, sourceRoot: exerciseSourceRoot, pagesByPath: new Map(), publicBase: exercisePublicBase });
  const inlineNames = new Set([...findInlineImageNames(promptMarkdown), ...findInlineImageNames(answerOriginal)]);
  return {
    id: question.id,
    number: question.number,
    type: question.type,
    chapterId: question.unitId,
    section: question.section,
    difficulty: question.difficulty,
    recommended: question.recommended,
    prompt: { markdown: promptMarkdown, html: prompt.html, plain: cleanText(promptMarkdown) },
    options: (question.options || []).map((option) => ({
      label: option.label,
      markdown: option.markdown || "",
      html: renderMarkdown(option.markdown || "", { sourcePath: questionPath, sourceRoot: exerciseSourceRoot, pagesByPath: new Map(), publicBase: exercisePublicBase }).html,
    })),
    answer: {
      status: question.answer?.status || "missing",
      origin: question.answer?.origin || "missing",
      original: answerOriginal,
      html: answer.html,
    },
    tags: [...(question.tags || [])],
    quality: { ...question.quality },
    knowledgePoints: (question.knowledgeIds || []).map((id, index) => {
      const point = exerciseKnowledgePoints.get(id);
      if (!point) throw new Error(`${question.id}: 未知知识点 ${id}`);
      return {
        id,
        title: point.title,
        href: `/knowledge/${id.replace(":", "/")}`,
        relation: index === 0 ? "primary" : "related",
        confidence: "confirmed",
      };
    }),
    images: (question.images || []).map((image) => ({
      ...image,
      src: exerciseImageHref(image.path),
      inline: inlineNames.has(path.posix.basename(image.path)),
    })),
    source: question.source || {},
    review: question.review || { status: "pending", flags: [] },
    isExercise: true,
  };
});

const managedTextbookRoot = path.resolve(projectRoot, "public", "textbooks");
const resolvedTextbookPublicRoot = path.resolve(textbookPublicRoot);
if (!resolvedTextbookPublicRoot.startsWith(`${managedTextbookRoot}${path.sep}`)) {
  throw new Error(`拒绝清理托管教材目录之外的路径：${resolvedTextbookPublicRoot}`);
}
if (fs.existsSync(resolvedTextbookPublicRoot)) {
  for (const entry of fs.readdirSync(resolvedTextbookPublicRoot, { withFileTypes: true })) {
    if (!hasCondensedSource && entry.isDirectory() && entry.name === "condensed") continue;
    fs.rmSync(path.join(resolvedTextbookPublicRoot, entry.name), { recursive: true, force: true });
  }
}
fs.mkdirSync(resolvedTextbookPublicRoot, { recursive: true });

const knowledgeImageCount = copyMedia(textbookSourceRoot, textbookPublicRoot);
const condensedImageCount = hasCondensedSource ? copyMedia(condensedSourceRoot, condensedPublicRoot) : countMediaFiles(condensedPublicRoot);
const exerciseImageCount = copyExerciseMedia(questions);
const answersByStatus = Object.fromEntries(["provided", "missing", "hint-only"].map((status) => [status, questions.filter((question) => question.answer.status === status).length]));
const openReviewFlags = questions.flatMap((question) => question.review.flags).filter((flag) => flag.status === "open").length;
const dataset = {
  version: 2,
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
    condensedPages: condensedPagesBySlug.size,
    condensedImages: condensedImageCount,
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
const textbookKnowledgeLinks = {
  schemaVersion: "textbook-knowledge-links-v1",
  books: {
    "data-structures": {
      bookId: dataset.book.id,
      knowledge: Object.fromEntries(dataset.knowledgePoints.map((point) => [point.id, {
        title: point.title,
        questionIds: [...point.questionIds],
      }])),
    },
  },
};
fs.writeFileSync(knowledgeLinksOutputPath, `${JSON.stringify(textbookKnowledgeLinks, null, 2)}\n`);
console.log(`已导入 ${pages.length} 篇教材页（其中 ${condensedPagesBySlug.size} 篇含精简版）、${questions.length} 道习题和 ${knowledgeImageCount + condensedImageCount + exerciseImageCount} 张图资产。`);
