# 408 知识可视化数据契约

## 文件位置与插入标记

每科在知识源根目录保存一个 `_visualizations.json`：

- `data_structure/_visualizations.json`
- `constitution_principle/_visualizations.json`
- `operating_system/_visualizations.json`
- `computer_network/_visualizations.json`

页面只在语义位置放置一行标记：

```md
<!-- knowledge-visual:ds-algorithm-growth -->
```

ID 必须全站唯一。一个 spec 只能属于一个 route，同一标记在目标页面恰好出现一次。

## 顶层格式

```json
{
  "version": 1,
  "subject": "ds",
  "visualizations": []
}
```

`subject` 只能是 `ds`、`co`、`os`、`cn`。

## 通用 spec

```json
{
  "id": "ds-algorithm-growth",
  "route": "basic/algorithm",
  "type": "growth-curves",
  "title": "输入规模如何放大运算量",
  "summary": "拖动输入规模 n，对比不同数量级的相对增长。",
  "sourceLatex": ["O(1)", "O(\\log n)", "O(n)", "O(n\\log n)", "O(n^2)", "O(2^n)"],
  "config": {}
}
```

必填字段为 `id`、`route`、`type`、`title`、`summary`、`config`。有公式时必须填写 `sourceLatex`；其中内容使用 LaTeX 本体，不带 `\(...\)` 或 `$$...$$` 定界符。

不得出现 `html`、`script`、`style`、`onClick`、`src`、外部 URL 或 `autoPlay: true`。清单只存可验证的数据，不能存任意渲染代码。

## 支持的图型

### `growth-curves`

用于时间/空间复杂度、吞吐量、时延或命中率随规模变化。

```json
{
  "min": 2,
  "max": 64,
  "initial": 16,
  "inputLabel": "输入规模 n",
  "series": [
    {"id": "constant", "label": "常数", "formula": "O(1)", "kind": "constant", "tone": "violet"},
    {"id": "log", "label": "对数", "formula": "O(\\log n)", "kind": "log2", "tone": "blue"},
    {"id": "linear", "label": "线性", "formula": "O(n)", "kind": "linear", "tone": "mint"},
    {"id": "nlogn", "label": "线性对数", "formula": "O(n\\log n)", "kind": "n-log2-n", "tone": "amber"},
    {"id": "quadratic", "label": "平方", "formula": "O(n^2)", "kind": "square", "tone": "coral"},
    {"id": "exponential", "label": "指数", "formula": "O(2^n)", "kind": "pow2", "tone": "rose"}
  ]
}
```

增长曲线可用 HTML 柱、点阵或 CSS 折线近似呈现，但数值标签必须准确，并说明是否使用对数归一化。

### `algorithm-trace`

用于二分查找、排序、图遍历、页表查询等逐步过程。

```json
{
  "items": [2, 5, 8, 12, 16, 23],
  "steps": [
    {"label": "检查中点", "active": [2], "range": [0, 5], "note": "mid = 2，目标更大"},
    {"label": "缩小右半区", "active": [4], "range": [3, 5], "note": "继续比较"}
  ]
}
```

步骤由用户点击或键盘控制；不默认自动播放。

### `memory-scale`

用于辅助空间、栈深、Cache/主存层次、页大小和缓冲区规模。

```json
{
  "min": 2,
  "max": 64,
  "initial": 16,
  "inputLabel": "输入规模 n",
  "cases": [
    {"label": "迭代扫描", "formula": "O(1)", "kind": "constant", "note": "只保留固定数量变量"},
    {"label": "递归折半", "formula": "O(\\log n)", "kind": "log2", "note": "调用栈随递归深度增长"},
    {"label": "复制数组", "formula": "O(n)", "kind": "linear", "note": "辅助空间与输入规模线性相关"}
  ]
}
```

动态空间尺度使用与 `growth-curves` 相同的 `kind`。界面随 `n` 计算代表函数示意值，并明确它不是字节数；旧清单的 `units` 只允许作为无定量含义的兼容数据。

### `process-flow`

用于数据通路、协议封装、系统调用和握手流程。

```json
{
  "steps": [
    {"id": "fetch", "label": "取指", "detail": "PC 给出指令地址", "from": "PC", "to": "主存 / IR", "message": "指令地址与指令字"},
    {"id": "decode", "label": "译码", "detail": "控制器解释操作码"},
    {"id": "execute", "label": "执行", "detail": "数据通路完成运算"}
  ],
  "connections": [["fetch", "decode"], ["decode", "execute"]]
}
```

有明确通信双方或数据传递方向时，为 step 增加 `from`、`to`、`message`；渲染层应显示方向，而不是把同一段 detail 重复两次。

### `state-machine`

用于进程状态、TCP 状态和 Cache 一致性等状态转换。`states` 包含 `id`、`label`、`note`，`transitions` 包含 `from`、`to`、`event`。只有用户选择事件后才改变高亮状态。

### `timeline`

用于调度、流水线、报文交换和年度考点变化。配置包含 `lanes` 与 `events`；每个事件有 `start`、`duration`、`label` 和 `note`。坐标单位必须在界面中说明。

### `comparison`

用于容易混淆的多个概念。配置包含 `columns`、`rows`，每行必须有明确比较维度，不能重复正文已有的无交互表格。

### `address-fields`

用于 Cache、分页、分段和网络地址拆分。配置包含 `totalBits`、`fields`；每个 field 有 `label`、`bits`、`tone` 和 `note`，各字段位数之和必须等于 `totalBits`。

## 可访问与视觉约束

- 所有滑块、步骤按钮和选项均有可见标签与键盘焦点。
- 动态值写入 `aria-live="polite"` 区域。
- 颜色不是唯一编码，同时显示文字、数字或纹理差异。
- 动画遵从 `prefers-reduced-motion`，默认不无限循环。
- 窄屏允许纵向重排；不得让整篇正文产生水平滚动。
- 视觉语言沿用站点现有色板和字体，单图强调色不超过 4 个；复杂度曲线等多系列图可增加颜色，但必须配图例。

## 删除旧图前的检查

只有满足下列条件才删除被替代的图片引用：

1. 新图覆盖旧图的全部标签、方向和关系；
2. 公式与数字已进入可审计清单；
3. 桌面和窄屏均清楚；
4. 图片没有在其他页面复用；
5. 构建与浏览器验收通过。
