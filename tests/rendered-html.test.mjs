import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { normalizeLocalLearningLibrary } from "../app/lib/local-learning-library.ts";
import { renderQuestionPreviewMarkdown } from "../app/lib/render-question-preview.ts";

const knowledgeSourceRoot = process.env.KAOYAN_KNOWLEDGE_SOURCE
  ? path.resolve(process.env.KAOYAN_KNOWLEDGE_SOURCE)
  : null;

test("renders compact question previews from Markdown", () => {
  const html = renderQuestionPreviewMarkdown(
    "### 1.3②\n\n设 $n^2$，并运行 `push()`。\n\n- 第一步\n- 第二步",
    "1.3",
  );
  assert.match(html, /class="katex"/);
  assert.match(html, /<code>push\(\)<\/code>/);
  assert.match(html, /<ul>/);
  assert.doesNotMatch(html, /<h3>/);

  const safeHtml = renderQuestionPreviewMarkdown("[外链](https://example.com)\n\n<img src=x onerror=alert(1)>", "safe");
  assert.doesNotMatch(safeHtml, /<a\b|<img\b/);
  assert.match(safeHtml, /&lt;img/);
});

test("normalizes local bookmarks, notes, and text annotations", () => {
  const library = normalizeLocalLearningLibrary({
    resources: {
      "knowledge:ds:list": {
        id: "knowledge:ds:list",
        kind: "knowledge",
        title: "线性表",
        href: "/knowledge/ds/linearlist",
        context: "数据结构知识点",
        updatedAt: "2026-08-08T00:00:00.000Z",
      },
    },
    bookmarks: { "knowledge:ds:list": { savedAt: "2026-08-08T00:00:00.000Z" } },
    notes: { "knowledge:ds:list": { body: "顺序表易错点", updatedAt: "2026-08-08T00:00:00.000Z" } },
    annotations: {
      "knowledge:ds:list": [{
        id: "annotation-1",
        style: "highlight",
        start: 2,
        end: 5,
        quote: "线性表",
        prefix: "",
        suffix: "是",
        createdAt: "2026-08-08T00:00:00.000Z",
      }],
    },
  });
  assert.equal(library.resources["knowledge:ds:list"].title, "线性表");
  assert.ok(library.bookmarks["knowledge:ds:list"]);
  assert.equal(library.notes["knowledge:ds:list"].body, "顺序表易错点");
  assert.deepEqual(library.annotations["knowledge:ds:list"].map((item) => item.style), ["highlight"]);
});

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", process.pid + "-" + Date.now() + path);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost" + path, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the 408 practice workspace", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /研刷 408/);
  assert.match(html, /408/);
  assert.match(html, /真题/);
  assert.match(html, /每页只做一道题/);
  assert.match(html, /本地资料/);
  assert.doesNotMatch(html, /登录 \/ 注册/);
  assert.match(html, /数据结构/);
  assert.match(html, /计算机组成原理/);
  assert.match(html, /846/);
  assert.match(html, /233/);
  assert.match(html, /235/);
  assert.match(html, /216/);
  assert.match(html, /162/);
  assert.match(html, /计算机网络/);
  assert.doesNotMatch(html, /刷到会/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("imports every 408 question from 2009 through 2026", () => {
  const questions = JSON.parse(fs.readFileSync(new URL("../app/data/questions.json", import.meta.url), "utf8"));
  assert.equal(questions.length, 846);
  assert.deepEqual(
    Object.fromEntries(["ds", "co", "os", "cn"].map((subject) => [subject, questions.filter((question) => question.subject === subject).length])),
    { ds: 233, co: 235, os: 216, cn: 162 },
  );
  assert.deepEqual([...new Set(questions.map((question) => question.year))].sort(), [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]);
});

test("protects account progress for signed-out visitors", async () => {
  const response = await render("/api/progress");
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "请先登录" });
});

