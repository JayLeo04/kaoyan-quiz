---
name: luna-multimodal-rewrite
description: 直接使用当前模型的多模态能力读取中文数据结构教材或习题集 PDF/页面图，并将文字、版式、公式、C 代码、表格、例题、题目、答案/提示和图示重写为层级清晰、来源可追溯的 Markdown；习题集必须先完成按章节/小节的完整 Markdown 转写，再从题目 Markdown 与答案 Markdown 二次提取结构化题目。所有教学图片使用 Python 重绘，并按非重叠页段委派子代理完成分批重写、图片生成、题目答案回链和最终验收。
---

# LUNA 多模态重写

把原始 PDF 或页面图直接作为视觉输入交给当前模型。模型先理解页面中的阅读顺序、层级、公式、代码、表格和图示，再写来源 Markdown。教材模式可以直接把 Markdown 作为最终知识源；习题集模式必须把 Markdown 作为唯一事实源，待题目正文与答案/提示正文全部转写、合并和审计后，才生成题目 JSON 等派生数据。

## 运行模式

- `textbook`：用于教材、讲义和知识章节。按目录叶子节点转写正文，图示重绘后直接接入知识库。
- `exercise-book`：用于题集、习题集、学习指导、实习题、答案或提示与题目分册/分篇的书。先完整转写所有题目、答案/提示、实习题和附录 Markdown，再做题目—答案回链和结构化提取。
- 当书名或目录出现“习题集、题集、基础知识题、算法设计题、实习题、部分习题解答/提示”等内容时，强制使用 `exercise-book`，不得沿用只转写题目页的教材流程。
- 两种模式都必须保留原书内容和来源页；模式差异只决定 Markdown 的组织方式和后续派生数据的时机。

## 不可破坏的约束

- 直接阅读原始页面，不把 OCR 文本、搜索摘要或代理摘要当作事实源。页面视觉信息、目录和正文是唯一输入依据；`exercise-book` 的章节 Markdown 是后续题目提取的唯一事实源。
- 完整保留定义、性质、证明/推导、边界条件、复杂度、C 代码、表格、例题、题注、公式和页码；只重排版式，不摘要、不编造、不用常识替换页面内容。
- 公式保留为完整的 `$...$` 或 `$$...$$`；代码使用带语言的 fenced code block；表格使用真正的 Markdown 表格。公式、代码和表格必须从页面直接读出并放回正文。
- 所有有教学意义的图片都要重绘。禁止把页面截图或原图直接放进最终 Markdown；使用 `scripts/render_ds_diagram.py` 或同等 Python 代码生成 `assets/py/` 下的 SVG/PNG。
- 每个 Markdown 页面保留来源注释，例如 `<!-- luna:source pdf_pages="12-13" book_pages="8-9" -->`，并保持章节、子节和目录顺序。
- `exercise-book` 必须先完成完整 Markdown 阶段，再生成 `questions/*.json`。题目 JSON 是派生索引，不得替代题目页、答案页或提示页；不得只凭题目页或只凭答案页生成记录。
- 题目与答案即使在 PDF 中分离，也必须在 Markdown 中分别保留；结构化记录同时保存 `question` 来源、`answer` 来源、Markdown 路径、PDF 页码和书内页码。原书没有答案时明确标记缺失，不用推导答案冒充原书答案。
- 先修改源 Markdown 与 Python 生成器，再运行导入器；不要直接编辑 `app/data/knowledge*.json` 或 `public/knowledge/**` 等生成物。当前仓库的导入器默认从项目根目录的上级 `../local/kaoyanzahuopu/data_structure/` 读取源稿。

## 工作流

### 1. 准备页面输入

1. 确认 PDF、目标章节/页码、输出根目录，以及书内页码和 PDF 页码的关系。先看目录页或书签，再用页面图核对章节边界。
2. `exercise-book` 先在 `manifest.json` 中登记书内目录、题目篇、实习题篇、答案/提示篇、附录、各篇页码范围和 PDF/书内页码偏移；答案篇的页码范围必须独立记录，不能假定答案紧跟题目。
3. 如果需要把 PDF 拆成可并行输入的页面图，只运行 `scripts/prepare_book_pages.py`。它只负责渲染页面和写页码清单，不读取或生成正文。
4. 以目录叶子节点建立稳定章节 ID。每个批次处理连续 4–8 页，边界携带前后各 1 页作为视觉上下文；重叠页只用于判断跨页边界，合并时不得重复。

### 2. 完整 Markdown 转写

