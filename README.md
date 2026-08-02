# 研刷 408

面向计算机考研 408 的本地优先学习站点，包含历年真题、科目分析、知识页和交互式可视化。

## 快速开始

```bash
npm ci
npm run dev
```

需要生产构建时执行：

```bash
npm run build
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器。 |
| `npm run build` | 生成生产构建。 |
| `npm run lint` | 运行 ESLint。 |
| `npm test` | 构建并运行渲染与数据完整性测试。 |
| `npm run check` | 连续运行 lint 和 test。 |
| `npm run import:408` | 导入题库、统计和知识页数据。 |
| `npm run knowledge:408 -- --subject os` | 只导入一个科目的知识页。 |

## 本地资料与导入

原始教材和扫描件放在 `source-materials/`，该目录不会被提交或发布。题库与知识库的来源路径通过环境变量配置，例如在 PowerShell 中：

```powershell
$env:KAOYAN_QUESTIONS_SOURCE = "C:\资料\408_exams"
$env:KAOYAN_KNOWLEDGE_SOURCE = "C:\资料\kaoyanzahuopu"
$env:KAOYAN_TAG_MAPPING_PATH = "C:\资料\tag_knowledge_map.json"
npm run import:408
```

生成数据与运行时静态资源已经纳入版本控制，因此克隆项目后无需来源库也能运行、构建和执行默认测试。

## 文档

- [开发与维护规范](docs/DEVELOPMENT.md)
- [文件系统生命周期沙盘 PRD](docs/PRD-file-system-lifecycle-sandbox.md)
- [ChatGPT 工作区认证说明](docs/PLATFORM_AUTH.md)
