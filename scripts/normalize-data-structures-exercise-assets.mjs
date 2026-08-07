import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const bookRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin-exercises");
const canonicalAssetRoot = path.join(bookRoot, "assets", "py");
const apply = process.argv.includes("--apply");
const mediaPattern = /\.(?:svg|png|jpe?g|gif|webp)$/i;
const ignoredSegments = new Set(["review", "tmp", "work", "__page_review", "__detail-render", "__page-render"]);

function asPosix(value) {
  return value.split(path.sep).join("/");
}

function inside(root, target) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`);
}

function walk(root, predicate) {
  const result = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile() && predicate(target)) result.push(target);
    }
  };
  visit(root);
  return result;
}

function canonicalMarkdownFiles() {
  return walk(bookRoot, (file) => path.basename(file) === "index.md").filter((file) => {
    const relative = path.relative(bookRoot, file);
    const segments = relative.split(path.sep);
    if (segments.some((segment) => ignoredSegments.has(segment))) return false;
    return !(segments[0] === "01-introduction");
  });
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const markdownFiles = canonicalMarkdownFiles();
const references = [];
for (const markdownFile of markdownFiles) {
  const markdown = fs.readFileSync(markdownFile, "utf8");
  for (const match of markdown.matchAll(/!\[([^\r\n]*?)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const href = match[2];
    if (/^(?:https?:|data:|\/)/i.test(href)) throw new Error(`${markdownFile}: 非本地相对图片 ${href}`);
    const source = path.resolve(path.dirname(markdownFile), ...href.replace(/\\/g, "/").split("/"));
    if (!inside(bookRoot, source) || !fs.existsSync(source)) throw new Error(`${markdownFile}: 图片不存在或越界 ${href}`);
    references.push({ markdownFile, href, source, basename: path.basename(source), hash: sha256(source) });
  }
}

const byBasename = new Map();
for (const reference of references) {
  const entries = byBasename.get(reference.basename) || [];
  entries.push(reference);
  byBasename.set(reference.basename, entries);
}
for (const [basename, entries] of byBasename) {
  const hashes = new Set(entries.map((entry) => entry.hash));
  if (hashes.size !== 1) throw new Error(`规范正文存在同名异图，必须先显式重命名：${basename}`);
}

const updates = new Map();
for (const markdownFile of markdownFiles) {
  const original = fs.readFileSync(markdownFile, "utf8");
  const rewritten = original.replace(/!\[([^\r\n]*?)\]\(([^)\s]+)(\s+["'][^"']*["'])?\)/g, (full, alt, href, title = "") => {
    const source = path.resolve(path.dirname(markdownFile), ...href.replace(/\\/g, "/").split("/"));
    const reference = references.find((entry) => entry.markdownFile === markdownFile && entry.source === source);
    if (!reference) return full;
    const destination = path.join(canonicalAssetRoot, reference.basename);
    let relative = asPosix(path.relative(path.dirname(markdownFile), destination));
    if (!relative.startsWith(".")) relative = `./${relative}`;
    return `![${alt}](${relative}${title})`;
  });
  if (rewritten !== original) updates.set(markdownFile, rewritten);
}

const destinationByBasename = new Map([...byBasename].map(([basename, entries]) => [basename, { destination: path.join(canonicalAssetRoot, basename), source: entries[0].source, hash: entries[0].hash }]));
const allMedia = walk(bookRoot, (file) => mediaPattern.test(file));
const keep = new Set([...destinationByBasename.values()].map(({ destination }) => path.resolve(destination)));
const removals = allMedia.filter((file) => !keep.has(path.resolve(file)));

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  canonicalMarkdownFiles: markdownFiles.length,
  imageReferences: references.length,
  canonicalImages: destinationByBasename.size,
  markdownFilesToRewrite: updates.size,
  mediaFilesToRemove: removals.length,
}, null, 2));

if (!apply) process.exit(0);
if (!inside(bookRoot, canonicalAssetRoot)) throw new Error("规范图片目录越出书源目录。 ");
fs.mkdirSync(canonicalAssetRoot, { recursive: true });
for (const { destination, source, hash } of destinationByBasename.values()) {
  if (!inside(bookRoot, destination) || !inside(bookRoot, source)) throw new Error("图片规范化路径越界。 ");
  if (!fs.existsSync(destination) || sha256(destination) !== hash) fs.copyFileSync(source, destination);
}
for (const [file, markdown] of updates) fs.writeFileSync(file, markdown);
for (const file of removals) {
  if (!inside(bookRoot, file) || !mediaPattern.test(file)) throw new Error(`拒绝删除非目标媒体：${file}`);
  fs.rmSync(file);
}

const directories = [];
const collectDirectories = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const target = path.join(directory, entry.name);
    collectDirectories(target);
    directories.push(target);
  }
};
collectDirectories(bookRoot);
for (const directory of directories.sort((left, right) => right.length - left.length)) {
  if (directory === canonicalAssetRoot || !inside(bookRoot, directory)) continue;
  if (fs.existsSync(directory) && fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
}

console.log(`已统一 ${destinationByBasename.size} 张规范图片，更新 ${updates.size} 个 Markdown，移除 ${removals.length} 个未引用媒体文件。`);
