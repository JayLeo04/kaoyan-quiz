import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const bookRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin-exercises");
const questionsRoot = path.join(bookRoot, "questions");
const annotationsPath = path.join(questionsRoot, "annotations.json");
const catalogPath = path.join(questionsRoot, "index.json");
const knowledgeDatasetPath = path.join(projectRoot, "app", "data", "knowledge.json");
const knowledgeIndexPath = path.join(projectRoot, "app", "data", "knowledge-index.json");
const questionReviewDirectory = path.join(projectRoot, "app", "data", "textbook-question-reviews");
const bootstrap = process.argv.includes("--bootstrap-annotations");
const force = process.argv.includes("--force");

const units = [
  { id: "00-overview", number: "0", title: "本篇提要与作业规范", part: "part-1-questions", questionPath: "part-1-questions/00-overview/index.md", pdfPages: [6, 11], questionLevel: 3, expected: 0 },
  { id: "01-introduction", number: "1", title: "第 1 章 绪论（预备知识）", part: "part-1-questions", questionPath: "part-1-questions/01-introduction/index.md", answerPath: "part-3-answers/01-introduction/index.md", pdfPages: [12, 16], questionLevel: 3, expected: 20 },
  { id: "02-linear-list", number: "2", title: "第 2 章 线性表", part: "part-1-questions", questionPath: "part-1-questions/02-linear-list/index.md", answerPath: "part-3-answers/02-linear-list/index.md", pdfPages: [17, 25], questionLevel: 3, expected: 42 },
  { id: "03-stack-and-queue", number: "3", title: "第 3 章 栈和队列", part: "part-1-questions", questionPath: "part-1-questions/03-stack-and-queue/index.md", answerPath: "part-3-answers/03-stack-and-queue/index.md", pdfPages: [26, 31], questionLevel: 3, expected: 34 },
  { id: "04-string", number: "4", title: "第 4 章 串", part: "part-1-questions", questionPath: "part-1-questions/04-string/index.md", answerPath: "part-3-answers/04-string/index.md", pdfPages: [32, 35], questionLevel: 3, expected: 31 },
  { id: "05-array-and-generalized-list", number: "5", title: "第 5 章 数组和广义表", part: "part-1-questions", questionPath: "part-1-questions/05-array-and-generalized-list/index.md", answerPath: "part-3-answers/05-array-and-generalized-list/index.md", pdfPages: [36, 41], questionLevel: 3, expected: 38 },
  { id: "06-tree-and-binary-tree", number: "6", title: "第 6 章 树和二叉树", part: "part-1-questions", questionPath: "part-1-questions/06-tree-and-binary-tree/index.md", answerPath: "part-3-answers/06-tree-and-binary-tree/index.md", pdfPages: [42, 50], questionLevel: 3, expected: 76 },
  { id: "07-graph", number: "7", title: "第 7 章 图", part: "part-1-questions", questionPath: "part-1-questions/07-graph/index.md", answerPath: "part-3-answers/07-graph/index.md", pdfPages: [51, 55], questionLevel: 3, expected: 42 },
  { id: "08-dynamic-storage", number: "8", title: "第 8 章 动态存储管理", part: "part-1-questions", questionPath: "part-1-questions/08-dynamic-storage/index.md", answerPath: "part-3-answers/08-dynamic-storage/index.md", pdfPages: [56, 58], questionLevel: 3, expected: 16 },
  { id: "09-search", number: "9", title: "第 9 章 查找", part: "part-1-questions", questionPath: "part-1-questions/09-search/index.md", answerPath: "part-3-answers/09-search/index.md", pdfPages: [59, 64], questionLevel: 3, expected: 46 },
  { id: "10-internal-sorting", number: "10", title: "第 10 章 内部排序", part: "part-1-questions", questionPath: "part-1-questions/10-internal-sorting/index.md", answerPath: "part-3-answers/10-internal-sorting/index.md", pdfPages: [65, 71], questionLevel: 3, expected: 46 },
  { id: "11-external-sorting", number: "11", title: "第 11 章 外部排序", part: "part-1-questions", questionPath: "part-1-questions/11-external-sorting/index.md", answerPath: "part-3-answers/11-external-sorting/index.md", pdfPages: [72, 74], questionLevel: 3, expected: 13 },
  { id: "12-file", number: "12", title: "第 12 章 文件", part: "part-1-questions", questionPath: "part-1-questions/12-file/index.md", pdfPages: [75, 76], questionLevel: 3, expected: 11 },
  { id: "practice-0-overview", number: "0", title: "实习 0 抽象数据类型", part: "part-2-practice", questionPath: "part-2-practice/practice-0-overview/index.md", pdfPages: [77, 83], questionLevel: 3, expected: 3 },
  { id: "practice-1", number: "1", title: "实习 1 线性表及其应用", part: "part-2-practice", questionPath: "part-2-practice/practice-1/index.md", pdfPages: [84, 100], questionLevel: 2, expected: 6 },
  { id: "practice-2", number: "2", title: "实习 2 栈和队列及其应用", part: "part-2-practice", questionPath: "part-2-practice/practice-2/index.md", pdfPages: [101, 120], questionLevel: 2, expected: 9 },
  { id: "practice-3", number: "3", title: "实习 3 串及其应用", part: "part-2-practice", questionPath: "part-2-practice/practice-3/index.md", pdfPages: [121, 140], questionLevel: 2, expected: 5 },
  { id: "practice-4", number: "4", title: "实习 4 数组和广义表", part: "part-2-practice", questionPath: "part-2-practice/practice-4/index.md", pdfPages: [141, 152], questionLevel: 2, expected: 4 },
  { id: "practice-5", number: "5", title: "实习 5 树、图及其应用", part: "part-2-practice", questionPath: "part-2-practice/practice-5/index.md", pdfPages: [153, 169], questionLevel: 2, expected: 8 },
  { id: "practice-6", number: "6", title: "实习 6 存储管理、查找和排序", part: "part-2-practice", questionPath: "part-2-practice/practice-6/index.md", pdfPages: [170, 184], questionLevel: 2, expected: 7 },
];

