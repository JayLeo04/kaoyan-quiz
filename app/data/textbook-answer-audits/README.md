# 教材习题答案审计覆盖层

这里保存独立核验后的补充答案，而不是原书答案的替代副本。每个并行批次使用独立 JSON 文件，最后仅在 `index.ts` 汇总，避免多人修改同一份大型题库数据。

每份文件的固定结构为：

```json
{
  "schemaVersion": "textbook-answer-audit-v1",
  "bookId": "data-structures-yan-weimin",
  "scope": ["01-introduction"],
  "updates": [
    {
      "id": "book-ds-yan-01-...",
      "answer": {
        "status": "provided",
        "origin": "verified",
        "verified": "独立推导的 Markdown 解答",
        "explanation": "核验依据、边界或复杂度"
      },
      "review": {
        "status": "passed",
        "resolvedFlagCodes": ["ANSWER_MISSING"],
        "notes": "审计结论"
      }
    }
  ],
  "unresolved": []
}
```

规则：

- 不直接修改 `textbook-data-structures.json`；它是从教材源稿导出的基线。
- 不得把自行推导内容写进 `answer.original`，也不得称为原书答案。
- 题干不足或无法安全确认时放进 `unresolved`，附具体原因。
- 经交叉审计发现错误时，在原 `answer` 旁增加 `correction`（含新 `verified`、`reason` 和可选 `explanation`）；加载器只呈现修正后的内容，旧草稿仍可追溯。
- 新增 JSON 后，在 `index.ts` 注册，并运行 `npm run textbook:answers:audit` 与 `npm run build`。