test("renders a subject analytics dashboard", async () => {
  const response = await render("/subject/os");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /操作系统/);
  assert.match(html, /216/);
  assert.match(html, /考情分析/);
  assert.match(html, /知识模块权重/);
  assert.match(html, /近五年升降温/);
  assert.match(html, /综合题产出率/);
  assert.match(html, /复习优先级/);
  assert.match(html, /同步问题设计/);
  assert.match(html, /细分考点/);
  assert.match(html, /开始做题/);
  assert.match(html, /查看知识点/);
  assert.match(html, /进程、线程与调度/);
  assert.match(html, /时间趋势/);
  assert.match(html, /关联分析/);
  assert.match(html, /真题题库/);
});

test("renders rich question previews in the real-question library", async () => {
  const response = await render("/subject/ds?view=questions&knowledge=basic%2Falgorithm");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /question-card-markdown subject-question-card-markdown/);
  assert.match(html, /class="katex"/);
});

test("keeps the analytics dataset aligned with the full question bank", () => {
  const questions = JSON.parse(fs.readFileSync(new URL("../app/data/questions.json", import.meta.url), "utf8"));
  const analytics = JSON.parse(fs.readFileSync(new URL("../app/data/analytics.json", import.meta.url), "utf8"));
  assert.deepEqual(analytics.range.years, [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]);
  for (const subject of ["ds", "co", "os", "cn"]) {
    const data = analytics.subjects[subject];
    assert.equal(data.totals.questions, questions.filter((question) => question.subject === subject).length);
    assert.equal(data.yearStats.reduce((sum, year) => sum + year.questions, 0), data.totals.questions);
    assert.ok(data.areas.length >= 6);
    assert.ok(data.totals.uniqueTags >= 50);
    assert.equal(data.fineTags.length, data.totals.uniqueTags);
    assert.equal(data.topTags.length, 20);
    assert.ok(data.relations.length >= 8);
    assert.ok(data.areas.every((area) => area.yearSeries.length === 18));
    assert.ok(data.yearStats.every((year) => Object.values(year.areas).reduce((sum, count) => sum + count, 0) > 0));
    assert.ok(data.fineTags.every((tag) => data.areas.some((area) => area.id === tag.areaId) && tag.yearSeries.length === 18 && tag.questionIds.length === tag.count));
    assert.ok(data.fineTags.flatMap((tag) => tag.questionIds).every((id) => questions.some((question) => question.id === id && question.subject === subject)));
  }
});

test("renders schedule local knowledge pages", async () => {
  const rootResponse = await render("/knowledge/ds");
  assert.equal(rootResponse.status, 200);
  assert.match(await rootResponse.text(), /30(?:<!-- -->)? 篇本地资料/);
  const response = await render("/knowledge/ds/linearlist/sequential");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /SCHEDULE \/ 本地知识库/);
  assert.match(html, /顺序表示/);
  assert.match(html, /Sequential List/);
  assert.match(html, /做相关真题/);
  assert.match(html, /做相关真题 · (?:<!-- -->)?6(?:<!-- -->)? 道/);
  assert.match(html, /study-resource-tools/);
  assert.match(html, /收藏知识点/);
  assert.match(html, /添加笔记/);
  assert.match(html, /选中文字/);
  assert.match(html, /data-study-annotatable="true"/);
  assert.match(html, /\/subject\/ds\?view=questions(?:&|&amp;)knowledge=linearlist%2Fsequential/);
  assert.match(html, /\/knowledge\/ds\/linearlist\/sequential\/assets\/inline-svg-01\.svg/);
  const osRootResponse = await render("/knowledge/os");
  assert.equal(osRootResponse.status, 200);
  const osRootHtml = await osRootResponse.text();
  assert.match(osRootHtml, /href="\/knowledge\/os\/concepts"/);
  assert.match(osRootHtml, /href="\/knowledge\/co\/storage"/);
});