const difficultyMarks = new Map([["①", 1], ["②", 2], ["③", 3], ["④", 4], ["⑤", 5]]);
const genericFlagCodes = new Set([
  "ANSWER_MISSING",
  "ANSWER_NOT_PRESENT_IN_SOURCE",
  "PRACTICE_3_ANSWER_MISSING",
  "PRACTICE_4_ANSWER_MISSING",
  "ANSWER_HINT_ONLY",
  "BOOK_HINT_ONLY",
  "BOOK_ANSWER_HINT_ONLY",
  "NO_INDEPENDENT_EXERCISES",
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function loadCanonicalKnowledge() {
  const knowledgeDataset = readJson(knowledgeDatasetPath);
  const knowledgeIndex = readJson(knowledgeIndexPath);
  const pages = knowledgeDataset.subjects?.ds?.pages || [];
  const knowledgePoints = new Map(
    pages
      .filter((page) => String(page.id || "").startsWith("ds:") && page.id !== "ds:root")
      .map((page) => [page.id, page.title]),
  );
  const tags = new Map(Object.entries(knowledgeIndex.subjects?.ds?.tagRoutes || {}).map(([tag, route]) => [
    tag,
    String(route.href || "").replace(/^\/knowledge\/([^/]+)\//, "$1:") || null,
  ]));
  if (!knowledgePoints.size || !tags.size) throw new Error("数据结构知识页或真题标签词表为空。");
  return { knowledgePoints, tags };
}

function loadQuestionReviews(knownKnowledge, knownTags) {
  if (!fs.existsSync(questionReviewDirectory)) {
    throw new Error(`缺少 ${asPosix(path.relative(projectRoot, questionReviewDirectory))}；题目必须先完成统一知识点与质量审校。`);
  }
  const files = fs.readdirSync(questionReviewDirectory).filter((name) => name.endsWith(".json")).sort();
  const reviews = new Map();
  const allowedQuality = {
    statement: new Set(["clear", "minor-issue", "broken"]),
    answerability: new Set(["complete", "needs-assumption", "unanswerable"]),
    examRelevance: new Set(["core", "supporting", "legacy"]),
    disposition: new Set(["keep", "revise", "hide"]),
  };
  for (const fileName of files) {
    const review = readJson(path.join(questionReviewDirectory, fileName));
    if (review.schemaVersion !== "textbook-question-review-v1") throw new Error(`${fileName} 的 schemaVersion 无效。`);
    if (review.bookId !== "data-structures-yan-weimin") throw new Error(`${fileName} 的 bookId 无效。`);
    if (!Array.isArray(review.scope) || !review.scope.length || !Array.isArray(review.updates)) throw new Error(`${fileName} 缺少 scope 或 updates。`);
    for (const update of review.updates) {
      if (!String(update.id || "").trim()) throw new Error(`${fileName} 含无 ID 的审校记录。`);
      if (reviews.has(update.id)) throw new Error(`${update.id} 在题目审校文件中重复。`);
      if (!update.quality || !String(update.quality.notes || "").trim()) throw new Error(`${update.id} 缺少质量审校说明。`);
      for (const [field, values] of Object.entries(allowedQuality)) {
        if (!values.has(update.quality[field])) throw new Error(`${update.id} 的 quality.${field} 无效。`);
      }
      if (!Array.isArray(update.knowledgeIds) || update.knowledgeIds.length > 3) throw new Error(`${update.id} 的 knowledgeIds 格式无效。`);
      if (!update.knowledgeIds.length && update.quality.examRelevance !== "legacy") {
        throw new Error(`${update.id} 不是历史内容，必须关联 1–3 个现有知识页。`);
      }
      if (new Set(update.knowledgeIds).size !== update.knowledgeIds.length) throw new Error(`${update.id} 的 knowledgeIds 重复。`);
      for (const id of update.knowledgeIds) if (!knownKnowledge.has(id)) throw new Error(`${update.id} 引用了不存在的知识页 ${id}。`);
      if (!Array.isArray(update.tags) || new Set(update.tags).size !== update.tags.length) throw new Error(`${update.id} 的 tags 格式无效。`);
      if (!update.knowledgeIds.length && update.tags.length) throw new Error(`${update.id} 没有知识页映射时不得保留真题标签。`);
      for (const tag of update.tags) {
        if (!knownTags.has(tag)) throw new Error(`${update.id} 自造了真题标签 ${tag}。`);
        const routedKnowledgeId = knownTags.get(tag);
        if (routedKnowledgeId && !update.knowledgeIds.includes(routedKnowledgeId)) {
          throw new Error(`${update.id} 的标签 ${tag} 与现有真题路由 ${routedKnowledgeId} 不一致。`);
        }
      }
      reviews.set(update.id, { ...update, scope: review.scope, sourceFile: fileName });
    }
  }
  return reviews;
}

function asPosix(value) {
  return value.split(path.sep).join("/");
}

function fullPageRange([start, end]) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function compareQuestionNumbers(left, right) {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  return a[0] - b[0] || a[1] - b[1];
}

function canonicalFlagCode(value) {
  return String(value || "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function meaningfulFlags(flags = []) {
  const seen = new Set();
  const result = [];
  for (const flag of flags) {
    const code = canonicalFlagCode(flag.code);
    if (!code || genericFlagCodes.has(code)) continue;
    const message = String(flag.message || "").trim();
    const key = `${code}\u0000${message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      code,
      message,
      severity: String(flag.severity || "info").toLowerCase(),
      status: flag.status === "resolved" ? "resolved" : "open",
      ...(Array.isArray(flag.pdfPages) && flag.pdfPages.length ? { pdfPages: [...flag.pdfPages] } : {}),
    });
  }
  return result;
}

function bootstrapAnnotations() {
  if (fs.existsSync(annotationsPath) && !force) {
    throw new Error(`注释文件已存在：${annotationsPath}；如需覆盖请添加 --force。`);
  }
  if (!fs.existsSync(catalogPath)) throw new Error(`缺少旧题目目录：${catalogPath}`);
  const source = readJson(catalogPath);
  const annotations = {};
  for (const question of source.questions || []) {
    if (!/^\d+\.\d+$/.test(String(question.number || ""))) continue;
    const key = `${question.chapterId}:${question.number}`;
    const verified = String(question.answer?.verified || "").trim();
    const explanation = String(question.answer?.explanation || "").trim();
    annotations[key] = {
      type: question.type,
      section: question.section,
      options: question.options || [],
      knowledgeIds: (question.knowledgePoints || []).map((point) => point.id),
      answerStatus: question.answer?.status || "missing",
      ...(verified ? { verified } : {}),
      ...(verified ? { answerOrigin: question.answer?.origin || "book+verified" } : {}),
      ...(!/^原书.*未出现.*保持缺失。?$/.test(explanation) && explanation ? { explanation } : {}),
      reviewFlags: meaningfulFlags(question.review?.flags),
    };
  }
  annotations["practice-0-overview:0.1"] = {
    type: "practical",
    section: { id: "practice-0", title: "实习 0 抽象数据类型", path: ["第二篇 实习题", "实习 0 抽象数据类型"] },
    options: [],
    knowledgeIds: ["ds:basic/ds"],
    answerStatus: "missing",
    reviewFlags: [],
  };
  annotations["practice-0-overview:0.2"] = {
    type: "practical",
    section: { id: "practice-0", title: "实习 0 抽象数据类型", path: ["第二篇 实习题", "实习 0 抽象数据类型"] },
    options: [],
    knowledgeIds: ["ds:basic/ds"],
    answerStatus: "missing",
    reviewFlags: [],
  };
  annotations["practice-0-overview:0.3"] = {
    type: "practical",
    section: { id: "practice-0", title: "实习 0 抽象数据类型", path: ["第二篇 实习题", "实习 0 抽象数据类型"] },
    options: [],
    knowledgeIds: ["ds:basic/algorithm"],
    answerStatus: "missing",
    reviewFlags: [],
  };
  const knowledgePoints = (source.knowledgePoints || []).map((point) => ({ id: point.id, title: point.title }));
  writeJson(annotationsPath, {
    schemaVersion: "luna-exercise-annotations-1",
    bookId: "data-structures-yan-weimin-exercises",
    knowledgePoints,
    annotations,
  });
  console.log(`已迁移 ${Object.keys(annotations).length} 条人工元数据到 ${asPosix(path.relative(projectRoot, annotationsPath))}。`);
}

function parsePageAttributes(value) {
  return Object.fromEntries([...value.matchAll(/([a-z_]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3] ?? ""]));
}

function firstPage(value) {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function readMarkdown(relativePath) {
  const absolute = path.join(bookRoot, relativePath);
  if (!fs.existsSync(absolute)) throw new Error(`缺少 Markdown：${relativePath}`);
  return fs.readFileSync(absolute, "utf8").replace(/\r\n/g, "\n");
}

function pageAwareLines(relativePath) {
  const lines = readMarkdown(relativePath).split("\n");
  const pages = [];
  let currentPdfPage = null;
  for (const line of lines) {
    const marker = line.match(/<!--\s*luna:(source|page)\b([\s\S]*?)-->/);
    if (marker) {
      const attributes = parsePageAttributes(marker[2]);
      const nextPage = firstPage(attributes.pdf_page ?? attributes.pdf_pages);
      if (Number.isInteger(nextPage)) currentPdfPage = nextPage;
    }
    pages.push(currentPdfPage);
  }
  return { lines, pages };
}

function stripLunaComments(value) {
  return value
    .replace(/<!--\s*luna:(?:source|page|review)\b[\s\S]*?-->\s*/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pagesForBlock(lines, pages, start, end) {
  const found = [];
  for (let index = start; index < end; index += 1) {
    const content = lines[index].replace(/<!--\s*luna:(?:source|page|review)\b[\s\S]*?-->/g, "").trim();
    if (content && Number.isInteger(pages[index]) && !found.includes(pages[index])) found.push(pages[index]);
  }
  if (!found.length && Number.isInteger(pages[start])) found.push(pages[start]);
  return found;
}

function headingDetails(line, expectedLevel) {
  const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
  if (!heading || heading[1].length !== expectedLevel) return null;
  const body = heading[2].trim();
  const numberMatch = body.match(/^(?:◆\s*)?(\d+\.\d+)(?=\D|$)/);
  if (!numberMatch) return null;
  const number = numberMatch[1];
  const recommended = /^◆/.test(body);
  const mark = [...difficultyMarks.keys()].find((candidate) => body.includes(candidate)) || "";
  const title = body
    .replace(/^◆\s*/, "")
    .replace(new RegExp(`^${number.replace(".", "\\.")}\\s*`), "")
    .replace(/[（(]?([①②③④⑤])[）)]?/, "")
    .trim();
  return { number, recommended, mark, title };
}

function findBlockEnd(lines, start, level) {
  for (let index = start + 1; index < lines.length; index += 1) {
    const heading = lines[index].match(/^(#{1,6})\s+/);
    if (heading && heading[1].length <= level) return index;
  }
  return lines.length;
}

function canonicalQuestionHeading(details) {
  const marker = details.recommended ? "◆ " : "";
  const title = details.title ? ` ${details.title}` : "";
  return `### ${marker}${details.number}${details.mark}${title}`;
}

function extractQuestions(unit) {
  const { lines, pages } = pageAwareLines(unit.questionPath);
  const records = [];
  for (let index = 0; index < lines.length; index += 1) {
    const details = headingDetails(lines[index], unit.questionLevel);
    if (!details) continue;
    const end = findBlockEnd(lines, index, unit.questionLevel);
    const block = [...lines.slice(index, end)];
    block[0] = canonicalQuestionHeading(details);
    records.push({
      ...details,
      markdown: stripLunaComments(block.join("\n")),
      pdfPages: pagesForBlock(lines, pages, index, end),
    });
    index = end - 1;
  }
  if (records.length !== unit.expected) {
    throw new Error(`${unit.id} 题数错误：期望 ${unit.expected}，提取到 ${records.length}。`);
  }
  return records;
}

function answerHeading(line) {
  const heading = line.match(/^##\s+(.+?)\s*$/);
  if (!heading) return null;
  const numbers = [...heading[1].matchAll(/\b\d+\.\d+\b/g)].map((match) => match[0]);
  return numbers.length ? { numbers, title: heading[1] } : null;
}

function extractAnswers() {
  const result = new Map();
  for (const unit of units.filter((item) => item.answerPath)) {
    const { lines, pages } = pageAwareLines(unit.answerPath);
    for (let index = 0; index < lines.length; index += 1) {
      const heading = answerHeading(lines[index]);
      if (!heading) continue;
      const end = findBlockEnd(lines, index, 2);
      const original = stripLunaComments(lines.slice(index + 1, end).join("\n"));
      const pdfPages = pagesForBlock(lines, pages, index, end);
      const anchor = `a-${heading.numbers.map((number) => number.replace(".", "-")).join("-")}`;
      if (!original) throw new Error(`${unit.answerPath} 的 ${heading.numbers.join("/")} 答案块为空。`);
      for (const number of heading.numbers) {
        const key = `${unit.id}:${number}`;
        if (result.has(key)) throw new Error(`答案题号重复：${key}`);
        result.set(key, { markdown: unit.answerPath, anchor, pdfPages, original });
      }
      index = end - 1;
    }
  }
  if (result.size !== 224) throw new Error(`答案题号错误：期望 224，提取到 ${result.size}。`);
  return result;
}

function extractImages(markdown, sourcePath, sourcePdfPages) {
  const result = [];
  const seen = new Set();
  for (const match of markdown.matchAll(/!\[([^\r\n]*?)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const alt = match[1].trim();
    const href = match[2].trim();
    if (!alt) throw new Error(`${sourcePath} 存在空图片 alt。`);
    if (/^(?:https?:|data:|\/)/i.test(href)) throw new Error(`${sourcePath} 存在非本地相对图片：${href}`);
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), href));
    if (!resolved || resolved.startsWith("../")) throw new Error(`${sourcePath} 图片越出书源目录：${href}`);
    const absolute = path.join(bookRoot, ...resolved.split("/"));
    if (!fs.existsSync(absolute)) throw new Error(`${sourcePath} 图片不存在：${resolved}`);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    result.push({
      id: path.posix.basename(resolved, path.posix.extname(resolved)),
      path: resolved,
      alt,
      role: "illustration",
      sourcePdfPages: [...sourcePdfPages],
    });
  }
  return result;
}

function stableId(unitId, number) {
  return `book-ds-yan-${unitId}-${number.replace(".", "-")}`;
}

function buildCatalog() {
  if (!fs.existsSync(annotationsPath)) {
    throw new Error(`缺少 ${asPosix(path.relative(projectRoot, annotationsPath))}；先运行 --bootstrap-annotations。`);
  }
  const annotationFile = readJson(annotationsPath);
  if (annotationFile.schemaVersion !== "luna-exercise-annotations-1") throw new Error("未知的题目人工元数据 schema。 ");
  const annotations = annotationFile.annotations || {};
  const { knowledgePoints: knownKnowledge, tags: knownTags } = loadCanonicalKnowledge();
  const questionReviews = loadQuestionReviews(knownKnowledge, knownTags);
  const answers = extractAnswers();
  const allQuestions = [];
  const unitOutputs = [];

  for (const unit of units) {
    const extracted = extractQuestions(unit);
    const questions = extracted.map((sourceQuestion) => {
      const key = `${unit.id}:${sourceQuestion.number}`;
      const annotation = annotations[key];
      if (!annotation) throw new Error(`缺少人工元数据：${key}`);
      if (!sourceQuestion.mark || !difficultyMarks.has(sourceQuestion.mark)) throw new Error(`${key} 缺少原书难度圈号。`);
      const id = stableId(unit.id, sourceQuestion.number);
      const questionReview = questionReviews.get(id);
      if (!questionReview) throw new Error(`${key} 缺少统一知识点与质量审校。`);
      if (!questionReview.scope.includes(unit.id)) throw new Error(`${questionReview.sourceFile} 的 ${id} 超出 scope。`);
      const answerSource = answers.get(key) || null;
      if (answerSource && annotation.answerStatus === "missing") throw new Error(`${key} 在答案篇存在，但元数据标为 missing。`);
      if (!answerSource && annotation.answerStatus !== "missing") throw new Error(`${key} 在答案篇不存在，但元数据标为 ${annotation.answerStatus}。`);
      const flags = meaningfulFlags(annotation.reviewFlags);
      const hasOpenRisk = flags.some((flag) => flag.status === "open" && ["warning", "error"].includes(flag.severity));
      const status = answerSource ? annotation.answerStatus : "missing";
      const origin = answerSource ? (annotation.verified ? annotation.answerOrigin || "book+verified" : "book") : "missing";
      const answer = answerSource
        ? {
          status,
          origin,
          original: answerSource.original,
          ...(annotation.verified ? { verified: annotation.verified } : {}),
          ...(annotation.explanation ? { explanation: annotation.explanation } : {}),
        }
        : { status: "missing", origin: "missing" };
      const source = {
        question: {
          markdown: unit.questionPath,
          anchor: `q-${sourceQuestion.number.replace(".", "-")}`,
          pdfPages: sourceQuestion.pdfPages,
          bookPages: sourceQuestion.pdfPages.map((page) => page - 5),
        },
        answer: answerSource ? {
          markdown: answerSource.markdown,
          anchor: answerSource.anchor,
          pdfPages: answerSource.pdfPages,
          bookPages: answerSource.pdfPages.map((page) => page - 5),
        } : null,
      };
      const images = extractImages(sourceQuestion.markdown, unit.questionPath, sourceQuestion.pdfPages);
      if (answerSource) {
        for (const image of extractImages(answerSource.original, answerSource.markdown, answerSource.pdfPages)) {
          if (!images.some((candidate) => candidate.path === image.path)) images.push(image);
        }
      }
      return {
        id,
        number: sourceQuestion.number,
        type: annotation.type,
        unitId: unit.id,
        section: annotation.section,
        difficulty: { level: difficultyMarks.get(sourceQuestion.mark), mark: sourceQuestion.mark },
        recommended: sourceQuestion.recommended,
        prompt: { markdown: sourceQuestion.markdown },
        options: annotation.options || [],
        answer,
        tags: [...questionReview.tags],
        knowledgeIds: [...questionReview.knowledgeIds],
        quality: { ...questionReview.quality },
        images,
        source,
        review: {
          status: status === "pending-review" || hasOpenRisk ? "needs-review" : "passed",
          flags,
        },
      };
    }).sort((left, right) => compareQuestionNumbers(left.number, right.number));

    const pdfPages = fullPageRange(unit.pdfPages);
    const unitMetadata = {
      id: unit.id,
      number: unit.number,
      title: unit.title,
      part: unit.part,
      questionMarkdown: unit.questionPath,
      ...(unit.answerPath ? { answerMarkdown: unit.answerPath } : {}),
      pdfPages,
      bookPages: pdfPages.map((page) => page - 5),
      questionCount: questions.length,
    };
    writeJson(path.join(questionsRoot, `${unit.id}.json`), {
      schemaVersion: "luna-exercise-question-unit-2",
      bookId: "data-structures-yan-weimin-exercises",
      unit: unitMetadata,
      questions,
    });
    unitOutputs.push({ ...unitMetadata, file: `questions/${unit.id}.json` });
    allQuestions.push(...questions);
  }

  const ids = new Set(allQuestions.map((question) => question.id));
  if (allQuestions.length !== 457 || ids.size !== 457) throw new Error(`题目总数/ID 唯一性错误：${allQuestions.length}/${ids.size}。`);
  if (questionReviews.size !== allQuestions.length || [...questionReviews.keys()].some((id) => !ids.has(id))) {
    throw new Error(`题目审校覆盖必须与 457 道题一一对应，当前为 ${questionReviews.size}。`);
  }
  if (allQuestions.some((question) => /<!--\s*luna:/i.test(question.prompt.markdown))) throw new Error("派生题干残留 luna 注释。 ");
  const matrixQuestion = allQuestions.find((question) => question.unitId === "practice-4" && question.number === "4.1");
  if (!matrixQuestion || matrixQuestion.prompt.markdown.includes("\\\\n0")) throw new Error("实习 4.1 矩阵仍含字面量 \\\\n。 ");

  const answerStats = Object.fromEntries(["provided", "hint-only", "pending-review", "missing"].map((status) => [status, allQuestions.filter((question) => question.answer.status === status).length]));
  const expectedAnswerStats = { provided: 123, "hint-only": 100, "pending-review": 1, missing: 233 };
  for (const [status, expected] of Object.entries(expectedAnswerStats)) {
    if (answerStats[status] !== expected) throw new Error(`答案状态 ${status}：期望 ${expected}，得到 ${answerStats[status]}。`);
  }

  for (const question of allQuestions) {
    for (const id of question.knowledgeIds) if (!knownKnowledge.has(id)) throw new Error(`${question.id} 引用了未知知识点 ${id}。`);
  }
  const knowledgePoints = [...knownKnowledge].map(([id, title]) => ({
    id,
    title,
    questionIds: allQuestions.filter((question) => question.knowledgeIds.includes(id)).map((question) => question.id),
  }));
  writeJson(catalogPath, {
    schemaVersion: "luna-exercise-question-catalog-2",
    sourceOfTruth: "markdown",
    book: {
      id: "data-structures-yan-weimin-exercises",
      title: "数据结构题集（C语言版）",
      mode: "exercise-book",
      edition: "1999年2月第1版",
      sourcePdf: "C:/Users/Administrator/Downloads/数据结构题集（C语言版） (严蔚敏) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
      includedPdfPages: "6-226",
      excludedNonQuestionPdfPages: ["1-5", "227-239"],
    },
    stats: {
      units: unitOutputs.length,
      questions: allQuestions.length,
      answers: answerStats,
      distinctImages: new Set(allQuestions.flatMap((question) => question.images.map((image) => image.path))).size,
      openReviewFlags: allQuestions.flatMap((question) => question.review.flags).filter((flag) => flag.status === "open").length,
    },
    units: unitOutputs,
    questions: allQuestions,
    knowledgePoints,
  });
  console.log(`已从规范 Markdown 重建 ${allQuestions.length} 道题：答案/提示 ${457 - answerStats.missing} 道，原书缺答 ${answerStats.missing} 道。`);
}

if (bootstrap) bootstrapAnnotations();
else buildCatalog();
