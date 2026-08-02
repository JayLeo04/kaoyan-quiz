#!/usr/bin/env node
/** Build the browser data module from the local 408 past-question archive. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const defaultArchiveRoot = path.join(appRoot, "..", "local", "kaoyanzahuopu", "408_exams");
const archiveRoot = path.resolve(process.argv[2] || process.env.KAOYAN_QUESTIONS_SOURCE || defaultArchiveRoot);
const studyPath = path.join(appRoot, "app/data/study.ts");

if (!fs.existsSync(archiveRoot)) {
  throw new Error(
    `Question archive not found: ${archiveRoot}. Pass its path as the first argument or set KAOYAN_QUESTIONS_SOURCE.`,
  );
}

const tagToKnowledge = {
  "操作系统概念": ["OS-KP-1-2"],
  "用户态和内核态": ["OS-KP-3-2-4"],
  "系统调用": ["OS-KP-3-2-5"],
  "陷阱指令": ["OS-KP-3-2-2", "OS-KP-3-2-5"],
  "系统引导流程": ["OS-KP-3-2-3"],
  "程序的链接": ["OS-KP-3-1-4"],
  "程序的装入": ["OS-KP-6-1-2"],
  "寄存器类型": ["OS-KP-3-1-2"],
  "异常和中断": ["OS-KP-3-2-2", "OS-KP-13-2-4"],
  "地址翻译": ["OS-KP-4-1-1"],
  "访存过程": ["OS-KP-4-1-1"],
  "页表": ["OS-KP-4-1-4", "OS-KP-4-2-2"],
  "TLB": ["OS-KP-4-1-5"],
  "虚拟页式管理": ["OS-KP-4-1-2", "OS-KP-4-2"],
  "缺页异常": ["OS-KP-4-2-4", "OS-KP-5-2-1"],
  "页面置换算法": ["OS-KP-5-2-2"],
  "clock算法": ["OS-KP-5-2-2"],
  "LRU": ["OS-KP-5-2-2"],
  "Belady异常": ["OS-KP-5-2-2"],
  "页框分配和置换策略": ["OS-KP-5-1", "OS-KP-5-2-2"],
  "驻留集": ["OS-KP-5-2-4"],
  "抖动": ["OS-KP-5-2-4"],
  "动态内存管理": ["OS-KP-4-2-5"],
  "内存管理方式": ["OS-KP-4-1-2"],
  "段式内存管理": ["OS-KP-4-1-1"],
  "分段内存管理": ["OS-KP-4-1-1"],
  "进程概念": ["OS-KP-6-1"],
  "进程状态": ["OS-KP-6-1-8"],
  "进程控制块": ["OS-KP-6-1-1"],
  "进程和线程": ["OS-KP-6-5-2"],
  "用户级和内核级线程": ["OS-KP-6-5-6"],
  "进程内存空间": ["OS-KP-3-3-4"],
  "进程间通信": ["OS-KP-8-1"],
  "处理机调度概念": ["OS-KP-7-1"],
  "处理机调度算法": ["OS-KP-7-3", "OS-KP-7-4"],
  "时间片轮转": ["OS-KP-7-3-4"],
  "调度指标": ["OS-KP-7-2"],
  "同步问题设计": ["OS-KP-9-1"],
  "同步原则": ["OS-KP-9-1-2"],
  "信号量": ["OS-KP-9-2-4"],
  "条件变量": ["OS-KP-9-2-3"],
  "管程": ["OS-KP-9-2-3"],
  "临界资源": ["OS-KP-9-1-2"],
  "进程的互斥": ["OS-KP-9-2-1"],
  "软件互斥算法": ["OS-KP-9-2-1"],
  "硬件互斥指令": ["OS-KP-9-2-1"],
  "银行家算法": ["OS-KP-9-3-4"],
  "死锁产生的必要条件": ["OS-KP-9-3-1"],
  "死锁的处理方法": ["OS-KP-9-3-2"],
  "死锁概念": ["OS-KP-9-3-1"],
  "死锁预防": ["OS-KP-9-3-3"],
  "文件概念": ["OS-KP-11-1-2"],
  "文件物理结构": ["OS-KP-11-1-3"],
  "目录": ["OS-KP-11-1-4"],
  "文件链接": ["OS-KP-11-1-6", "OS-KP-11-1-7"],
  "外存空间管理": ["OS-KP-11-1-5"],
  "位图法": ["OS-KP-11-1-5"],
  "inode": ["OS-KP-11-1-2", "OS-KP-11-1-3"],
  "进程文件管理": ["OS-KP-11-3-1"],
  "虚拟文件系统": ["OS-KP-11-3"],
  "内存映射文件": ["OS-KP-11-4-6"],
  "文件系统": ["OS-KP-11-1"],
  "文件分配表": ["OS-KP-11-2-1"],
  "IO软件层次": ["OS-KP-13-3"],
  "中断IO": ["OS-KP-13-2-4"],
  "DMA": ["OS-KP-13-2-5"],
  "缓冲区": ["OS-KP-13-3-3"],
  "设备分配和回收": ["OS-KP-13-3"],
  "磁盘调度算法": ["OS-KP-13-1-3"],
  "磁盘概念": ["OS-KP-13-1-3"],
  "CHS地址": ["OS-KP-13-1-3"],
  "磁盘格式化": ["OS-KP-13-1-3"],
  "机械硬盘": ["OS-KP-13-1-3"],
  "SPOOLing": ["OS-KP-13-3-3"],
};

const manualRoutes = {
  "2019-29": ["OS-KP-5-2-2"],
  "2026-23": ["OS-KP-3-2-1", "OS-KP-3-2-4"],
  "2026-24": ["OS-KP-4-1-1", "OS-KP-4-2-2", "OS-KP-3-2-2"],
  "2026-25": ["OS-KP-6-5-2", "OS-KP-6-5-6"],
  "2026-26": ["OS-KP-9-2-4", "OS-KP-9-1-2"],
  "2026-27": ["OS-KP-9-1-2", "OS-KP-9-2-1"],
  "2026-28": ["OS-KP-4-1-2", "OS-KP-4-1-4"],
  "2026-29": ["OS-KP-4-1-5", "OS-KP-5-2-4", "OS-KP-5-2-2"],
  "2026-30": ["OS-KP-4-1-1", "OS-KP-4-2-5", "OS-KP-11-4-6"],
  "2026-31": ["OS-KP-13-3-2", "OS-KP-13-5"],
  "2026-32": ["OS-KP-13-2-4", "OS-KP-13-2-3"],
  "2026-45": ["OS-KP-7-1-2", "OS-KP-7-3-4", "OS-KP-7-4"],
  "2026-46": ["OS-KP-11-1-2", "OS-KP-11-1-3", "OS-KP-11-1-4", "OS-KP-11-1-5"],
};

const manualNotes = {
  "2019-29": "题库没有标签；根据 LRU 与局部置换题干路由，待人工复核。",
  "2026-23": "依据 2026 真题手册审计：内核模式与用户/内核态。",
  "2026-24": "依据 2026 真题手册审计：MMU、地址翻译与异常入口。",
  "2026-25": "依据 2026 真题手册审计：线程模型与实现。",
  "2026-26": "依据 2026 真题手册审计：P/V 操作与信号量；题库版本表述以本地资料为准。",
  "2026-27": "依据 2026 真题手册审计：Bernstein 条件与互斥。",
  "2026-28": "依据 2026 真题手册审计：多级页表。",
  "2026-29": "依据 2026 真题手册审计：TLB、工作集与页缓冲；题库版本表述以本地资料为准。",
  "2026-30": "依据 2026 真题手册审计：共享页、内存映射与文件接口；存在资料版本差异。",
  "2026-31": "依据 2026 真题手册审计：设备驱动与 HAL。",
  "2026-32": "依据 2026 真题手册审计：中断驱动 I/O 与寄存器访问。",
  "2026-45": "依据 2026 真题手册审计：调度事件、时间片轮转与优先级策略。",
  "2026-46": "依据 2026 真题手册审计：inode、多级索引、目录与删除元数据；存在资料版本差异。",
};

function assetPaths(year, questionHtml) {
  return [...questionHtml.matchAll(/<img\b[^>]*\bsrc=["']assets\/([^"']+)["']/gi)]
    .map((match) => `/questions/${year}/assets/${match[1]}`);
}

const questions = [];
for (const dirent of fs.readdirSync(archiveRoot, { withFileTypes: true })) {
  if (!dirent.isDirectory() || !/^\d{4}$/.test(dirent.name)) continue;
  const source = JSON.parse(fs.readFileSync(path.join(archiveRoot, dirent.name, "questions.json"), "utf8"));
  for (const question of source.questions) {
    if (question.subject !== "操作系统") continue;
    const routeKey = `${question.year}-${question.number}`;
    const knowledgeIds = manualRoutes[routeKey] || [...new Set(question.tags.flatMap((tag) => tagToKnowledge[tag] || []))];
    if (knowledgeIds.length === 0) throw new Error(`No knowledge route for ${routeKey}`);
    const manuallyRouted = Boolean(manualRoutes[routeKey]);
    questions.push({
      id: `real-${question.year}-${question.number}`,
      number: `${question.year} 年 · 第 ${question.number} 题`,
      title: `${question.year} 年 408 操作系统 · 第 ${question.number} 题`,
      prompt: question.question_text.trim(),
      status: "真题",
      tags: question.tags.length ? question.tags : [manuallyRouted ? "手册审计路由" : "待人工复核"],
      knowledgeIds,
      year: question.year,
      questionNumber: question.number,
      questionType: question.type,
      section: question.section,
      options: question.options.map((option) => ({ label: option.label, text: option.text.trim() })),
      answer: question.answer || "",
      solution: question.solution_text.trim(),
      sourceUrl: question.source_url,
      sourceNote: manualNotes[routeKey] || "按本地题库原始标签映射到教材小节。",
      images: assetPaths(question.year, question.question_html || ""),
    });
  }
}
questions.sort((a, b) => b.year - a.year || a.questionNumber - b.questionNumber);

const current = fs.readFileSync(studyPath, "utf8");
const dataStart = current.indexOf("export const sectionSegments");
const questionStart = current.indexOf("export const questionSeeds");
if (dataStart === -1 || questionStart === -1) throw new Error("Could not locate the existing study data blocks.");

const types = `export type SectionSegment = {\n  id: string;\n  title: string;\n  core_start: number;\n  core_end: number;\n  slice_start: number;\n  slice_end: number;\n  file: string;\n};\n\nexport type KnowledgePoint = {\n  id: string;\n  title: string;\n  level: number;\n  page: number | null;\n  parentId: string | null;\n  segmentId: string | null;\n};\n\nexport type StudyQuestion = {\n  id: string;\n  number: string;\n  title: string;\n  prompt: string;\n  status: \"真题\" | \"自录题\";\n  tags: string[];\n  knowledgeIds: string[];\n  year: number | null;\n  questionNumber: number | null;\n  questionType: \"choice\" | \"answer\" | \"custom\";\n  section: string;\n  options: { label: string; text: string }[];\n  answer: string;\n  solution: string;\n  sourceUrl: string;\n  sourceNote: string;\n  images: string[];\n};\n\n`;

const footer = `\n\nexport const knowledgeById = new Map(knowledgePoints.map((point) => [point.id, point]));\n\nexport const segmentById = new Map(sectionSegments.map((segment) => [segment.id, segment]));\n\nexport function segmentHref(segmentId: string | null) {\n  const segment = segmentId ? segmentById.get(segmentId) : undefined;\n  return segment ? \`/sections/\${segment.file}\` : null;\n}\n`;
fs.writeFileSync(
  studyPath,
  types + current.slice(dataStart, questionStart) + `export const questionSeeds: StudyQuestion[] = ${JSON.stringify(questions, null, 2)};` + footer,
  "utf8",
);

console.log(`Wrote ${questions.length} real operating-systems questions to ${studyPath}`);
