---
name: review-408-page-by-url
description: 根据 localhost:3001 或本地考研 408 网站的知识页、科目题库页链接，确定性定位对应的原始 Markdown、assets、科目 `_visualizations.json` spec、导入器与渲染组件，并按人工反馈做单页保真审校。用于用户粘贴 `/knowledge/ds/...`、`/knowledge/co/...`、`/knowledge/os/...`、`/knowledge/cn/...` 或带 `knowledge=` 的 `/subject/...` 链接，要求快速找到源文件、修复公式/排版/图示/动画、重新导入并在同一网页验收的场景；禁止直接编辑生成的 knowledge JSON 或 public 副本。
---

# 按链接审校 408 页面

把用户给出的网页链接当作唯一入口。先确定性解析，再查看页面和修改源文件，不凭标题猜路径。

## 1. 解析链接

在网站项目根目录运行：

```bash
node .codex/skills/review-408-page-by-url/scripts/resolve-page.mjs '<网页链接>'
```

需要给其他工具消费时加 `--json`。脚本必须返回：科目、slug、原始 `index.md`、assets、科目可视化清单及匹配 spec、生成数据、导入器、页面渲染组件和建议验收 URL。

若脚本报告源 Markdown 不存在，停止修改并核对链接；不得转而编辑 `app/data/knowledge.json`、`app/data/knowledge-index.json` 或 `public/knowledge`。

详细路由映射与文件职责见 [references/route-map.md](references/route-map.md)。

## 2. 建立单页上下文

1. 用浏览器打开用户给出的原链接，查看顶部、中部、底部、公式、图片和交互。
2. 完整阅读脚本定位的 `index.md`，不要只读出问题的几行。
3. 查看同目录 `assets/` 和科目 `_visualizations.json` 中 `route` 等于当前 slug 的 spec。
4. 若用户指出知识错误或缺漏，再查考纲、本地真题映射和相邻章节；不要编造年份、频率或分值。
5. 同时遵守 `$preserve-408-markdown` 与 `$repair-408-knowledge-pages` 的保真、LaTeX、图示和站内练习规则。

## 3. 按人工反馈修改

- 正文、公式、表格和图片说明只改原始 Markdown。
- 页面专属交互数据改本科 `_visualizations.json`，并在 Markdown 的语义位置保留唯一 `knowledge-visual` marker。
- 页面专属精确图放在相邻 `assets/`；优先 SVG/HTML/CSS，不用带错误文字的生成图。
- 只有多个页面共享的渲染能力不足时，才改 `KnowledgeVisual.tsx` 或公共样式，并说明影响范围。
- 保留人工未要求删除的定义、推导、例题、表格和有效图片；纠错时用更准确内容等量替换。
- 连续 4 步以上的数字、数组、队列、页框、拍次、窗口或输入/工作区/输出过程，应保留原表并做成可前进、后退、直接选步的交互轨迹。

## 4. 单页验收

修改后按顺序执行：

1. 对本科运行原文保真审计与 source-only 审计。
2. 运行可视化清单审计，确保 spec、marker、`sourceLatex` 一一对应。
3. 全部源文件稳定后运行一次 `npm run knowledge:408`，不要在每个小补丁后反复导入。
4. 运行 lint、相关测试和生产构建。
5. 刷新用户原链接，检查桌面与窄屏、公式渲染、长表/图片溢出、交互键盘操作和控制台错误。

## 5. 回报格式

先给出修复结果，再列出可点击的绝对路径：

- 原始 Markdown；
- 相邻资源目录；
- 当前页面匹配的可视化清单/spec；
- 如有必要，共享渲染文件；
- 原链接和最终验收状态。

明确说明是否改了共享代码、是否重新导入、哪些审计通过，以及仍需人工判断的知识问题。