1. 把页面图直接附给模型，要求模型先观察整页布局，再一次性输出该页段的 Markdown。不要先拆成独立文本任务，也不要把页面之外的文本输入当作事实源。
2. 让模型在页面内恢复标题层级：`#` 页面主标题，`##` 一级节，`###` 二级节，`####` 仅用于确有必要的算法步骤、性质或例题。不要把独立小节伪装成加粗段落。
3. 对跨页标题、段落、列表、代码和表格，结合相邻页面视觉上下文直接合并；去除重复页眉/页脚，但保留页码来源注释。
4. 模型无法从页面确定字符、公式、代码或箭头时，先放大并重新查看原页；仍无法确定才写 `luna:review` 标记，说明页码、区域和原因。不得凭常识猜补。

#### `exercise-book` 的转写顺序

1. 先转写题目篇：按篇、章、小节保存完整题目 Markdown，保留题号、题型标题、题干、选项、表格、代码、插图、作业要求和原书小节顺序。
2. 再转写答案/提示篇：按原书答案/提示的目录和页码保存完整 Markdown。答案页即使只给出部分题号、只有提示、或跨页续写，也必须原样保留，并在标题或正文中明确“答案/提示”。
3. 实习题、附录和学习指导也先进入 Markdown 阶段；不要因为暂时无法映射到题目 JSON 就跳过。
4. 每个题号在题目 Markdown 中有稳定标题或锚点；答案/提示 Markdown 中保留原题号。若原书题号重复、跳号或跨篇使用，保留原样并在 `manifest.json` 中增加局部范围，不擅自重编号。
5. 题目 Markdown 与答案 Markdown 可以放在不同目录，但必须分别带 `luna:source` 注释。页面交界、跨页代码、跨页表格和答案续页必须用前后页视觉上下文核对。
6. 这一阶段只产出完整 Markdown、图形资源和 `review.json`；禁止提前生成“看起来完整”的题目 JSON 或把模型推导答案写回原书答案段。

### 3. 题目—答案回链与结构化提取

只在相关题目篇、答案/提示篇和实习题篇的 Markdown 已完成并通过第一轮页面审计后执行。

1. 建立题目索引：每道题使用稳定 `id`，保存原书题号、篇/章/小节、题型、难度（若来源明确）、推荐标记（若来源明确）和 `knowledgeIds`。`knowledgeIds` 必须指向已有知识页或在审计中列为待补，不得用标签代替唯一知识关联。
2. 为每条记录分别保存 `source.question` 和 `source.answer`：两者都包含 Markdown 文件、章节锚点（或稳定标题）、PDF 页码和书内页码。答案缺失时保留 `answer.status="missing"`，不要创建空字符串伪装为已解答。
3. 原书答案与核验答案分开：
   - `answer.original`：逐字保留答案/提示 Markdown 中可定位的内容；
   - `answer.verified`：只有经过独立推导或审计才填写，并说明依据；
   - `answer.origin`：`book`、`verified`、`book+verified` 或 `missing`。
   任何“修正原书错误”的内容不得覆盖 `answer.original`。
4. 从 Markdown 提取题干、选项、代码和公式时只做结构化搬运，不改变数学意义和原书措辞；无法确定的字符、答案范围或题号映射进入 `review.flags`。
5. 结构化提取完成后反向校验：每个题目 ID 都能回到题目 Markdown，每个非缺失答案都能回到答案/提示 Markdown，每个图片引用都能回到同一书源目录下的 Python 生成资源。
6. 题目 JSON 是导入器输入的派生物；任何 Markdown 修订都必须重新提取或重新校验题目 JSON，不能只改 JSON 绕过源稿。

### 4. 并行委派

有多代理能力时，按 [references/delegation-protocol.md](references/delegation-protocol.md) 派发互不覆盖的页段。建议并行安排目录/页码规划、章节 Markdown 直写、图片重绘和独立内容审计；每个代理只接收自己的页面图和必要的重叠页，写入独立目录并返回短审计报告。

在 `exercise-book` 模式中，题目篇和答案/提示篇是两个独立的 Markdown 写入范围；先分别完成并审计，再派发题目—答案链接器生成 JSON。链接器不得用自己的常识补答案，也不得在源 Markdown 未完成时提前提取。

主代理负责最终合并、排序和验收。没有子代理工具时，在本地按同一页段契约执行；不要为了省上下文而删掉正文、公式、代码、表格或图片。

### 5. Python 重绘图片

