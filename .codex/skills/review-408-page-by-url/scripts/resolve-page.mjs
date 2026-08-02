#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const subjectDirectories = {
  ds: "data_structure",
  co: "constitution_principle",
  os: "operating_system",
  cn: "computer_network",
};

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = { json: false, input: "", project: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--json") options.json = true;
    else if (token === "--project") options.project = argv[++index] || "";
    else if (!options.input) options.input = token;
    else fail(`无法识别参数：${token}`);
  }
  return options;
}

function exists(target) {
  return fs.existsSync(target);
}

function safeSlug(parts) {
  const decoded = parts.map((part) => decodeURIComponent(part)).filter(Boolean);
  if (decoded.some((part) => part === "." || part === ".." || part.includes("\\") || part.includes("/"))) {
    fail("slug 含不安全路径片段");
  }
  return decoded.join("/");
}

function loadVisualizations(manifestPath, slug) {
  if (!exists(manifestPath)) return [];
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    fail(`可视化清单无法解析：${error.message}`);
  }
  return (Array.isArray(manifest.visualizations) ? manifest.visualizations : [])
    .filter((spec) => spec?.route === slug)
    .map((spec) => ({ id: spec.id, type: spec.type, title: spec.title }));
}

const options = parseArgs(process.argv.slice(2));
if (!options.input) fail("用法：resolve-page.mjs '<网页链接>' [--project <kaoyan-quiz>] [--json]");
const rawPath = options.input.split(/[?#]/)[0];
if (/(?:^|\/)(?:(?:\.|%2e){1,2})(?:\/|$)/i.test(rawPath)) fail("链接含不安全的点路径片段");

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(options.project || path.join(scriptDirectory, "../../../.."));
if (!exists(path.join(projectRoot, "scripts/import-408-knowledge.mjs"))) {
  fail(`未找到 kaoyan-quiz 项目：${projectRoot}`);
}

let url;
try {
  url = new URL(options.input, "http://localhost:3001");
} catch (error) {
  fail(`链接无法解析：${error.message}`);
}

const pathnameParts = url.pathname.split("/").filter(Boolean);
let routeKind = "";
let subject = "";
let slug = "";

if (pathnameParts[0] === "knowledge") {
  routeKind = "knowledge";
  subject = pathnameParts[1] || "";
  slug = safeSlug(pathnameParts.slice(2));
} else if (pathnameParts[0] === "subject") {
  routeKind = "subject-questions";
  subject = pathnameParts[1] || "";
  const knowledge = url.searchParams.get("knowledge") || "";
  slug = safeSlug(knowledge.split("/").filter(Boolean));
} else {
  fail("仅支持 /knowledge/<subject>/... 或 /subject/<subject>?knowledge=... 链接");
}

const sourceDirectory = subjectDirectories[subject];
if (!sourceDirectory) fail(`不支持的科目：${subject || "(空)"}`);

const workspaceRoot = path.resolve(projectRoot, "..");
const subjectRoot = path.join(workspaceRoot, "local/kaoyanzahuopu", sourceDirectory);
const pageDirectory = slug ? path.join(subjectRoot, ...slug.split("/")) : subjectRoot;
const sourceMarkdown = path.join(pageDirectory, "index.md");
const assetsDirectory = path.join(pageDirectory, "assets");
const visualizationManifest = path.join(subjectRoot, "_visualizations.json");
const canonicalPath = `/knowledge/${subject}${slug ? `/${slug}` : ""}`;

const result = {
  input: options.input,
  routeKind,
  canonicalUrl: `${url.origin}${canonicalPath}`,
  subject: { id: subject, sourceDirectory },
  slug,
  source: {
    markdown: { path: sourceMarkdown, exists: exists(sourceMarkdown) },
    pageDirectory: { path: pageDirectory, exists: exists(pageDirectory) },
    assets: { path: assetsDirectory, exists: exists(assetsDirectory) },
    visualizationManifest: {
      path: visualizationManifest,
      exists: exists(visualizationManifest),
      matchingSpecs: loadVisualizations(visualizationManifest, slug),
    },
  },
  generatedReadOnly: {
    knowledge: path.join(projectRoot, "app/data/knowledge.json"),
    index: path.join(projectRoot, "app/data/knowledge-index.json"),
    publicAssets: path.join(projectRoot, "public/knowledge"),
  },
  evidence: {
    outline: path.join(workspaceRoot, "11408/materials/2025-408考研大纲.md"),
    tagKnowledgeMap: path.join(workspaceRoot, "11408/references/tag_knowledge_map.json"),
    questions: path.join(projectRoot, "app/data/questions.json"),
  },
  implementation: {
    importer: path.join(projectRoot, "scripts/import-408-knowledge.mjs"),
    workspace: path.join(projectRoot, "app/components/KnowledgeWorkspace.tsx"),
    visualRenderer: path.join(projectRoot, "app/components/knowledge-visuals/KnowledgeVisual.tsx"),
    styles: path.join(projectRoot, "app/globals.css"),
  },
};

if (options.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`页面：${result.canonicalUrl}`);
  console.log(`科目：${subject} → ${sourceDirectory}`);
  console.log(`slug：${slug || "(科目根页)"}`);
  console.log(`Markdown：${sourceMarkdown}${result.source.markdown.exists ? "" : "  [不存在]"}`);
  console.log(`资源：${assetsDirectory}${result.source.assets.exists ? "" : "  [尚无 assets]"}`);
  console.log(`可视化清单：${visualizationManifest}${result.source.visualizationManifest.exists ? "" : "  [尚无清单]"}`);
  const specs = result.source.visualizationManifest.matchingSpecs;
  console.log(`匹配交互：${specs.length ? specs.map((spec) => `${spec.id} (${spec.type})`).join("、") : "无"}`);
  console.log(`真题映射：${result.evidence.tagKnowledgeMap}`);
  console.log(`导入器：${result.implementation.importer}`);
  if (!result.source.markdown.exists) process.exitCode = 2;
}
