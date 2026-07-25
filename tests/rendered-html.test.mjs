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
  assert.match(html, /今天，/);
  assert.match(html, /刷到会/);
  assert.match(html, /数据结构/);
  assert.match(html, /计算机组成原理/);
  assert.match(html, /216 道真题/);
  assert.match(html, /计算机网络/);
  assert.match(html, /共 (?:<!-- -->)?222(?:<!-- -->)? 道/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("renders a single-question route", async () => {
  const response = await render("/question/real-2026-23");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2026 年 408 操作系统 · 第 23 题/);
  assert.match(html, /下列操作中，在内核模式执行的是/);
  assert.match(html, /请选择答案/);
  assert.match(html, /核对答案/);
  assert.doesNotMatch(html, /答案与解析/);
  assert.match(html, /关联知识点/);
});
