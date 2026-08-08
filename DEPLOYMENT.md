# 部署交付说明

这是“研刷 408”站点的精简部署源码包。包内已经包含当前题库、知识页、教材页面、公开图片和数据库迁移，不需要原始教材或本地导入工作目录。

## 环境要求

- Node.js 22.13.0 或更高版本
- npm
- 若使用云端进度同步，需要一个绑定名为 `DB` 的 Cloudflare D1 数据库

## 安装与构建

解压后，在项目目录执行：

```bash
npm ci
NEXT_PUBLIC_SITE_URL="https://你的正式域名" npm run build
```

本机或普通 Node.js 主机可在构建后执行：

```bash
npm run start
```

使用 OpenAI Sites 或兼容的 Cloudflare 部署流程时，请保留 `.openai/hosting.json`、`worker/` 和 `drizzle/`。若部署到新的 Sites 项目，应在目标平台重新关联项目和 D1 数据库。

## 数据库

数据库迁移位于 `drizzle/`。应用代码使用的 D1 绑定名为 `DB`；目标平台需要提供同名绑定并应用迁移。

## 包内保留内容

- `app/`：页面、接口和已经生成的数据
- `public/`：站点公开资源与教材图片
- `config/`、`worker/`：构建和 Cloudflare Worker 配置
- `db/`、`drizzle/`：数据库代码与迁移
- `.openai/hosting.json`：Sites 托管声明
- 根目录中的依赖清单和构建配置

## 未包含内容

Git 历史、`node_modules`、构建缓存、原始教材、OCR/审校中间文件、导入脚本、测试与开发文档均未打包。这些内容不影响现有站点的安装、构建与部署。
