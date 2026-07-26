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

当过程同时改变输入、工作区、队列、输出文件或多个归并段时，使用多泳道轨迹。`lanes` 定义每条泳道，`steps[].state` 必须为每条泳道保留完整数组状态；原始表的每一行都要对应一个 step，不能跳过中间状态：

```json
{
  "items": [51, 94, 37, 92, 14],
  "lanes": [
    {"id": "output", "shortLabel": "FO", "label": "输出文件"},
    {"id": "workspace", "shortLabel": "WA", "label": "工作区"},
    {"id": "input", "shortLabel": "FI", "label": "输入文件"}
  ],
  "steps": [
    {
      "label": "装入工作区",
      "note": "读入前四个记录。",
      "state": {"output": [], "workspace": [51, 94, 37, 92], "input": [14]}
    },
    {
      "label": "输出 37，读入 14",
      "note": "14 小于当前 MAXV，冻结到下一归并段。",
      "frozen": [14],
      "state": {"output": [37], "workspace": [51, 94, 14, 92], "input": []}
    }
  ]
}
```

地址转换、装入等需要同步观察“逻辑程序—转换者—物理内存”的过程，可使用 `layout: "loading-trace"`。三个以上步骤都必须保留完整的每泳道状态，并用 `activeLanes` 表明本步参与地址转换的对象；不要把静态重定位和运行时重定位混成同一个过程。

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

需要解释用户态陷入、内核态服务以及可能发生的进程切换时，可使用 `layout: "privilege-switch"`。配置必须同时给出 `actors`、至少四个 CPU `registers`、至少两个内存 `pcbs`，并让每个 step 明确 `mode`、寄存器值、PCB 状态、当前参与方。必须标出“模式切换不等于进程切换”：只有调度改换执行流时，才会从一个 PCB 恢复另一个 PCB 的现场。

需要清楚展示 `fork()` 返回值、父子进程独立执行、`wait()` 回收、僵尸与孤儿这类分支时，可使用 `layout: "process-family"`。配置包含恰好两个 `members`（`parent`、`child`）和多个可直接选择的 `steps`；每一步必须给出父、子状态、两边返回值、结论和说明。场景可以并列，不得伪装成一条必然依次发生的生命周期。

### `state-machine`

用于进程状态、TCP 状态和 Cache 一致性等状态转换。`states` 包含 `id`、`label`、`note`，`transitions` 包含 `from`、`to`、`event`。只有用户选择事件后才改变高亮状态。

### `timeline`

用于调度、流水线、报文交换和年度考点变化。配置包含 `lanes` 与 `events`；每个事件有 `start`、`duration`、`label` 和 `note`。坐标单位必须在界面中说明。

### scheduler-queue

用于轮转调度和多级反馈队列这类“CPU 片段结束后，队列如何改变”的过程。配置的 mode 只能是 round-robin 或 mlfq，并包含 modeLabel、rule、unit、queues、jobs 与 steps。任务有唯一 id、label、arrival 和 service；每个队列有唯一 id、label 和说明。

每一步必须写出实际运行的 cpu、duration、label、note，以及**该片结束后每个队列的完整顺序**（queues）。可额外写 arrivals、completed、event 和 action。不要把队列变化只画成甘特条：读者必须能逐步看到队头、队尾、到达、完成和每个任务的剩余服务时间；所有步骤由读者前进、后退或直接选择。

### concurrency-lab

用于互斥、条件变量、原子指令与 P/V 操作等需要同时观察多个线程、共享变量、等待队列和代码行的过程。config.scenarios 至少包含一个可选场景；每个场景都有唯一 id、label、summary、两个以上 actors、一个以上 shared、可选 queues、可审计的 code 面板和至少两个 steps。

每个步骤必须指定当前 actor，完整给出所有参与方的 actors 状态、所有共享项的 shared 值，以及存在队列时每个队列的完整成员列表。activeCode 只引用本场景已定义面板的合法行号；步骤还应有 label、note，可选 outcome。交互图不得只显示“正确结果”：无互斥的丢失更新、阻塞/唤醒与算法失败路径也要逐步展示，并和当前高亮代码行一致。

### `comparison`

用于容易混淆的多个概念。默认配置包含 `columns`、`rows`，每行必须有明确比较维度，不能重复正文已有的无交互表格。

需要按层说明两个以上部署方案时，可使用 `layout: "layered-stacks"`：`columns` 与 `stacks` 必须一一对应，每个 stack 至少两层 `layers`，并提供 `summary`。层从上到下写入，适用于宏/微/混合内核的服务位置，以及 Type 1 / Type 2 虚拟机的 VMM 部署位置；实例和判断关键词写入 stack 的 `examples`、`path`，正文仍保留完整定义与边界。

### `address-fields`

用于 Cache、分页、分段和网络地址拆分。配置包含 `totalBits`、`fields`；每个 field 有 `label`、`bits`、`tone` 和 `note`，各字段位数之和必须等于 `totalBits`。

### `banker-simulator`

用于银行家算法的可编辑安全性检查。配置包含 `resources`、`processes`、`available`、`max` 和 `allocation`；资源向量与每个矩阵行长度必须一致，所有数值为非负整数，且每个 `Allocation[i][j]` 不得大于 `Max[i][j]`。渲染层自动计算 `Need`，用户修改初值后才开始逐步安全性检查。

### `resource-allocation-graph`

用于资源分配图与“环”的判定边界。配置包含至少两个 `cases`；每个 case 有 `id`、`label`、`conclusion`、`nodes` 和 `edges`。节点 `kind` 只能是 `process` 或 `resource`；边 `kind` 只能是 `request`（P→R）或 `allocation`（R→P）。多实例资源可额外给出 `instances` 和 `available`，用于说明有环不必然死锁。

### `semaphore-lab`

用于信号量的用户驱动步骤与代码行联动。`mode` 为 `bounded-buffer` 或 `dining-philosophers`；`code` 存放可审计的代码面板与行数组，所有 step 的 `activeCode` 只引用已有面板和合法行号。前者还需要 `capacity`、信号量 `counters`、每步 `buffer` 与计数状态；后者需要等长的 `philosophers`、`forks`、每步 `forkOwners` 和 `states`。

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
