# 开发与维护规范

## 基线与质量门槛

- 使用 Node.js `>=22.13.0` 和 `npm ci` 安装锁定依赖。
- 每次提交前运行 `npm run lint` 与 `npm test`；`npm run check` 会连续执行两项检查。
- `npm test` 包含生产构建和渲染/数据完整性测试。不要只依赖开发服务器能启动这一项结果。
- TypeScript 保持严格模式。新增代码优先复用 `@/` 别名；服务端和客户端组件的边界应明确，只有需要浏览器状态或事件时才使用 `"use client"`。

## 目录职责

| 目录 | 职责 |
| --- | --- |
| `app/` | 路由、React 组件、样式与站内数据读取逻辑。 |
| `config/` | 构建和托管配置所需的源码，不放生成输出。 |
| `public/` | 部署时必须随站点发布的静态资料；引用路径以 `/` 开头。 |
| `scripts/` | 可重复执行的数据导入、生成与审计脚本。 |
| `tests/` | 自动化验证；可提交的测试夹具放在 `tests/fixtures/`。 |
| `examples/` | 小型、可复现的人工参考样例。 |
| `docs/` | 产品说明、设计决策和维护文档。 |
| `tmp/` | 本机临时产物，默认忽略。 |
| `source-materials/` | 本地原始资料，默认忽略且不得直接发布。 |

## 数据与生成边界

`app/data/questions.json`、`app/data/analytics.json`、`app/data/knowledge.json`、`app/data/knowledge-index.json` 以及 `public/knowledge/**` 都是导入结果。修改题库或知识内容时，应先修改已审校的来源资料或导入器，再运行相应脚本；不要直接手改这些生成物。

常用命令：

```bash
npm run import:408
npm run analytics:408
npm run knowledge:408 -- --subject os
npm run study:os
```

题库来源可通过第一个命令行参数或 `KAOYAN_QUESTIONS_SOURCE` 指定。知识库来源与标签映射分别读取 `KAOYAN_KNOWLEDGE_SOURCE` 和 `KAOYAN_TAG_MAPPING_PATH`；未指定时会沿用历史默认目录。这样可以让导入脚本不依赖某台电脑的绝对路径。

在有完整知识库来源时，设置 `KAOYAN_KNOWLEDGE_SOURCE` 后再执行 `npm test`，测试会额外核对生成的可视化数量与来源 manifest；未提供来源时，默认测试仍会验证已提交的生成数据自身。

## 提交前复核

1. 运行 `npm run check`。
2. 检查 `git diff`，确认生成数据、静态资源和源码变更属于同一个目的。
3. 新增图片要有有意义的替代文本；新增交互需支持键盘操作并保留清晰的焦点状态。
4. 不提交 `.env*`、`tmp/`、原始教材或运行日志；需要保留的样例应先移入合适的版本控制目录。
