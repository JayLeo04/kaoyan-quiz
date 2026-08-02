# 子代理委派协议

## 分工

把任务拆成互不覆盖的写入范围。主代理维护 `manifest.json` 和最终合并：

1. `toc-planner`：读取目录页/书签和页面图，产出章节 ID、PDF 页范围、书内页码关系和重叠页，不写最终正文。
2. `section-writer-N`：只处理一个核心页段，直接阅读页面图，写 `work/sections/<id>/index.md` 和 `review.json`。
3. `figure-redraw-N`：只处理分配的图号，直接阅读原页和章节 Markdown，写 `assets/py/fig-<id>.svg`、JSON spec 和 `review.json`；不修改正文。
4. `content-auditor`：独立对合并页逐页回看，报告缺失、重复、乱码、公式/代码和图示疑点，不代替主代理猜改。
5. `final-integrator`：按目录顺序合并，去重重叠页，补图片链接和来源注释，运行终检；一个工作区只允许一个整合者。

### 习题集模式的额外角色

检测到题目篇与答案/提示篇分离时，必须先完成下面两类 Markdown 写入，再进行题目提取：

1. `exercise-question-writer`：只处理题目篇或实习题篇的连续页段，写完整 Markdown、题号、题型、公式、代码、表格、图片引用和 `review.json`；不写题目 JSON。
2. `exercise-answer-writer`：只处理答案/提示篇的连续页段，写完整答案/提示 Markdown，保留原题号、答案范围、跨页续文和“提示/解答”性质；不根据常识补答案，不写题目 JSON。
3. `exercise-linker`：仅在上述 Markdown 通过初审后运行，按题号和目录建立 `source.question` / `source.answer` 回链并生成 `questions/*.json`；原书答案写入 `answer.original`，核验答案另存 `answer.verified`。
4. `exercise-auditor`：独立回看题目页和答案页，核对题号映射、页码、跨页边界、答案缺失、公式、代码和图片；不能把推导结果覆盖原书答案。

`exercise-question-writer` 与 `exercise-answer-writer` 可以并行，但 `exercise-linker` 必须等待两边 Markdown 和审计报告完成。若题号无法唯一映射，保留 `pending-review` 和来源页，不得猜测对应答案。

## 发送给代理的最小上下文

代理提示应包含：任务角色、PDF 绝对路径、页面图路径、页段和重叠页、唯一写入目录、输出格式和验收命令。不要把整本书、其他代理的长答案或主代理的猜测传给它；不要要求代理先做独立文字提取。

可复用的提示骨架：

```text
使用 $luna-multimodal-rewrite。你是 section-writer-03，只处理 PDF 页 120-137，118-119 和 138 仅用于跨页视觉上下文。
源文件：<pdf>
页面图：<page-images>
唯一写入目录：<work/sections/03>
输出：index.md、review.json；每个页面保留 luna:source 注释。
直接阅读页面并重写 Markdown，保留定义、条件、公式、代码、表格、例题和复杂度，不摘要、不猜测。
页面仍无法确定时写 luna:review，附页码、区域和原因。
完成后只返回：文件路径、页码范围、review 数、图片引用数和一句风险摘要。
```

习题集答案篇提示骨架：

```text
使用 $luna-multimodal-rewrite 的 exercise-book 模式。你是 exercise-answer-writer-02，只处理 PDF 页 180-191 的答案/提示篇，178-179 和 192-193 仅用于跨页视觉上下文。
源文件：<pdf>
页面图：<page-images>
唯一写入目录：<book-root>/part-3-answers/<section>
输出：index.md、review.json；每个页面保留 luna:source 注释。
直接阅读页面并完整重写原书答案/提示，保留题号、答案范围、公式、代码、表格和跨页续文。不要把缺失答案补成推导答案，不要改写原书结论；不确定处使用 luna:review。
完成后只返回：文件路径、页码范围、识别到的题号、review 数和一句答案完整性风险摘要。
```

图片代理使用同样的最小上下文，但只写 `assets/py/` 和 JSON spec。内容审计代理以原页和当前 Markdown 为输入，不能读取“预期修复答案”，以免把猜测当作验证结果。

## 合并规则

- 核心页段必须互不重叠；重叠页只用于识别跨页边界。按 PDF 页码和目录顺序合并，不按代理完成时间排序。
- 代理可以失败或返回 review；主代理不得用另一个代理的摘要填补缺页。将失败页段保留在清单中并重新派发小范围任务。
- 每个代理返回结构化短报告，避免将大量正文复制回主上下文。优先从磁盘读取文件和审计 JSON；只有发生冲突时才把相关页段带回上下文。
- 可用子代理工具时优先并行运行 2–6 个独立页段；只有在需要前一阶段产物时才等待。子任务结束后及时关闭不再需要的代理，避免占用并发额度。
- 子代理不可用时，用同一角色契约在本地按页段运行；不要因为少了并行能力而省略图片重绘或逐页验收。
