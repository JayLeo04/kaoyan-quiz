import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

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
  assert.match(html, /登录 \/ 注册/);
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
  assert.match(html, /\/subject\/ds\?view=questions(?:&|&amp;)knowledge=linearlist%2Fsequential/);
  assert.match(html, /\/knowledge\/ds\/linearlist\/sequential\/assets\/inline-svg-01\.svg/);
});

test("mounts structured knowledge visuals at their semantic markers", async () => {
  const response = await render("/knowledge/ds/basic/algorithm");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /data-visual-id="ds-algorithm-growth"/);
  assert.match(html, /输入规模如何拉开复杂度差距/);
  assert.match(html, /data-visual-id="ds-algorithm-space"/);
  assert.match(html, /data-tex-source="O\(\\log n\)"/);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /<!--\s*knowledge-visual:/);
});

test("keeps visualization specs and LaTeX sources auditable in generated data", () => {
  const knowledge = JSON.parse(fs.readFileSync(new URL("../app/data/knowledge.json", import.meta.url), "utf8"));
  const pages = Object.values(knowledge.subjects).flatMap((subject) => subject.pages);
  const visuals = pages.flatMap((page) => page.visualizations);
  assert.equal(visuals.length, 15);
  const supportedTypes = new Set([
    "growth-curves", "algorithm-trace", "memory-scale", "process-flow",
    "state-machine", "timeline", "comparison", "address-fields",
  ]);
  assert.ok(visuals.every((visual) => supportedTypes.has(visual.type)));
  for (const page of pages) {
    assert.ok(Array.isArray(page.sourceLatex));
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
  assert.doesNotMatch(html, /答案与解析/);
  assert.doesNotMatch(html, /关联知识点/);
});
