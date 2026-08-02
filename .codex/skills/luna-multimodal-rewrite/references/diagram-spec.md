# Python 重绘图形 spec

`render_ds_diagram.py` 接收一个 JSON 文件。字段来自模型直接阅读的页面和已核对的正文；不要把无法从页面确认的关系写进 spec。通用字段：

```json
{
  "id": "linked-list-head",
  "title": "带头结点的单链表",
  "type": "linked-list",
  "items": ["head", "a1", "a2", "NULL"],
  "highlight": [0]
}
```

支持的类型与最小字段：

| type | 字段 | 用途 |
| --- | --- | --- |
| `array` | `items` | 数组/顺序表下标和元素 |
| `linked-list` | `items` | 结点、指针方向和空指针 |
| `tree` | `nodes`、`edges` | 树、二叉树、森林；边为 `from`/`to` |
| `graph` | `nodes`、`edges` | 图、邻接关系；节点可给 `x`/`y` |
| `flow` | `nodes`、`edges` | 算法或协议流程；边可给 `label` |
| `sort-trace` | `states` | 每一步的数组状态，可给 `labels` |
| `memory-layout` | `segments` | 地址区间、字段、块和偏移；段可给 `start`/`end` |

节点和边的标签应短而确定：

```json
{
  "id": "bst-inorder",
  "title": "二叉搜索树的中序遍历",
  "type": "tree",
  "nodes": [
    {"id": "r", "label": "8"},
    {"id": "l", "label": "3"},
    {"id": "rr", "label": "10"}
  ],
  "edges": [
    {"from": "r", "to": "l", "label": "left"},
    {"from": "r", "to": "rr", "label": "right"}
  ],
  "highlight": ["l"]
}
```

生成规则：

- 使用固定布局、白底、清晰边框和足够留白；同一 spec 重跑应得到相同几何关系。
- 箭头方向、空指针、下标起点、地址范围和排序步骤必须与页面和正文一致。`highlight` 只强调页面明确强调的状态，不能通过颜色制造新结论。
- 输出路径使用 `assets/py/fig-<stable-id>.svg` 或 `.png`。stable ID 由章节和图号组成，不使用随机数、时间戳或代理昵称。
- 图只是正文的视觉补充；正文必须独立说明输入、操作、状态变化和结论。