1. 模型直接看原图后，为每张教学图片建立简短 spec：图号、来源页、节点/边/数组/地址/步骤、方向、标签和正文结论。
2. 使用 `scripts/render_ds_diagram.py --spec <json> --output <assets/py/fig-id.svg>` 生成图。图中只放理解关系所需的短标签，长解释放正文；同一张图不能成为唯一信息来源。
3. 生成后检查标签、箭头方向、空指针/边界、下标和最终状态。图片使用准确 alt 和相对路径；不确定的图停止发布，保留 `luna:review`，禁止用截图兜底。

### 6. 合并与验收

1. 按目录顺序合并章节，去除重叠页重复段落、标题和图片，保留每一页的来源注释。
2. 先运行 `scripts/validate_book_markdown.py --root <输出根目录> --report <输出根目录>/luna-audit.json`。正式交付不允许缺来源注释、空 alt、失效本地图片、外部图片、未闭合代码围栏、疑似乱码或未处理的 `luna:review`。
3. `exercise-book` 再运行题目派生物校验：题目 ID 唯一；题号与原书一致；题目/答案 Markdown 路径和锚点存在；PDF 页码在 manifest 范围内；缺失答案显式标记；`answer.original` 不为空时必须能回溯到答案篇；知识点 ID 存在或列入待补清单；题目和答案的图片、代码、公式没有被提取器截断。
4. 只有 Markdown 审计和题目—答案回链审计都通过后，才运行导入器、测试和构建。若输出接入当前知识库，源稿稳定后再运行 `npm run knowledge:408 -- --subject ds`；浏览器检查正文、公式、表格、Python 图、窄屏溢出和章节导航。
5. 交付时报告源 PDF 与页段、完整 Markdown 覆盖率、重绘图、题目 JSON 数量、未完成页面数、答案缺失数、审计报告路径和实际运行过的命令。

## 输出契约

```text
<book-root>/
├─ manifest.json
├─ index.md
├─ part-1-questions/
│  ├─ index.md
│  └─ <chapter-slug>/index.md
├─ part-2-practice/
│  ├─ index.md
│  └─ <practice-slug>/index.md
├─ part-3-answers/
│  ├─ index.md
│  └─ <answer-section-slug>/index.md
├─ questions/
│  └─ <chapter-or-practice-id>.json
├─ assets/
│  └─ py/
│     └─ fig-<stable-id>.svg
└─ luna-audit.json
```

教材模式可以省略 `part-*` 和 `questions/`，直接按章节建立 `<chapter-slug>/index.md`。`exercise-book` 必须保留题目篇、实习题篇和答案/提示篇的完整 Markdown；`questions/*.json` 只保存从这些 Markdown 提取出的派生题目记录。

每条习题记录至少保存以下回链字段：

```json
{
  "id": "book-ds-yan-01-10",
  "number": "1.10",
  "source": {
    "question": {"markdown": "part-1-questions/01-introduction/index.md", "anchor": "1.10", "pdfPages": [14], "bookPages": [9]},
    "answer": {"markdown": "part-3-answers/chapter-1/index.md", "anchor": "1.10", "pdfPages": [186], "bookPages": [181]}
  },
  "answer": {
    "status": "provided",
    "origin": "book",
    "original": "原书答案或提示的 Markdown 原文"
  },
  "knowledgeIds": ["ds:basic/algorithm"]
}
```

`answer.status` 至少区分 `provided`、`hint-only`、`missing` 和 `pending-review`；`answer.origin` 至少区分 `book`、`verified`、`book+verified` 和 `missing`。详细规则、图形 spec 和代理提示模板见 [references/markdown-schema.md](references/markdown-schema.md)、[references/diagram-spec.md](references/diagram-spec.md) 和 [references/delegation-protocol.md](references/delegation-protocol.md)。

## 资源

- `scripts/prepare_book_pages.py`：按页范围渲染 PDF 页面并生成供模型分批读取的页码清单。
- `scripts/render_ds_diagram.py`：从结构化 JSON 用 Python 重绘数组、链表、树、图、流程、排序轨迹和存储布局。
- `scripts/validate_book_markdown.py`：检查来源注释、标题层级、代码围栏、图片路径、Python 重绘目录、文本残留和 review 标记；`exercise-book` 先以它审计完整 Markdown。
- 题目派生校验：在题目提取器旁实现或运行等价检查，验证题目/答案 Markdown 回链、题号、缺失答案标记、知识点 ID 和 JSON 唯一性；没有通过该检查时不得导入题库。
