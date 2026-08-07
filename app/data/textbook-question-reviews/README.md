# 教材题目知识点与质量审校

这里是教材题目的知识点映射和质量结论的唯一人工来源。构建器会把这些批次合并到题目目录；生成的章节 JSON、`questions/index.json` 和 `textbook-data-structures.json` 不接受手工修改。

固定格式：

```json
{
  "schemaVersion": "textbook-question-review-v1",
  "bookId": "data-structures-yan-weimin",
  "scope": ["02-linear-list"],
  "updates": [
    {
      "id": "book-ds-yan-02-linear-list-2-1",
      "tags": ["链表"],
      "knowledgeIds": ["ds:linearlist/linked"],
      "quality": {
        "statement": "clear",
        "answerability": "complete",
        "examRelevance": "core",
        "disposition": "keep",
        "notes": "题干完整，可直接用于链表基本操作训练。"
      }
    }
  ]
}
```

约束：

- 457 道题必须恰好各出现一次。
- `knowledgeIds` 最多 3 个，且必须来自 `app/data/knowledge.json` 中现有的数据结构知识页。
- 非 `legacy` 题必须关联 1–3 个知识页。
- `legacy` 题若在当前 408 真题知识体系中确无对应页，`knowledgeIds` 和 `tags` 应同时留空；禁止用宽泛页面做假兼容。
- `tags` 只能取自 `app/data/knowledge-index.json` 的现有真题标签，标签路由页必须包含在 `knowledgeIds` 中。
- `knowledgeIds[0]` 是主要知识页，其余为相关知识页。
- `disposition: "hide"` 只表示不建议练习，不删除原题和来源记录。

运行 `npm run textbook:ds` 会检查覆盖率、ID、标签、枚举和 scope；任何兼容 ID、虚构标签或未审题条目都会使构建失败。
