import assert from "node:assert/strict";
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
  assert.match(html, /四科题库/);
  assert.match(html, /选择科目，进入题库/);
  assert.match(html, /登录 \/ 注册/);
  assert.match(html, /数据结构/);
  assert.match(html, /计算机组成原理/);
  assert.match(html, /216/);
  assert.match(html, /计算机网络/);
  assert.doesNotMatch(html, /刷到会/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("protects account progress for signed-out visitors", async () => {
  const response = await render("/api/progress");
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "请先登录" });
});

test("renders a paginated subject library", async () => {
  const response = await render("/subject/os");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /操作系统/);
  assert.match(html, /216/);
  assert.match(html, /第 (?:<!-- -->)?1(?:<!-- -->)? \/ (?:<!-- -->)?27(?:<!-- -->)? 页/);
  assert.match(html, /下一页/);
});

test("renders a single-question route", async () => {
  const response = await render("/question/real-2026-23");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2026 年 408 操作系统 · 第 23 题/);
  assert.match(html, /下列操作中，在内核模式执行的是/);
  assert.match(html, /请选择答案/);
  assert.match(html, /提交并查看解析/);
  assert.doesNotMatch(html, /答案与解析/);
  assert.doesNotMatch(html, /关联知识点/);
});