test("renders the data structures textbook reading experience", async () => {
  const rootResponse = await render("/textbook/data-structures");
  assert.equal(rootResponse.status, 200);
  const rootHtml = await rootResponse.text();
  assert.match(rootHtml, /数据结构（C语言版）/);
  assert.match(rootHtml, /严蔚敏/);
  assert.match(rootHtml, /刷本书习题/);
  assert.match(rootHtml, /textbook\/data-structures\/02-linear-list/);

  const condensedResponse = await render("/textbook/data-structures/01-introduction");
  assert.equal(condensedResponse.status, 200);
  const condensedHtml = await condensedResponse.text();
  assert.match(condensedHtml, /教材原文/);
  assert.match(condensedHtml, /精简版/);
  assert.match(condensedHtml, /408 复习/);

  const response = await render("/textbook/data-structures/02-linear-list/2-2-sequential-representation-and-implementation");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2\.2 线性表的顺序表示和实现/);
  assert.match(html, /线性表的顺序存储结构示意图/);
  assert.match(html, /textbooks\/data-structures\/02-linear-list\/2-2-sequential-representation-and-implementation\/assets\/py\/fig-2-2-sequential-layout\.svg/);
  assert.doesNotMatch(html, /-readable\.svg/);
  assert.match(html, /katex/);
  assert.match(html, /本章练习/);
  assert.match(html, /study-resource-tools/);
  assert.match(html, /收藏知识点/);
  assert.match(html, /添加笔记/);
  assert.match(html, /data-study-annotatable="true"/);
});

test("renders the textbook catalog and keeps unknown books inside the shared shelf", async () => {
  const catalogResponse = await render("/textbook");
  assert.equal(catalogResponse.status, 200);
  const catalogHtml = await catalogResponse.text();
  assert.match(catalogHtml, /TEXTBOOK LIBRARY/);
  assert.match(catalogHtml, /href="\/textbook\/data-structures"/);
  assert.match(catalogHtml, /href="\/textbook\/data-structures\/practice"/);

  const missingBookResponse = await render("/textbook/not-yet-registered");
  assert.equal(missingBookResponse.status, 200);
  const missingBookHtml = await missingBookResponse.text();
  assert.match(missingBookHtml, /TEXTBOOK LIBRARY/);
  assert.match(missingBookHtml, /href="\/textbook\/data-structures"/);
});

test("renders textbook practice and preserves answer provenance", async () => {
  const libraryResponse = await render("/textbook/data-structures/practice?chapter=02-linear-list");
  assert.equal(libraryResponse.status, 200);
  const libraryHtml = await libraryResponse.text();
  assert.match(libraryHtml, /按章节，做完这本书的题/);
  assert.match(libraryHtml, /457(?:<!-- -->)? 道可练习题/);
  assert.match(libraryHtml, /原书完整答案/);
  assert.match(libraryHtml, /完整核验解答/);
  assert.ok(Buffer.byteLength(libraryHtml) < 250_000, "the practice landing page must serialize only its visible result page");
  assert.match(libraryHtml, /question-card-markdown textbook-question-card-markdown/);
  assert.match(libraryHtml, /class="katex"/);

  const questionResponse = await render("/textbook/data-structures/practice/book-ds-yan-02-linear-list-2-1");
  assert.equal(questionResponse.status, 200);
  const questionHtml = await questionResponse.text();
  assert.match(questionHtml, /头指针，头结点，首元结点/);
  assert.match(questionHtml, /完整核验解答/);
  assert.match(questionHtml, /查看原书保留内容或独立核验补充/);
  assert.match(questionHtml, /对应知识点/);
  assert.match(questionHtml, /题目与答案来源/);
  assert.match(questionHtml, /textbook-question-note-tools/);
  assert.match(questionHtml, /添加笔记/);
  assert.match(questionHtml, /textbook-question-annotation-surface/);
  assert.doesNotMatch(questionHtml, /fig-02-04-linked-list/);
  assert.ok(questionHtml.length < 250_000, "a single textbook question must not serialize the complete textbook dataset");

  const illustratedQuestionResponse = await render("/textbook/data-structures/practice/book-ds-yan-02-linear-list-2-4");
  assert.equal(illustratedQuestionResponse.status, 200);
  const illustratedQuestionHtml = await illustratedQuestionResponse.text();
  assert.match(illustratedQuestionHtml, /fig-02-04-linked-list/);
});

