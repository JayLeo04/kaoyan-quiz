import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const defaultSourceRoot = path.join(projectRoot, "..", "local", "kaoyanzahuopu", "408_exams");
const sourceRoot = path.resolve(
  process.argv[2] || process.env.KAOYAN_QUESTIONS_SOURCE || defaultSourceRoot,
);
const outputFile = path.join(projectRoot, "app", "data", "questions.json");
const publicRoot = path.join(projectRoot, "public", "questions");

const subjectIds = {
  数据结构: "ds",
  组成原理: "co",
  操作系统: "os",
  计算机网络: "cn",
};

const subjectNames = {
  数据结构: "数据结构",
  组成原理: "计算机组成原理",
  操作系统: "操作系统",
  计算机网络: "计算机网络",
};

const externalImagePattern = /https:\/\/www\.csgraduates\.com\/images\/[^"'\s<]+/gi;

function externalAssetName(url) {
  return `external-${path.basename(new URL(url).pathname)}`;
}

async function mirrorExternalImages(values, year) {
  const urls = new Set(values.flatMap((value) => String(value || "").match(externalImagePattern) || []));
  const outputAssets = path.join(publicRoot, String(year), "assets");
  fs.mkdirSync(outputAssets, { recursive: true });
  for (const url of urls) {
    const output = path.join(outputAssets, externalAssetName(url));
    if (fs.existsSync(output)) continue;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`图片下载失败：${url} (${response.status})`);
    fs.writeFileSync(output, Buffer.from(await response.arrayBuffer()));
  }
}

function cleanHtml(value, year) {
  if (!value) return "";
  return String(value)
    .replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(src\s*=\s*["'])assets\//gi, `$1/questions/${year}/assets/`)
    .replace(externalImagePattern, (url) => `/questions/${year}/assets/${externalAssetName(url)}`)
    .replace(/(href\s*=\s*["'])\/(?!\/)/gi, "$1https://www.csgraduates.com/")
    .replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy"');
}

function readQuestionSet(year) {
  const file = path.join(sourceRoot, String(year), "questions.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(raw.questions) || raw.questions.length !== 47) {
    throw new Error(`${year} 年题库数量异常：${raw.questions?.length ?? 0}`);
  }
  return raw.questions;
}

if (!fs.existsSync(sourceRoot)) {
  throw new Error(`找不到 408 题库目录：${sourceRoot}`);
}

const years = fs
  .readdirSync(sourceRoot)
  .filter((name) => /^20\d{2}$/.test(name) && fs.existsSync(path.join(sourceRoot, name, "questions.json")))
  .map(Number)
  .sort((a, b) => b - a);

if (years.length !== 18 || years.at(-1) !== 2009 || years[0] !== 2026) {
  throw new Error(`题库年份不完整：${years.join(", ")}`);
}

fs.mkdirSync(publicRoot, { recursive: true });

const questions = [];
for (const year of years) {
  const sourceAssets = path.join(sourceRoot, String(year), "assets");
  const outputAssets = path.join(publicRoot, String(year), "assets");
  if (fs.existsSync(sourceAssets)) {
    fs.mkdirSync(path.dirname(outputAssets), { recursive: true });
    fs.cpSync(sourceAssets, outputAssets, { recursive: true, force: true });
  }

  for (const raw of readQuestionSet(year)) {
    const subject = subjectIds[raw.subject];
    const subjectName = subjectNames[raw.subject];
    if (!subject || !subjectName) throw new Error(`${year} 第 ${raw.number} 题科目无法识别：${raw.subject}`);

    await mirrorExternalImages([
      raw.question_html,
      raw.solution_html,
      ...(raw.options || []).map((option) => option.html),
    ], year);

    questions.push({
      id: `real-${year}-${raw.number}`,
      subject,
      number: `${year} 年 408 真题`,
      title: `${year} 年 408 ${subjectName} · 第 ${raw.number} 题`,
      prompt: raw.question_text || "题干待补充",
      promptHtml: cleanHtml(raw.question_html, year),
      status: "真题",
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      knowledgeIds: [],
      year,
      questionNumber: raw.number,
      questionType: raw.type === "choice" ? "choice" : "answer",
      section: `${subjectName} · ${raw.section || (raw.type === "choice" ? "选择题" : "综合题")}`,
      options: Array.isArray(raw.options)
        ? raw.options.map((option) => ({
            label: option.label,
            text: option.text || "见题图",
            html: cleanHtml(option.html, year),
          }))
        : [],
      answer: raw.answer || "详见解析",
      solution: raw.solution_text || "",
      solutionHtml: cleanHtml(raw.solution_html, year),
      sourceUrl: raw.source_url || "",
      sourceNote: `${year} 年全国硕士研究生招生考试 408 真题`,
      images: [],
    });
  }
}

const counts = questions.reduce((result, question) => {
  result[question.subject] = (result[question.subject] || 0) + 1;
  return result;
}, {});

const expected = { ds: 233, co: 235, os: 216, cn: 162 };
if (questions.length !== 846 || Object.entries(expected).some(([key, count]) => counts[key] !== count)) {
  throw new Error(`题库总数异常：总计 ${questions.length}，分科 ${JSON.stringify(counts)}`);
}

fs.writeFileSync(outputFile, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`已导入 ${questions.length} 题：数据结构 ${counts.ds}，组成原理 ${counts.co}，操作系统 ${counts.os}，计算机网络 ${counts.cn}`);
console.log(`题库数据：${outputFile}`);
console.log(`题目配图：${publicRoot}`);
