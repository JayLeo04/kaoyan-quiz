# Markdown 与来源规范

## 页面与目录

优先把一个可独立学习的章节/小节放进一个目录，并使用 `index.md`。父级页面按书内目录顺序链接子页。标题层级只表达真实层级：

```md
<!-- luna:source pdf_pages="12-14" book_pages="8-10" -->
# 2 线性表

## 2.1 线性表的类型定义

### 顺序表示
```

`#` 只用于页面主标题；不要跳过标题级别，也不要用连续加粗行模拟标题。标题内容必须来自目录或正文。

## 习题集模式：先 Markdown，后题目索引

题集、习题集、学习指导和答案/提示分篇的书使用 `exercise-book` 模式。题目页和答案页必须先分别完整转写为 Markdown；`questions/*.json` 只是从 Markdown 提取的派生索引，不是源稿。

推荐目录：

```text
<book-root>/
├─ index.md
├─ part-1-questions/<chapter-slug>/index.md
├─ part-2-practice/<practice-slug>/index.md
├─ part-3-answers/<answer-section-slug>/index.md
├─ questions/<chapter-or-practice-id>.json
└─ assets/py/fig-<stable-id>.svg
```

题目 Markdown 保留原题号和题型；答案/提示 Markdown 保留原题号、答案范围和“提示/解答”性质。两边均写 `luna:source`，不得因为题目与答案分离而把答案提前复制到题目源稿。

结构化题目记录必须能双向回溯：

```json
{
  "id": "book-ds-yan-01-10",
  "source": {
    "question": {"markdown": "part-1-questions/01-introduction/index.md", "anchor": "1.10", "pdfPages": [14], "bookPages": [9]},
    "answer": {"markdown": "part-3-answers/chapter-1/index.md", "anchor": "1.10", "pdfPages": [186], "bookPages": [181]}
  },
  "answer": {"status": "provided", "origin": "book", "original": "..."}
}
```

`answer.status` 使用 `provided`、`hint-only`、`missing` 或 `pending-review`；`answer.origin` 使用 `book`、`verified`、`book+verified` 或 `missing`。原书答案和后续核验答案分字段保存，核验内容不得覆盖原书内容。没有答案时存 `missing`，不得用空字符串或模型推导内容伪装成原书答案。

## 正文保真

- 完整保留定义、性质、条件、反例、推导、算法步骤、复杂度、例题和总结。可以把散乱版面重排成段落、列表、表格和代码块，但不能把完整论证压成一句总结。
- 公式保持原有意义和变量关系，优先写成完整定界 LaTeX。公式旁边的编号、条件和单位不要丢失。
- C/C++ 代码放入带语言的 fenced code block；保持标识符、括号、指针、数组下标、循环边界和缩进。页面无法确定时使用 review 标记，不按常见写法猜补。
- 表格使用真正的 Markdown 表格。若原表跨页，结合相邻页面重建表头、单位、合并单元格语义和行列方向。
- 页眉、页脚、重复书名、页面噪声和纯装饰线可去除；任何会影响定义、推导、代码、题注或图意的文字都必须保留。

## 图片

最终正文中的每一张教学图片应形如：

```md
![带头结点的单链表结构](assets/py/fig-linked-list-head.svg)
```

图片必须来自 Python 生成器，推荐 SVG；复杂或需要像素兼容时可用 PNG。不要引用 PDF 截图、`page-*.png`、base64 或远程 URL。图片 alt 应说明图展示的内容，而不是写“图片”或留空。图片中的标签只承载短标识，长解释放在正文。

## 不确定内容

页面仍无法确定时使用可检索的标记：

```md
<!-- luna:review page="137" kind="formula" reason="下标可能为 i 或 j" -->
```

标记必须同时给出 PDF 页码、类型和原因。最终验收前逐个回看页面并删除标记；不能确认时把该页列入未完成清单，不能发布一个看似完整但未经确认的答案。

## 现有知识库接入

当前仓库的导入器默认从项目根目录的上级 `../local/kaoyanzahuopu/data_structure/` 读取源稿，并读取每个 `index.md` 和同目录 `assets/`。源稿变更后才运行 `npm run knowledge:408 -- --subject ds`；不要直接改 `app/data/knowledge.json`、`app/data/knowledge-index.json` 或 `public/knowledge/ds/`。如果新增交互可视化，另行遵循项目现有 `_visualizations.json` 与 marker 契约；本 skill 默认只产出静态 Python 重绘图。