test("keeps generated textbook data and local images publishable", () => {
  const textbook = JSON.parse(fs.readFileSync(new URL("../app/data/textbook-data-structures.json", import.meta.url), "utf8"));
  assert.equal(textbook.stats.knowledgePages, 81);
  assert.equal(textbook.stats.condensedPages, 1);
  assert.equal(textbook.stats.condensedImages, 2);
  assert.equal(textbook.stats.exerciseRecords, 457);
  assert.equal(textbook.stats.exerciseQuestions, 457);
  assert.equal(textbook.stats.exerciseImages, 49);
  assert.equal(textbook.stats.answersProvided, 123);
  assert.equal(textbook.stats.answersHintOnly, 100);
  assert.equal(textbook.stats.answersMissing, 233);
  assert.equal(textbook.pages.length, 81);
  assert.equal(textbook.questions.length, 457);
  assert.equal(new Set(textbook.questions.map((question) => question.id)).size, 457);
  assert.ok(textbook.questions.every((question) => question.isExercise && /^\d+\.\d+$/.test(question.number)));
  assert.equal(textbook.questions.filter((question) => question.chapterId === "practice-0-overview").length, 3);
  assert.equal(textbook.questions.filter((question) => question.number === "report-6.6").length, 0);
  assert.ok(textbook.pages.every((page) => page.markdown && page.html && Array.isArray(page.sourceLatex)));
  assert.equal(new Set(textbook.pages.map((page) => page.sourcePath)).size, 81);
  assert.ok(textbook.pages.every((page) => !/\bwork\/sections\b|2-3-[123]-linear-|07-02-04-adjacency-multilist/.test(page.sourcePath)));
  assert.ok(textbook.pages.some((page) => page.html.includes("katex")));
  const knowledgeImageTags = textbook.pages.flatMap((page) => [...page.html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]));
  assert.equal(knowledgeImageTags.length, 213);
  assert.ok(knowledgeImageTags.every((tag) => /\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag)));
  assert.ok(knowledgeImageTags.every((tag) => /loading="lazy"/.test(tag) && /decoding="async"/.test(tag)));
  assert.ok(knowledgeImageTags.every((tag) => !/alt="[^"]*<(?:span|math)\b/.test(tag)));
  const condensedIntroduction = textbook.pages.find((page) => page.slug === "01-introduction")?.condensed;
  assert.ok(condensedIntroduction, "the introduction chapter should include its distilled reading version");
  assert.equal(condensedIntroduction.audit.status, "distilled");
  assert.equal(condensedIntroduction.audit.sourceFiles, 5);
  assert.equal(condensedIntroduction.audit.risks, 0);
  assert.match(condensedIntroduction.html, /本章主线/);
  assert.match(condensedIntroduction.html, /textbooks\/data-structures\/condensed\/01-introduction\/assets\/fig-1-7-common-growth-rates\.png/);
  assert.ok(textbook.questions.every((question) => question.prompt.html && question.answer.html !== undefined));
  const assetReferences = [
    ...textbook.pages.flatMap((page) => [page.html, page.condensed?.html || ""]
      .flatMap((html) => [...html.matchAll(/src="([^"]+)"/g)].map((match) => match[1]))),
    ...textbook.questions.flatMap((question) => [question.prompt.html, question.answer.html, ...question.options.map((option) => option.html)]
      .flatMap((html) => [...html.matchAll(/src="([^"]+)"/g)].map((match) => match[1]))),
    ...textbook.questions.flatMap((question) => question.images.map((image) => image.src)),
  ].filter((value) => value.startsWith("/textbooks/"));
  assert.ok(assetReferences.length >= 300);
  assert.ok(assetReferences.every((asset) => fs.existsSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", asset.replace(/^\//, "")))));

  const dynamicStorage = textbook.pages.find((page) => page.slug === "08-dynamic-storage/8-3-boundary-tag-method");
  assert.ok(dynamicStorage, "dynamic storage chapter should include the boundary-tag section");
  assert.match(dynamicStorage.markdown, /typedef struct WORD/);
  assert.match(dynamicStorage.html, /fig-boundary-tag-node\.svg/);
  assert.match(dynamicStorage.html, /fig-8-6\.svg/);
  assert.match(dynamicStorage.html, /算法 8\.1/);
  assert.doesNotMatch(dynamicStorage.html, /完整逐页正文、图题和表项见连续页段转写/);

  const buddySystem = textbook.pages.find((page) => page.slug === "08-dynamic-storage/8-4-buddy-system");
  const garbageCollection = textbook.pages.find((page) => page.slug === "08-dynamic-storage/8-5-garbage-collection");
  assert.match(buddySystem.markdown, /2\^m/);
  assert.match(buddySystem.html, /fig-8-8\.svg/);
  assert.match(garbageCollection.markdown, /void MarkList/);
  assert.doesNotMatch(dynamicStorage.markdown, /# 8\.4 伙伴系统/);

  const chapterIndex = textbook.pages.find((page) => page.slug === "08-dynamic-storage");
  assert.doesNotMatch(chapterIndex.html, /work\/sections/);
  const dynamicStorageCoverage = [
    ["8-1-overview", /PDP-11\/03/, /fig-8-1\.svg/],
    ["8-2-available-space-table-and-allocation", /最差拟合法/, /fig-8-5\.svg/],
    ["8-3-boundary-tag-method", /AllocBoundTag/, /fig-8-7\.svg/],
    ["8-4-buddy-system", /AllocBuddy/, /fig-8-8\.svg/],
    ["8-5-garbage-collection", /MarkList/, /fig-8-11\.svg/],
    ["8-6-storage-compaction", /4 步操作/, /fig-8-13\.svg/],
  ];
  for (const [sectionSlug, bodyEvidence, imageEvidence] of dynamicStorageCoverage) {
    const page = textbook.pages.find((entry) => entry.slug === `08-dynamic-storage/${sectionSlug}`);
    assert.match(page.markdown, bodyEvidence);
    assert.match(page.html, imageEvidence);
    assert.doesNotMatch(page.html, /textbook-missing-image/);
    assert.doesNotMatch(page.markdown, /占位|luna:figure-placeholder/);
    assert.doesNotMatch(page.html, /占位|luna:figure-placeholder/);
  }

  const dynamicSearch = textbook.pages.find((page) => page.slug === "09-search/09-02-dynamic-search");
  assert.match(dynamicSearch.markdown, /pdf_page="261"/);
  assert.match(dynamicSearch.markdown, /Status InsertAVL/);
  assert.match(dynamicSearch.markdown, /void LeftBalance/);

  const indexFile = textbook.pages.find((page) => page.slug === "12-file/12-3-index-file");
  assert.equal(indexFile.source.attributes.pdf_pages, "321-323");
  assert.equal(indexFile.source.attributes.book_pages, "311-313");
  assert.match(indexFile.markdown, /pdf_page="322"/);
  assert.match(indexFile.markdown, /pdf_page="323"/);
  assert.match(indexFile.markdown, /稠密索引/);
  assert.match(indexFile.html, /fig-12-7-lookup-table\.svg/);
});

test("keeps the full textbook dataset out of client bundles", () => {
  const assetsDirectory = fileURLToPath(new URL("../dist/client/assets/", import.meta.url));
  const routeChunk = fs.readdirSync(assetsDirectory).find((name) => /^textbook-progress-.*\.js$/.test(name));
  assert.ok(routeChunk, "the lightweight textbook route/progress chunk should exist");
  const routeChunkPath = path.join(assetsDirectory, routeChunk);
  const routeChunkSource = fs.readFileSync(routeChunkPath, "utf8");
  assert.ok(fs.statSync(routeChunkPath).size < 50_000, "client route helpers must not bundle the full textbook dataset");
  assert.doesNotMatch(routeChunkSource, /data-structures-yan-weimin|book-ds-yan-09-46/);
});

test("mounts structured knowledge visuals at their semantic markers", async () => {
  const response = await render("/knowledge/ds/basic/algorithm");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /data-visual-id="ds-algorithm-growth"/);
  assert.match(html, /输入规模如何放大基本操作次数/);
  assert.match(html, /data-tex-source="O\(\\log n\)"/);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /<!--\s*knowledge-visual:/);
  const bootResponse = await render("/knowledge/os/concepts/concept");
  assert.equal(bootResponse.status, 200);
  const bootHtml = await bootResponse.text();
  assert.match(bootHtml, /data-visual-id="os-boot-computer-timeline"/);
  assert.match(bootHtml, /BOOT SEQUENCE/);
  assert.match(bootHtml, /BIOS \/ UEFI/);
  assert.match(bootHtml, /启动系统服务和守护进程/);
  const environmentResponse = await render("/knowledge/os/concepts/environment");
  assert.equal(environmentResponse.status, 200);
  const environmentHtml = await environmentResponse.text();
  assert.match(environmentHtml, /data-visual-id="os-privilege-switch-timeline"/);
  assert.match(environmentHtml, /CPU 当前特权集/);
  assert.match(environmentHtml, /PCB：保存 \/ 恢复现场/);
  assert.match(environmentHtml, /data-visual-id="os-dynamic-runtime-loading-trace"/);
  const structureResponse = await render("/knowledge/os/concepts/structure");
  assert.equal(structureResponse.status, 200);
  const structureHtml = await structureResponse.text();
  assert.match(structureHtml, /data-visual-id="os-kernel-architecture-stacks"/);
  assert.match(structureHtml, /macOS \/ iOS 的 XNU、Windows NT 家族/);
  assert.match(structureHtml, /data-visual-id="os-hypervisor-type-stacks"/);
  assert.match(structureHtml, /Type 2 Hypervisor \/ VMM/);
  const processThreadResponse = await render("/knowledge/os/process/process_thread");
  assert.equal(processThreadResponse.status, 200);
  const processThreadHtml = await processThreadResponse.text();
  assert.match(processThreadHtml, /data-visual-id="os-parent-child-process-family"/);
  assert.match(processThreadHtml, /父子进程与回收场景/);
  assert.match(processThreadHtml, /僵尸：子已退出，父尚未回收/);
  assert.match(processThreadHtml, /data-visual-id="os-ipc-methods-comparison"/);
  assert.match(processThreadHtml, /IPC 方式怎么选/);
  assert.match(processThreadHtml, /href="\/knowledge\/co\/cpu\/multicore"/);
});

test("keeps visualization specs and LaTeX sources auditable in generated data", () => {
  const knowledge = JSON.parse(fs.readFileSync(new URL("../app/data/knowledge.json", import.meta.url), "utf8"));
  const pages = Object.values(knowledge.subjects).flatMap((subject) => subject.pages);
  const visuals = pages.flatMap((page) => page.visualizations);
  if (knowledgeSourceRoot) {
    assert.ok(fs.existsSync(knowledgeSourceRoot), `Knowledge source directory does not exist: ${knowledgeSourceRoot}`);
    const expectedVisualCount = ["data_structure", "constitution_principle", "operating_system", "computer_network"]
      .map((directory) => JSON.parse(fs.readFileSync(path.join(knowledgeSourceRoot, directory, "_visualizations.json"), "utf8")))
      .reduce((count, manifest) => count + manifest.visualizations.length, 0);
    assert.equal(visuals.length, expectedVisualCount);
  } else {
    assert.ok(visuals.length > 0, "generated knowledge data should include visualization specs");
  }
  const supportedTypes = new Set([
    "growth-curves", "algorithm-trace", "memory-scale", "process-flow",
    "state-machine", "timeline", "comparison", "address-fields",
    "banker-simulator", "resource-allocation-graph", "semaphore-lab",
    "scheduler-queue", "concurrency-lab",
  ]);
  assert.ok(visuals.every((visual) => supportedTypes.has(visual.type)));
  for (const page of pages) {
    assert.ok(Array.isArray(page.sourceLatex));
    assert.doesNotMatch(
      page.html,
      /href="https?:\/\/(?:www\.)?csgraduates\.com\/(?:data_structure|constitution_principle|operating_system|computer_network)(?:\/|")/i,
      "local knowledge page still points at the external mirror",
    );
    const markerIds = [...page.html.matchAll(/<!--\s*knowledge-visual:([a-z0-9-]+)\s*-->/g)].map((match) => match[1]);
    assert.deepEqual(markerIds, page.visualizations.map((visual) => visual.id));
    for (const visual of page.visualizations) {
      assert.ok(Array.isArray(visual.sourceLatex));
      assert.equal(typeof visual.formulaHtml, "object");
      for (const latex of visual.sourceLatex) {
        assert.match(page.sourceLatex.join("\n"), new RegExp(latex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
        assert.match(visual.formulaHtml[latex], /katex/);
      }
    }
  }
});

test("orders local knowledge children by the parent outline and keeps OS structure renderable", () => {
  const knowledge = JSON.parse(fs.readFileSync(new URL("../app/data/knowledge.json", import.meta.url), "utf8"));
  const pages = knowledge.subjects.os.pages;
  const position = (slug) => pages.findIndex((page) => page.slug === slug);
  assert.ok(position("concepts/concept") < position("concepts/environment"));
  assert.ok(position("concepts/environment") < position("concepts/structure"));
  assert.ok(position("process/process_thread") < position("process/scheduling"));
  assert.ok(position("process/scheduling") < position("process/sync"));
  assert.ok(position("process/sync") < position("process/problem"));
  assert.ok(position("process/problem") < position("process/deadlock"));
  const environment = pages.find((page) => page.slug === "concepts/environment");
  const structure = pages.find((page) => page.slug === "concepts/structure");
  const concept = pages.find((page) => page.slug === "concepts/concept");
  const deadlock = pages.find((page) => page.slug === "process/deadlock");
  const problem = pages.find((page) => page.slug === "process/problem");
  const processThread = pages.find((page) => page.slug === "process/process_thread");
  const scheduling = pages.find((page) => page.slug === "process/scheduling");
  const sync = pages.find((page) => page.slug === "process/sync");
  const root = pages.find((page) => !page.slug);
  assert.match(environment.html, /<table>/);
  assert.equal(environment.visualizations.find((visual) => visual.id === "os-privilege-switch-timeline")?.config.layout, "privilege-switch");
  assert.equal(environment.visualizations.find((visual) => visual.id === "os-relocatable-loading-trace")?.config.layout, "loading-trace");
  assert.equal(environment.visualizations.find((visual) => visual.id === "os-dynamic-runtime-loading-trace")?.config.layout, "loading-trace");
  assert.equal(structure.visualizations.find((visual) => visual.id === "os-kernel-architecture-stacks")?.config.layout, "layered-stacks");
  assert.equal(structure.visualizations.find((visual) => visual.id === "os-hypervisor-type-stacks")?.config.layout, "layered-stacks");
  assert.match(concept.html, /<!--\s*knowledge-visual:os-boot-computer-timeline\s*-->/);
  assert.equal(concept.visualizations.find((visual) => visual.id === "os-boot-computer-timeline")?.type, "process-flow");
  assert.match(deadlock.html, /<details class="knowledge-code-details">/);
  assert.match(deadlock.html, /<!--\s*knowledge-visual:os-banker-safety-simulator\s*-->/);
  assert.match(deadlock.html, /<!--\s*knowledge-visual:os-resource-allocation-graph\s*-->/);
  assert.match(problem.html, /<!--\s*knowledge-visual:os-producer-consumer-semaphore-lab\s*-->/);
  assert.match(problem.html, /<!--\s*knowledge-visual:os-dining-asymmetric-semaphore-lab\s*-->/);
  assert.doesNotMatch(problem.html, /inline-svg-06\.svg/);
  assert.equal(processThread.visualizations.find((visual) => visual.id === "os-parent-child-process-family")?.config.layout, "process-family");
  assert.equal(processThread.visualizations.find((visual) => visual.id === "os-ipc-methods-comparison")?.type, "comparison");
  assert.match(processThread.html, /<!--\s*knowledge-visual:os-parent-child-process-family\s*-->/);
  assert.match(processThread.html, /<!--\s*knowledge-visual:os-ipc-methods-comparison\s*-->/);
  assert.match(processThread.html, /href="\/knowledge\/co\/cpu\/multicore"/);
  assert.match(processThread.html, /href="\/knowledge\/os\/memory\/concepts"/);
  assert.equal(scheduling.visualizations.find((visual) => visual.id === "os-scheduling-rr-timeline")?.type, "scheduler-queue");
  assert.equal(scheduling.visualizations.find((visual) => visual.id === "os-scheduling-mlfq-queue")?.type, "scheduler-queue");
  assert.equal(sync.visualizations.find((visual) => visual.id === "os-sync-lost-update-lab")?.type, "concurrency-lab");
  assert.equal(sync.visualizations.find((visual) => visual.id === "os-sync-semaphore-applications-lab")?.type, "concurrency-lab");
  assert.match(scheduling.html, /id="调度的实现"/);
  assert.match(sync.html, /id="为何需要互斥"/);
  assert.match(root.html, /href="\/knowledge\/os\/concepts"/);
  assert.match(root.html, /href="\/knowledge\/os\/process"/);
  assert.match(root.html, /href="\/knowledge\/co\/storage"/);
  assert.match(root.html, /href="\/knowledge\/co\/bus"/);
  for (const page of pages) {
    assert.doesNotMatch(page.html, /<a href="(?:\.\/|\.\.\/)/, `${page.slug || "root"} still has a relative knowledge link`);
  }
  for (const page of pages) {
    assert.doesNotMatch(
      page.html,
      /href="https?:\/\/(?:www\.)?csgraduates\.com\/(?:data_structure|constitution_principle|operating_system|computer_network)(?:\/|")/i,
      "local knowledge page still points at the external mirror",
    );
  }
});

test("opens a knowledge page's complete local question batch", async () => {
  const response = await render("/subject/ds?view=questions&knowledge=linearlist%2Fsequential");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /相关真题/);
  assert.match(html, /顺序表示/);
  assert.match(html, /6(?:<!-- -->)? 道/);
  for (const questionId of ["real-2013-41", "real-2025-41", "real-2023-1", "real-2010-42", "real-2020-41", "real-2018-41"]) {
    assert.match(html, new RegExp(`/question/${questionId}`));
  }
});

test("keeps imported knowledge illustrations locally renderable", () => {
  const projectRoot = fileURLToPath(new URL("..", import.meta.url));
  const knowledge = JSON.parse(fs.readFileSync(new URL("../app/data/knowledge.json", import.meta.url), "utf8"));
  let localImageCount = 0;
  for (const subject of Object.values(knowledge.subjects)) {
    for (const page of subject.pages) {
      for (const match of page.html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)) {
        const source = decodeURIComponent(match[1]);
        if (!source.startsWith("/knowledge/")) continue;
        assert.doesNotMatch(match[0], /\balt=""/, `knowledge illustration needs descriptive alt text: ${source}`);
        localImageCount += 1;
        const asset = path.join(projectRoot, "public", source.slice(1));
        assert.ok(fs.existsSync(asset), `missing knowledge illustration: ${source}`);
        if (asset.endsWith(".svg")) {
          const svg = fs.readFileSync(asset, "utf8");
          assert.doesNotMatch(svg, /<foreignObject\b|&nbsp;/i, `unsanitized knowledge SVG: ${source}`);
        }
      }
    }
  }
  assert.ok(localImageCount >= 400, `expected the curated local illustration set, found ${localImageCount}`);
});

test("renders imported LaTeX as accessible math instead of raw delimiters", () => {
  const knowledge = JSON.parse(fs.readFileSync(new URL("../app/data/knowledge.json", import.meta.url), "utf8"));
  const html = Object.values(knowledge.subjects).flatMap((subject) => subject.pages.map((page) => page.html)).join("\n");
  assert.ok((html.match(/knowledge-math-inline/g) || []).length >= 650);
  assert.ok((html.match(/knowledge-math-block/g) || []).length >= 90);
  assert.equal((html.match(/knowledge-math-legacy/g) || []).length, 0);
  assert.doesNotMatch(html, /\\\\\(|\\\\\)|\$\$/);
  assert.doesNotMatch(html, /katex-error/);
});

test("renders a single-question route", async () => {
  const response = await render("/question/real-2026-23");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2026 年 408 操作系统 · 第 23 题/);
  assert.match(html, /下列操作中，在内核模式执行的是/);
  assert.match(html, /请选择答案/);
  assert.match(html, /提交并查看解析/);
  assert.match(html, /作答解析/);
  assert.match(html, /知识点/);
  assert.match(html, /类似题/);
  assert.match(html, /answer-closed/);
  assert.match(html, /question-annotation-surface/);
  assert.match(html, /data-study-annotatable="true"/);
  assert.doesNotMatch(html, /答案与解析/);
  assert.doesNotMatch(html, /关联知识点/);
});
