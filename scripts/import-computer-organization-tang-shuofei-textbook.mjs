import fs from "node:fs";
import path from "node:path";
import { marked, Renderer } from "marked";
import katex from "katex";

const projectRoot = path.resolve(import.meta.dirname, "..");
const bookRoot = path.join(projectRoot, "source-materials", "computer-organization-tang-shuofei-3e");
const sectionsRoot = path.join(bookRoot, "work", "sections");
const manifestPath = path.join(bookRoot, "manifest.json");
const auditPath = path.join(bookRoot, "work", "OCR_MERGE_AUDIT.json");
const outputPath = path.join(projectRoot, "app", "data", "textbook-computer-organization-tang-shuofei.json");
const publicRoot = path.join(projectRoot, "public", "textbooks", "computer-organization-tang-shuofei");
const publicBase = "/textbooks/computer-organization-tang-shuofei";
const bookSlug = "computer-organization-tang-shuofei";
const textbookPageBreakMarker = "<!-- textbook-page-break -->";
const textbookPageBreakExactPattern = /^<!--\s*textbook-page-break\s*-->$/;
const mediaExtension = /\.(?:svg|png|jpe?g|gif|webp)$/i;
const skippedDirectories = new Set(["assets", "reviews", "tmp", "work", "review"]);

function asPosix(value) {
  return value.split(path.sep).join("/");
}

function walkSectionPages(root) {
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name, "en"))) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (skippedDirectories.has(entry.name) || entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
        walk(target);
      } else if (entry.isFile() && entry.name === "index.md") {
        files.push(target);
      }
    }
  };
  walk(root);
  return files;
}

function extractAttributes(value) {
  return Object.fromEntries([...value.matchAll(/([a-z_]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3] ?? ""]));
}

function sourceMetadata(markdown) {
  const comments = [...markdown.matchAll(/<!--\s*luna:([a-z-]+)\s+([\s\S]*?)-->/g)];
  const sourceComments = comments.filter((comment) => comment[1] === "source");
  const pageComments = comments.filter((comment) => comment[1] === "page");
  return {
    attributes: sourceComments.length ? extractAttributes(sourceComments[0][2]) : {},
    pageMarkers: [...sourceComments.slice(1), ...pageComments].map((comment) => extractAttributes(comment[2])),
  };
}

function cleanForRender(markdown) {
  return markdown
    .replace(/<!--\s*luna:(?:source|page)\b[\s\S]*?-->/g, `\n${textbookPageBreakMarker}\n`)
    .replace(/<!--\s*(?:luna|merge):[\s\S]*?-->/g, "");
}

