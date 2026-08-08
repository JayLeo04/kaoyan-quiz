# 408 教材知识提炼示例

本目录展示 `$distill-408-textbook-knowledge` 的真实章级产物，而不是手写格式样板。

- [`01-introduction/index.md`](./01-introduction/index.md)：可直接复习的 Obsidian 风格知识页。
- [`01-introduction/review.json`](./01-introduction/review.json)：逐文件、逐标题的删减与覆盖审计。
- [`audits/01-introduction-source-map.json`](./audits/01-introduction-source-map.json)：示例章输入范围与来源映射。
- `01-introduction/assets/`：正文实际引用的本地教学图片。

当前示例来自严蔚敏《数据结构（C 语言版）》第 1 章，5 个正式 Markdown 文件和 22 个源标题均已登记；章节校验、审计 Schema 与 441 文件来源锁检查通过。

## 前端接入约定

目录路径就是教材页面 slug：`<page-slug>/index.md` 会作为同路径教材页的“精简版”，并要求同目录存在状态为 `distilled` 的 `review.json`。例如：

```text
01-introduction/index.md
01-introduction/review.json
01-introduction/assets/*
```

运行 `npm run textbook:ds` 后，导入器会把精简正文挂到对应教材页的 `condensed` 字段，并把图片发布到 `public/textbooks/data-structures/condensed/`。没有精简稿的页面继续使用教材原文；前端只在已有双版本的页面显示切换控件。
