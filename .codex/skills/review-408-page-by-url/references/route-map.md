# 408 页面链接与文件映射

## 科目映射

| URL 科目 | 源目录 |
| --- | --- |
| `ds` | `local/kaoyanzahuopu/data_structure` |
| `co` | `local/kaoyanzahuopu/constitution_principle` |
| `os` | `local/kaoyanzahuopu/operating_system` |
| `cn` | `local/kaoyanzahuopu/computer_network` |

网站项目为 `kaoyan-quiz/`，原始知识库位于其父目录的 `local/kaoyanzahuopu/`。

## 支持的链接

- `/knowledge/<subject>` → 本科根 `index.md`
- `/knowledge/<subject>/<slug...>` → 本科 `<slug...>/index.md`
- `/subject/<subject>?view=questions&knowledge=<slug>` → 对应知识点 `index.md`

示例：

`http://localhost:3001/knowledge/co/overview/performance`

映射为：

`local/kaoyanzahuopu/constitution_principle/overview/performance/index.md`

## 文件职责

- `index.md`：正文、LaTeX、表格、图片说明、交互插入位置的事实源。
- `assets/`：该页本地图片与确定性 SVG。
- `<subject>/_visualizations.json`：该科交互 spec；以 `route` 精确匹配 slug。
- `scripts/import-408-knowledge.mjs`：唯一导入器。
- `app/data/knowledge.json`、`app/data/knowledge-index.json`、`public/knowledge`：生成物，只读。
- `11408/materials/2025-408考研大纲.md`：内容边界。
- `11408/references/tag_knowledge_map.json` 与 `app/data/questions.json`：知识点和本地真题证据。
- `app/components/KnowledgeWorkspace.tsx`：marker 挂载和页面正文容器。
- `app/components/knowledge-visuals/KnowledgeVisual.tsx`：共享交互渲染器。
- `app/globals.css`：共享知识页视觉与响应式样式。

## 异常处理

- URL 解码后的 slug 必须拒绝 `..`、`.` 和反斜线，防止越过学科目录。
- 源页不存在时先检查 URL、生成索引和相邻目录；不得创建猜测路径。
- 同一 slug 有多个可视化 spec 时全部返回，不只取第一个。
- `/subject` 链接缺少 `knowledge` 参数时只能定位科目目录，不能猜某篇知识页。
