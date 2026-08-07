import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const datasetPath = path.join(projectRoot, "app", "data", "textbook-data-structures.json");
const auditDirectory = path.join(projectRoot, "app", "data", "textbook-answer-audits");
const reviewDirectory = path.join(auditDirectory, "reviews");

function fail(message) {
  throw new Error(`教材答案审计校验失败：${message}`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${path.relative(projectRoot, filePath)} 不是可读取的 JSON（${error.message}）`);
  }
}

const dataset = readJson(datasetPath);
const questionById = new Map(dataset.questions.map((question) => [question.id, question]));
const auditFiles = fs.existsSync(auditDirectory)
  ? fs.readdirSync(auditDirectory).filter((name) => name.endsWith(".json")).sort()
  : [];
const peerReviewFiles = fs.existsSync(reviewDirectory)
  ? fs.readdirSync(reviewDirectory).filter((name) => name.endsWith(".json")).sort()
  : [];
const seenUpdates = new Map();
const seenUnresolved = new Map();
const seenVerifiedAnswers = new Map();
const auditsByFile = new Map();
const coverageByChapter = new Map(dataset.chapters.map((chapter) => [chapter.id, {
  chapter: chapter.title,
  originalProvided: 0,
  originalHintOnly: 0,
  originalMissing: 0,
  originalPendingReview: 0,
  independentlyVerified: 0,
  unresolved: 0,
}]));
const minimumAnswerLength = {
  algorithm: 160,
  programming: 160,
  practical: 150,
  calculation: 100,
  discussion: 100,
  "short-answer": 70,
  choice: 30,
  "true-false": 30,
  "fill-blank": 30,
};

for (const question of dataset.questions) {
  const row = coverageByChapter.get(question.chapterId);
  if (!row) continue;
  if (question.answer.status === "provided") row.originalProvided += 1;
  if (question.answer.status === "hint-only") row.originalHintOnly += 1;
  if (question.answer.status === "missing") row.originalMissing += 1;
  if (question.answer.status === "pending-review") row.originalPendingReview += 1;
}

for (const fileName of auditFiles) {
  const audit = readJson(path.join(auditDirectory, fileName));
  if (audit.schemaVersion !== "textbook-answer-audit-v1") fail(`${fileName} 的 schemaVersion 无效`);
  if (audit.bookId !== dataset.book.id) fail(`${fileName} 的 bookId 与基线不一致`);
  if (!Array.isArray(audit.scope) || !audit.scope.length) fail(`${fileName} 未声明 scope`);
  if (!Array.isArray(audit.updates)) fail(`${fileName} 的 updates 不是数组`);
  auditsByFile.set(fileName, audit);

  for (const update of audit.updates) {
    const question = questionById.get(update.id);
    if (!question) fail(`${fileName} 引用了不存在的题目 ${update.id}`);
    if (!audit.scope.includes(question.chapterId)) fail(`${fileName} 的 ${update.id} 超出 scope`);
    if (seenUpdates.has(update.id)) fail(`${update.id} 同时出现在 ${seenUpdates.get(update.id)} 和 ${fileName}`);
    const verified = update.answer?.correction?.verified || update.answer?.verified;
    if (!update.answer || update.answer.origin !== "verified" || !String(verified || "").trim()) {
      fail(`${fileName} 的 ${update.id} 未提供独立核验答案`);
    }
    const characterCount = [...String(verified).trim()].length;
    const requiredLength = Math.max(
      minimumAnswerLength[question.type] || 80,
      question.prompt?.markdown?.includes("![") ? 220 : 0,
    );
    if (characterCount < requiredLength) fail(`${fileName} 的 ${update.id} 只有 ${characterCount} 字符，未达到 ${question.type} 完整解答最低要求 ${requiredLength}`);
    const normalizedVerified = String(verified).replace(/\s+/g, " ").trim();
    const normalizedOriginal = String(question.answer?.original || "").replace(/\s+/g, " ").trim();
    if (normalizedOriginal && normalizedVerified === normalizedOriginal) fail(`${fileName} 的 ${update.id} 只是复制原书答案或提示，没有完成独立重写`);
    if (seenVerifiedAnswers.has(normalizedVerified)) fail(`${fileName} 的 ${update.id} 与 ${seenVerifiedAnswers.get(normalizedVerified)} 使用了完全相同的核验答案`);
    seenVerifiedAnswers.set(normalizedVerified, update.id);
    if (/\?{3,}|\uFFFD/.test(String(verified))) fail(`${fileName} 的 ${update.id} 含乱码或占位符，不能作为可发布答案`);
    if (update.answer?.correction && !String(update.answer.correction.reason || "").trim()) fail(`${fileName} 的 ${update.id} 核验修正未说明原因`);
    if (update.answer.status !== "provided") fail(`${fileName} 的 ${update.id} 应将补充结果标记为 provided`);
    seenUpdates.set(update.id, fileName);
    coverageByChapter.get(question.chapterId).independentlyVerified += 1;
  }

  for (const unresolved of audit.unresolved || []) {
    const question = questionById.get(unresolved.id);
    if (!question) fail(`${fileName} 的未决项引用了不存在的题目 ${unresolved.id}`);
    if (!audit.scope.includes(question.chapterId)) fail(`${fileName} 的未决项 ${unresolved.id} 超出 scope`);
    if (seenUnresolved.has(unresolved.id)) fail(`${unresolved.id} 同时出现在 ${seenUnresolved.get(unresolved.id)} 和 ${fileName}`);
    if (!String(unresolved.reason || "").trim()) fail(`${fileName} 的 ${unresolved.id} 未说明未决原因`);
    seenUnresolved.set(unresolved.id, fileName);
    coverageByChapter.get(question.chapterId).unresolved += 1;
  }
}

let peerFindings = 0;
const peerReviewedAuditFiles = new Set();
for (const fileName of peerReviewFiles) {
  const review = readJson(path.join(reviewDirectory, fileName));
  const audit = auditsByFile.get(review.reviewedFile);
  if (!audit) fail(`${fileName} 指向了不存在的答案审计文件 ${review.reviewedFile}`);
  if (!Array.isArray(review.reviewedIds) || !Array.isArray(review.passedIds) || !Array.isArray(review.findings)) {
    fail(`${fileName} 缺少 reviewedIds、passedIds 或 findings 数组`);
  }
  const expectedIds = new Set(audit.updates.map((update) => update.id));
  const updateById = new Map(audit.updates.map((update) => [update.id, update]));
  const reviewedIds = new Set(review.reviewedIds);
  if (reviewedIds.size !== review.reviewedIds.length || [...expectedIds].some((id) => !reviewedIds.has(id)) || [...reviewedIds].some((id) => !expectedIds.has(id))) {
    fail(`${fileName} 的审计题目范围与 ${review.reviewedFile} 不一致`);
  }
  const outcomeIds = new Set([...review.passedIds, ...review.findings.map((finding) => finding.id)]);
  if (outcomeIds.size !== review.passedIds.length + review.findings.length || [...reviewedIds].some((id) => !outcomeIds.has(id))) {
    fail(`${fileName} 的每道题必须恰有一个通过或问题结论`);
  }
  for (const finding of review.findings) {
    if (!reviewedIds.has(finding.id)) fail(`${fileName} 的问题引用了未审计题目 ${finding.id}`);
    if (!["error", "warning"].includes(finding.severity) || !String(finding.issue || "").trim() || !String(finding.recommendedFix || "").trim()) {
      fail(`${fileName} 的 ${finding.id} 问题信息不完整`);
    }
    if (finding.severity === "error" && !updateById.get(finding.id)?.answer?.correction) {
      fail(`${fileName} 的错误项 ${finding.id} 尚未写入可追溯的 correction`);
    }
  }
  peerFindings += review.findings.length;
  peerReviewedAuditFiles.add(review.reviewedFile);
}

const remainingIndependentAnswers = dataset.questions.filter((question) => question.isExercise && !seenUpdates.has(question.id));
const unreviewedAuditFiles = auditFiles.filter((fileName) => !peerReviewedAuditFiles.has(fileName));

if (process.argv.includes("--require-complete") && remainingIndependentAnswers.length) {
  fail(`仍有 ${remainingIndependentAnswers.length} 道题没有独立完整解答：${remainingIndependentAnswers.slice(0, 12).map((question) => question.id).join("、")}`);
}
if (process.argv.includes("--require-complete") && unreviewedAuditFiles.length) {
  fail(`仍有答案批次未完成交叉复核：${unreviewedAuditFiles.join("、")}`);
}

const rows = [...coverageByChapter.entries()].map(([id, row]) => ({ id, ...row }));
const summary = {
  dataset: path.relative(projectRoot, datasetPath),
  auditFiles,
  peerReviewFiles,
  totals: {
    originalProvided: rows.reduce((sum, row) => sum + row.originalProvided, 0),
    originalHintOnly: rows.reduce((sum, row) => sum + row.originalHintOnly, 0),
    originalMissing: rows.reduce((sum, row) => sum + row.originalMissing, 0),
    originalPendingReview: rows.reduce((sum, row) => sum + row.originalPendingReview, 0),
    independentlyVerified: seenUpdates.size,
    unresolved: seenUnresolved.size,
    peerFindings,
    remainingIndependentAnswers: remainingIndependentAnswers.length,
    unreviewedAuditFiles: unreviewedAuditFiles.length,
  },
  chapters: rows,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`已检查 ${auditFiles.length} 份答案审计覆盖文件和 ${peerReviewFiles.length} 份交叉复核；独立完整解答 ${seenUpdates.size} 道，未决 ${seenUnresolved.size} 道，复核发现 ${peerFindings} 项，仍缺独立解答 ${remainingIndependentAnswers.length} 道，未复核批次 ${unreviewedAuditFiles.length} 份。`);
  for (const row of rows) {
    if (!row.originalMissing && !row.originalPendingReview && !row.independentlyVerified && !row.unresolved) continue;
    console.log(`${row.id}: 原书缺答 ${row.originalMissing}，待复核 ${row.originalPendingReview}，核验补充 ${row.independentlyVerified}，未决 ${row.unresolved}`);
  }
}
