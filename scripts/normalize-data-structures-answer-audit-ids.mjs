import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const datasetPath = path.join(projectRoot, "app", "data", "textbook-data-structures.json");
const auditRoot = path.join(projectRoot, "app", "data", "textbook-answer-audits");
const reviewRoot = path.join(auditRoot, "reviews");
const apply = process.argv.includes("--apply");

const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
const canonicalIds = new Set(dataset.questions.map((question) => question.id));
const aliases = new Map();

function register(alias, canonical) {
  const previous = aliases.get(alias);
  if (previous && previous !== canonical) throw new Error(`旧题号 ${alias} 同时指向 ${previous} 与 ${canonical}`);
  aliases.set(alias, canonical);
}

for (const question of dataset.questions) {
  register(question.id, question.id);
  const match = /^(\d+)\.(\d+)$/.exec(question.number);
  if (!match) continue;
  const [, major, minor] = match;

  if (question.chapterId === "01-introduction") {
    register(`book-ds-yan-01-${minor.length === 1 ? "01" : "1"}-${minor}`, question.id);
  } else if (/^(?:0[2-6]|0[89]|10|11)-/.test(question.chapterId)) {
    register(`book-ds-yan-${major.padStart(2, "0")}-${minor.padStart(2, "0")}`, question.id);
  } else if (question.chapterId === "07-graph") {
    register(`ds-yan-weimin-exercises-07-graph-${major}-${minor}`, question.id);
  } else if (question.chapterId === "12-file") {
    register(`book-ds-yan-12-${minor}`, question.id);
  } else if (question.chapterId === "practice-1") {
    register(`practice-1-${minor}`, question.id);
  } else if (question.chapterId === "practice-2") {
    register(`book-ds-yan-practice-2-${major}-${minor}`, question.id);
  } else if (question.chapterId === "practice-3") {
    register(`book-ds-yan-practice-3-${question.number}`, question.id);
  } else if (question.chapterId === "practice-4" || question.chapterId === "practice-5") {
    register(`ds-yan-${question.chapterId}-${minor}`, question.id);
  } else if (question.chapterId === "practice-6") {
    register(`book-ds-yan-practice-6-${question.number}`, question.id);
  }
}

// “实习报告示例”不是一道题；题库只保留 6.6 本身。
const excludedIds = new Set(["book-ds-yan-practice-6-report-6.6"]);
let replacements = 0;
let exclusions = 0;

function normalizeId(id, fileName) {
  if (excludedIds.has(id)) {
    exclusions += 1;
    return null;
  }
  const canonical = aliases.get(id);
  if (!canonical) throw new Error(`${fileName} 含无法映射的题号 ${id}`);
  if (canonical !== id) replacements += 1;
  return canonical;
}

function assertUnique(ids, label) {
  if (new Set(ids).size !== ids.length) throw new Error(`${label} 统一题号后出现重复项`);
}

const changes = [];
for (const fileName of fs.readdirSync(auditRoot).filter((name) => name.endsWith(".json")).sort()) {
  const file = path.join(auditRoot, fileName);
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const key of ["updates", "unresolved"]) {
    document[key] = (document[key] || []).flatMap((entry) => {
      const id = normalizeId(entry.id, fileName);
      return id ? [{ ...entry, id }] : [];
    });
    assertUnique(document[key].map((entry) => entry.id), `${fileName}.${key}`);
  }
  const rendered = `${JSON.stringify(document, null, 2)}\n`;
  if (rendered !== fs.readFileSync(file, "utf8")) changes.push({ file, rendered });
}

for (const fileName of fs.readdirSync(reviewRoot).filter((name) => name.endsWith(".json")).sort()) {
  const file = path.join(reviewRoot, fileName);
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const key of ["reviewedIds", "passedIds"]) {
    document[key] = (document[key] || []).flatMap((id) => {
      const canonical = normalizeId(id, fileName);
      return canonical ? [canonical] : [];
    });
    assertUnique(document[key], `${fileName}.${key}`);
  }
  document.findings = (document.findings || []).flatMap((finding) => {
    const id = normalizeId(finding.id, fileName);
    return id ? [{ ...finding, id }] : [];
  });
  assertUnique(document.findings.map((finding) => finding.id), `${fileName}.findings`);
  const rendered = `${JSON.stringify(document, null, 2)}\n`;
  if (rendered !== fs.readFileSync(file, "utf8")) changes.push({ file, rendered });
}

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  canonicalQuestions: canonicalIds.size,
  filesToRewrite: changes.length,
  idsToReplace: replacements,
  nonQuestionReferencesToRemove: exclusions,
}, null, 2));

if (!apply) process.exit(0);
for (const { file, rendered } of changes) fs.writeFileSync(file, rendered);
console.log(`已统一 ${replacements} 处题号，移除 ${exclusions} 处非题目报告引用，更新 ${changes.length} 个文件。`);
