# 教材习题完整答案审计

这里保存 457 道教材题的独立完整解答。原书答案或提示仍保留在生成题库的 `answer.original` 中，用于来源追溯；网页默认展示这里的完整解答。

每个并行批次使用独立 JSON 文件，固定格式为：

```json
{
  "schemaVersion": "textbook-answer-audit-v1",
  "bookId": "data-structures-yan-weimin",
  "scope": ["01-introduction"],
  "updates": [
    {
      "id": "book-ds-yan-01-introduction-1-1",
      "answer": {
        "status": "provided",
        "origin": "verified",
        "verified": "完整 Markdown 解答",
        "explanation": "核验依据、假设、边界或复杂度说明"
      },
      "review": {
        "status": "passed",
        "resolvedFlagCodes": ["ANSWER_MISSING"],
        "notes": "审校结论"
      }
    }
  ],
  "unresolved": []
}
```

约束：

- 457 道题必须全部拥有 `verified`，不能用提示、解题方向或原书短答冒充完整答案。
- 计算题包含过程和最终结果；算法题包含针对本题的步骤、边界、正确性与复杂度；讨论题逐项作答。
- 独立推导不得写入 `answer.original`，也不得称为原书答案。
- 题干不足时要在答案中声明合理假设，并同步记录在题目质量审校中。
- 每个答案批次必须有 `reviews/` 下的交叉复核文件；严重错误必须通过 `answer.correction` 留下可追溯修正。
- 新增批次后在 `index.ts` 注册，并运行 `npm run textbook:answers:complete`、`npm run textbook:ds` 和 `npm run build`。