function cleanText(value) {
  return String(value || "")
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#|]/g, " ")
    .replace(/\$+([^$]+)\$+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSummary(markdown, fallback) {
  const paragraphs = cleanForRender(markdown).split(/\n\s*\n/).map(cleanText).filter(Boolean);
  return paragraphs.find((paragraph) => paragraph !== fallback && paragraph.length >= 14)?.slice(0, 180) || fallback;
}

function slugFor(relativePath) {
  return relativePath === "index.md" ? "" : relativePath.replace(/\/index\.md$/, "");
}

function parentSlugFor(slug) {
  if (!slug) return null;
  const parts = slug.split("/");
  return parts.length > 1 ? parts.slice(0, -1).join("/") : null;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceOrderForSegment(segment, chapterById) {
  if (segment.kind === "front_matter") return 0;
  if (segment.kind === "chapter") return Number(chapterById.get(segment.id)?.number) || 50;
  if (segment.kind === "appendix") return 100 + segment.order;
  if (segment.kind === "references") return 200 + segment.order;
  return 300 + segment.order;
}

function sectionSlug(section, index) {
  const number = String(section.number || "").replaceAll(".", "-");
  return `${String(index + 1).padStart(2, "0")}-${number || "section"}`;
}

function normalizeNestedSectionHeadings(markdown) {
  return markdown.replace(/^(#{2,4})\s+(\d+(?:\.\d+){2,})(\s+.+)$/gm, (_match, hashes, number, suffix) => {
    const level = Math.min(4, Math.max(hashes.length, number.split(".").length));
    return `${"#".repeat(level)} ${number}${suffix}`;
  });
}

function splitChapterSections(markdown, chapterDefinition) {
  const sourceSections = Array.isArray(chapterDefinition?.sections) ? chapterDefinition.sections : [];
  const boundaries = sourceSections.map((section) => {
    const matcher = new RegExp(`^#{2,4}\\s+${escapeRegExp(section.number)}(?:\\s|$)`, "gm");
    const match = matcher.exec(markdown);
    if (!match || match.index === undefined) {
      throw new Error(`${chapterDefinition.id}: formal section ${section.number} is missing from the merged Markdown.`);
    }
    return { section, start: match.index };
  });
  const exerciseMatcher = /^#{2,4}\s+思考题与习题\s*$/gm;
  let exerciseStart = -1;
  for (const match of markdown.matchAll(exerciseMatcher)) {
    if (match.index !== undefined && match.index > (boundaries.at(-1)?.start ?? -1)) exerciseStart = match.index;
  }

  const sections = boundaries.map(({ section, start }, index) => {
    const end = boundaries[index + 1]?.start ?? (exerciseStart >= 0 ? exerciseStart : markdown.length);
    const normalized = normalizeNestedSectionHeadings(markdown.slice(start, end));
    const title = normalized.match(/^#{2,4}\s+(.+)$/m)?.[1]?.trim() || `${section.number} ${section.title}`;
    const content = normalized.replace(/^#{2,4}\s+.+$/m, `# ${title}`);
    return { id: sectionSlug(section, index), title, markdown: content };
  });
  if (exerciseStart >= 0) {
    const content = markdown.slice(exerciseStart).replace(/^#{2,4}\s+思考题与习题\s*$/m, "# 思考题与习题");
    sections.push({ id: "99-exercises", title: "思考题与习题", markdown: content });
  }
  return sections;
}

function chapterLandingMarkdown(markdown, chapterDefinition, sectionPages, chapterSlug) {
  const firstSection = Array.isArray(chapterDefinition?.sections) ? chapterDefinition.sections[0] : null;
  if (!firstSection) throw new Error(`${chapterDefinition?.id || chapterSlug}: chapter has no formal sections.`);
  const matcher = new RegExp(`^#{2,4}\\s+${escapeRegExp(firstSection.number)}(?:\\s|$)`, "m");
  const match = matcher.exec(markdown);
  if (!match || match.index === undefined) {
    throw new Error(`${chapterDefinition.id}: first formal section ${firstSection.number} is missing from the merged Markdown.`);
  }
  const preamble = markdown.slice(0, match.index).trimEnd();
  const toc = sectionPages
    .map((section) => `- [${section.title}](${routeFor(`${chapterSlug}/${section.id}`)})`)
    .join("\n");
  return `${preamble}\n\n## 本章目录\n\n${toc}\n`;
}

function routeFor(slug) {
  return slug ? `/textbook/${bookSlug}/${slug}` : `/textbook/${bookSlug}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(value) {
  return String(value || "").trim().replace(/[\u0000-\u001f\u007f]/g, "");
}

function splitHref(value) {
  const marker = value.search(/[?#]/);
  return marker < 0 ? { pathname: value, suffix: "" } : { pathname: value.slice(0, marker), suffix: value.slice(marker) };
}

function localAssetHref(href, sourcePath) {
  const value = safeHref(href);
  if (!value || /^(?:javascript:|data:)/i.test(value)) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  const { pathname, suffix } = splitHref(value);
  const directory = path.posix.dirname(sourcePath);
  const relative = path.posix.normalize(path.posix.join(directory === "." ? "" : directory, pathname));
  if (!relative || relative.startsWith("../")) return "";
  return `${publicBase}/${relative}${suffix}`;
}

function localPageHref(href, sourcePath, pagesByPath) {
  const value = safeHref(href);
  if (!value || /^(?:javascript:|data:)/i.test(value)) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("mailto:") || value.startsWith("/")) return value;
  if (value.startsWith("#")) return value;
  const { pathname, suffix } = splitHref(value);
  const directory = path.posix.dirname(sourcePath);
  let candidate = path.posix.normalize(path.posix.join(directory === "." ? "" : directory, pathname));
  if (candidate.startsWith("../")) return "";
  if (pagesByPath.has(candidate)) return `${pagesByPath.get(candidate).route}${suffix}`;
  if (!path.posix.extname(candidate)) candidate = path.posix.join(candidate, "index.md");
  return pagesByPath.has(candidate) ? `${pagesByPath.get(candidate).route}${suffix}` : "";
}

function prepareMath(markdown) {
  const formulas = new Set();
  const replacements = [];
  const token = (latex, displayMode) => {
    const source = String(latex || "").trim();
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

function renderMarkdown(markdown, { sourcePath, pagesByPath }) {
  const prepared = prepareMath(cleanForRender(markdown));
  const plainMath = (value) => prepared.replacements.reduce(
    (current, replacement) => current.replaceAll(replacement.marker, replacement.source),
    String(value || ""),
  );
  const renderer = new Renderer();
  renderer.html = ({ text }) => textbookPageBreakExactPattern.test(text.trim()) ? text.trim() : "";
  renderer.link = function link({ href, title, tokens }) {
    const safe = localPageHref(href, sourcePath, pagesByPath);
    const label = this.parser.parseInline(tokens);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe) || /^mailto:/i.test(safe);
    return `<a href="${escapeHtml(safe)}"${title ? ` title="${escapeHtml(plainMath(title))}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    const safe = localAssetHref(href, sourcePath);
    const alt = escapeHtml(plainMath(text || "教材插图"));
    if (!safe) return `<span class="textbook-missing-image">[图片：${alt}]</span>`;
    return `<img src="${escapeHtml(safe)}" alt="${alt}"${title ? ` title="${escapeHtml(plainMath(title))}"` : ""} loading="lazy" decoding="async">`;
  };
  const parsed = marked.parse(prepared.markdown, { gfm: true, breaks: false, renderer });
  return {
    html: prepared.replacements.reduce((current, replacement) => current.replaceAll(replacement.marker, replacement.html), String(parsed)),
    sourceLatex: prepared.formulas,
  };
}

function copyMediaFile(source, output) {
  if (path.extname(source).toLowerCase() === ".svg") {
    fs.writeFileSync(output, fs.readFileSync(source, "utf8").replace(/\r\n/g, "\n").replace(/[ \t]+(?=\n)/g, ""));
    return;
  }
  fs.copyFileSync(source, output);
}

function copyPageAssets(pageFiles) {
  let count = 0;
  for (const sourceFile of pageFiles) {
    const sourceAssets = path.join(path.dirname(sourceFile), "assets");
    if (!fs.existsSync(sourceAssets)) continue;
    const relativeDirectory = path.relative(sectionsRoot, path.dirname(sourceFile));
    const destination = path.join(publicRoot, relativeDirectory, "assets");
    const walk = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          walk(target);
        } else if (entry.isFile() && mediaExtension.test(entry.name)) {
          const relative = path.relative(sourceAssets, target);
          const output = path.join(destination, relative);
          fs.mkdirSync(path.dirname(output), { recursive: true });
          copyMediaFile(target, output);
          count += 1;
        }
      }
    };
    walk(sourceAssets);
  }
  return count;
}

function validateSourceImageReferences(sourceFile, markdown) {
  for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = splitHref(match[1].trim()).pathname;
    if (!href || /^(?:https?:|data:|javascript:)/i.test(href)) continue;
    const resolved = path.resolve(path.dirname(sourceFile), href);
    const root = path.resolve(sectionsRoot);
    if (!resolved.startsWith(`${root}${path.sep}`) || !fs.existsSync(resolved)) {
      throw new Error(`${sourceFile}: image reference is missing or escapes the formal source root: ${href}`);
    }
  }
}

if (!fs.existsSync(manifestPath) || !fs.existsSync(auditPath) || !fs.existsSync(sectionsRoot)) {
  throw new Error("Missing the accepted computer-organization OCR source, audit, or formal sections directory.");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
if (manifest.status !== "ocr-accepted-and-merged" || !audit.passed) {
  throw new Error("The computer-organization OCR source must pass formal merge acceptance before frontend import.");
}

const contentSegments = manifest.segmentation.segments.filter((segment) => segment.kind !== "blank");
const segmentById = new Map(contentSegments.map((segment) => [segment.id, segment]));
const sourceChapters = Array.isArray(manifest.chapters) ? manifest.chapters : [];
const chapterById = new Map(sourceChapters.map((chapter) => [chapter.id, chapter]));
const frontendSegments = contentSegments.filter((segment) => segment.kind !== "part_opener");

const sourceFiles = walkSectionPages(sectionsRoot);
const rootPage = sourceFiles.find((sourceFile) => path.relative(sectionsRoot, sourceFile) === "index.md");
if (!rootPage) throw new Error("Formal sections index.md is missing.");

const sourcePages = sourceFiles.map((sourceFile) => {
  const sourcePath = asPosix(path.relative(sectionsRoot, sourceFile));
  const slug = slugFor(sourcePath);
  if (slug && !segmentById.has(slug)) return null;
  const markdown = fs.readFileSync(sourceFile, "utf8");
  validateSourceImageReferences(sourceFile, markdown);
  const segment = slug ? segmentById.get(slug) : null;
  if (segment?.kind === "part_opener") return null;
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || segment?.title || manifest.title;
  return {
    id: `textbook-co-tang-shuofei:${slug || "root"}`,
    slug,
    route: routeFor(slug),
    sourcePath,
    renderSourcePath: sourcePath,
    chapterId: slug || null,
    title: segment?.kind === "front_matter" ? "封面、版权与目录" : title,
    summary: "",
    depth: slug ? slug.split("/").length : 0,
    parentSlug: parentSlugFor(slug),
    headings: [...markdown.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => cleanText(match[1])).filter(Boolean),
    source: sourceMetadata(markdown),
    markdown,
    sourceOrder: segment ? sourceOrderForSegment(segment, chapterById) : -1,
    pageOrder: 0,
  };
}).filter(Boolean);

for (const segment of frontendSegments) {
  if (!sourcePages.some((page) => page.slug === segment.id)) {
    throw new Error(`Formal OCR page is missing for ${segment.id}.`);
  }
}

const rawPages = sourcePages.flatMap((page) => {
  const segment = page.slug ? segmentById.get(page.slug) : null;
  const chapterDefinition = page.slug ? chapterById.get(page.slug) : null;
  if (segment?.kind !== "chapter" || !chapterDefinition) return [page];
  const sectionPages = splitChapterSections(page.markdown, chapterDefinition);
  const landingMarkdown = chapterLandingMarkdown(page.markdown, chapterDefinition, sectionPages, page.slug);
  const landingPage = {
    ...page,
    headings: ["本章目录"],
    source: sourceMetadata(landingMarkdown),
    markdown: landingMarkdown,
  };
  return [
    landingPage,
    ...sectionPages.map((section, index) => ({
      id: `${page.id}:${section.id}`,
      slug: `${page.slug}/${section.id}`,
      route: routeFor(`${page.slug}/${section.id}`),
      sourcePath: `${page.sourcePath}#${section.id}`,
      renderSourcePath: page.renderSourcePath,
      chapterId: page.slug,
      title: section.title,
      summary: "",
      depth: 2,
      parentSlug: page.slug,
      headings: [...section.markdown.matchAll(/^#{3,4}\s+(.+)$/gm)].map((match) => cleanText(match[1])).filter(Boolean),
      source: sourceMetadata(section.markdown),
      markdown: section.markdown,
      sourceOrder: page.sourceOrder,
      pageOrder: index + 1,
    })),
  ];
});

const pagesByPath = new Map(sourcePages.map((page) => [page.sourcePath, page]));
const pages = rawPages
  .sort((left, right) => {
    if (!left.slug) return -1;
    if (!right.slug) return 1;
    return left.sourceOrder - right.sourceOrder || left.pageOrder - right.pageOrder || left.slug.localeCompare(right.slug);
  })
  .map((rawPage) => {
    const rendered = renderMarkdown(rawPage.markdown, { sourcePath: rawPage.renderSourcePath, pagesByPath });
    const page = { ...rawPage };
    delete page.renderSourcePath;
    delete page.sourceOrder;
    delete page.pageOrder;
    return {
      ...page,
      summary: firstSummary(page.markdown, page.title),
      sourceLatex: rendered.sourceLatex,
      visualizations: [],
      html: rendered.html,
    };
  });

const managedTextbookRoot = path.resolve(projectRoot, "public", "textbooks");
const resolvedPublicRoot = path.resolve(publicRoot);
if (!resolvedPublicRoot.startsWith(`${managedTextbookRoot}${path.sep}`)) {
  throw new Error(`Refusing to replace files outside the managed textbook root: ${resolvedPublicRoot}`);
}
fs.rmSync(resolvedPublicRoot, { recursive: true, force: true });
fs.mkdirSync(resolvedPublicRoot, { recursive: true });
const knowledgeImages = copyPageAssets(sourceFiles);

const chapters = frontendSegments
  .map((segment) => ({
    id: segment.id,
    title: segment.kind === "front_matter" ? "封面、版权与目录" : segment.title,
    bookPages: segment.book_pages || undefined,
    pdfPages: segment.pdf_pages,
    route: pages.find((page) => page.slug === segment.id)?.route || null,
    questionCount: 0,
    order: sourceOrderForSegment(segment, chapterById),
    kind: segment.kind,
  }))
  .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));

const dataset = {
  version: 4,
  generatedAt: new Date().toISOString(),
  book: {
    id: "computer-organization-tang-shuofei-3e",
    title: manifest.title,
    author: Array.isArray(manifest.author) ? manifest.author.join("、") : String(manifest.author || ""),
    sourcePdf: manifest.source_pdf.absolute_path,
  },
  stats: {
    knowledgePages: pages.length,
    knowledgeImages,
    condensedPages: 0,
    condensedImages: 0,
    chapters: chapters.length,
    exerciseRecords: 0,
    exerciseQuestions: 0,
    exerciseImages: 0,
    answersProvided: 0,
    answersMissing: 0,
    answersHintOnly: 0,
    answersVerified: 0,
    openReviewFlags: 0,
  },
  chapters,
  pages,
  questions: [],
  knowledgePoints: [],
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`Imported ${pages.length} computer-organization textbook pages and ${knowledgeImages} original figure assets.`);
