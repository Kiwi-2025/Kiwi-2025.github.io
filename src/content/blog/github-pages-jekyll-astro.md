---
title: GitHub Pages 部署 Astro 时遇到 Jekyll 构建失败
date: 2026-07-17 12:00:00
description: 记录一次 GitHub Pages 部署 Astro 站点时出现的 Jekyll 构建失败，以及对应的排查和修复过程。
categories:
  - 工程笔记
tags:
  - GitHub Pages
  - Astro
  - 项目记录
draft: false
---

## GitHub Pages 部署 Astro 时遇到 Jekyll 构建失败

### 背景知识

#### 什么是 Jekyll？

[Jekyll](https://jekyllrb.com/) 是一个用 Ruby 编写的静态网站生成器，自 2008 年诞生以来一直是 GitHub Pages 的默认构建工具。它使用 Markdown 和 Liquid 模板，通过 YAML front matter 来定义页面元数据。GitHub Pages 早期对 Jekyll 的原生支持非常成熟，因此很多默认行为（如自动构建流程）都是围绕 Jekyll 设计的。

#### 什么是 Astro？

[Astro](https://astro.build/) 是一个现代化的静态网站构建框架，与 Jekyll 不同，它基于 Node.js 生态，使用 `.astro` 文件格式。Astro 的核心特点是**岛屿架构**——页面默认输出纯静态 HTML，只在需要交互的地方加载 JavaScript，从而获得极佳的性能表现。

#### Jekyll vs Astro 核心区别

| 特性 | Jekyll | Astro |
|------|--------|-------|
| **运行环境** | Ruby | Node.js |
| **模板语言** | Liquid | JSX-like（类 HTML） |
| **组件支持** | 有限（通过插件） | 原生支持（.astro 组件） |
| **前端交互** | 需借助外部 JS 框架 | 内置岛屿架构，按需加载 |
| **构建产物** | 静态 HTML/CSS | 静态 HTML + 按需的 JS/CSS |
| **GitHub Pages** | 原生内置支持 | 需通过 GitHub Actions 构建 |

#### 两种 Pages 部署流程的区别

GitHub Pages 支持两种发布源（Source）：

##### 1. Deploy from a branch（分支发布）

这是 GitHub Pages 最传统的发布方式。当你选择某个分支（通常是 `main` 或 `gh-pages`）作为发布源时：

- **如果是 Jekyll 项目**：GitHub 会自动检测 `_config.yml`，使用内置的 Jekyll 构建器生成站点。
- **如果是纯静态文件**：直接发布分支中的静态文件（HTML/CSS/JS）。
- **关键特点**：GitHub 会**自动触发**一个名为 `pages build and deployment` 的工作流，这个流程是 GitHub 托管的，用户无法直接控制。

##### 2. GitHub Actions

这是更现代的发布方式，允许你完全自定义构建流程：

- **构建控制权**：你自己编写 `.github/workflows/*.yml` 来定义构建步骤。
- **灵活性**：可以构建 Astro、Next.js、Vite 等任何 Node.js 项目。
- **关键特点**：GitHub **不再自动触发** Jekyll 构建流程，完全由你的 Actions 工作流接管。

#### 为什么原流程会触发 Jekyll 报警？

问题的核心在于**两种发布源的冲突**。当仓库同时存在以下情况时：

1. **Pages Source 设置为 `Deploy from a branch`**（可能是历史配置，或新建仓库时的默认设置）
2. **仓库中同时存在自定义的 GitHub Actions 工作流**

此时，每次 push 会触发**两套独立的构建流程**：

1. **自定义 Astro 工作流**（`Deploy to GitHub Pages`）：执行 `npm ci` → `astro build` → 上传 `dist` → 部署 ✅
2. **GitHub 自动生成的 Jekyll 流程**（`pages build and deployment`）：扫描仓库源码 → 尝试用 Jekyll 构建 ❌

第二套流程会拉取 `jekyll-build-pages` 镜像，遍历仓库中的所有文件。当它遇到 `.astro` 文件时，看到文件开头的 `---` 分隔符，就尝试按 YAML front matter 解析——但 Astro 的 front matter 里是 JavaScript/TypeScript 代码，于是抛出 `YAML Exception`。

> ⚠️ **重要**：这个错误**不会影响** Astro 工作流的构建结果（因为那是独立流程），但会导致 GitHub 显示构建失败通知，且可能阻塞 Pages 的部署状态。

### 现象

推送代码后，GitHub Actions 提示 `pages build and deployment` 失败，日志中出现如下错误：

```
YAML Exception reading /src/layouts/BaseLayout.astro ... line 7
YAML Exception reading /src/layouts/BlogPostLayout.astro ... line 7
YAML Exception reading /src/pages/blog/[slug].astro ... line 8
Invalid YAML front matter in /src/pages/blog/index.astro
```

这些 `.astro` 文件本身没有问题。问题的根源在于 **GitHub Pages 的默认构建方式是 Jekyll**，而 Jekyll 会把任何包含 `---` 的文件当作 YAML front matter 来解析。

Astro 组件文件（`.astro`）的语法以 `---` 开头来分隔 frontmatter 脚本和模板：

```astro
---
// 这里是 Astro 的 frontmatter（JavaScript/TypeScript）
---

<!-- 下面是 HTML 模板 -->
```

Jekyll 不认识 Astro 语法，看到 `---` 就尝试按 YAML 解析，于是报错 `YAML Exception`。

### 排查

查看 Actions 日志，发现每次推送实际触发了 **两套** Pages 流程：

1. **`Deploy to GitHub Pages`**（自己配置的 Astro 工作流）：build ✅、deploy ✅
2. **`pages build and deployment`**（GitHub 自动生成的旧式流程）：`Build with Jekyll` ❌ 失败

第二条流程的路径是 `dynamic/pages/pages-build-deployment`，它拉取 `jekyll-build-pages` 镜像，尝试用 Jekyll 构建仓库源码，因此报错。

### 修复

#### 1. 切换 Pages 发布源（根本修复）

进入仓库 **Settings → Pages → Build and deployment → Source**，将 `Deploy from a branch` 改为 **`GitHub Actions`**。

这是关键一步，只有切换后才会停止自动生成 Jekyll 构建流程。

#### 2. 添加 `.nojekyll` 标记（防御性措施）

在 `public/.nojekyll` 放置一个空文件，Astro 构建后会输出到 `dist/.nojekyll`。

这个标记的作用是告诉 GitHub Pages：**不要对这个目录运行 Jekyll 构建**。即使某些情况下 Source 配置被误改，也能防止 Pages 尝试用 Jekyll 处理构建产物。

> 💡 **注意**：`.nojekyll` 只能防止 Jekyll 处理**已构建的产物**，无法阻止 GitHub 对**源码仓库**运行自动构建流程。因此它是对步骤 1 的补充，而非替代。

#### 3. 升级 Actions 版本（顺带优化）

同时把工作流里的 Actions 版本升级到最新主版本，避免 Node.js 20 弃用提醒：

| Action | 旧版本 | 新版本 |
|---|---|---|
| actions/checkout | v4 | v7 |
| actions/setup-node | v4 | v7 |
| actions/upload-pages-artifact | v3 | v5 |
| actions/deploy-pages | v4 | v5 |

构建环境也同步升级到 `node-version: 24`。

### 验证

- `npm test`：19/19 通过
- `npm run build`：astro check 0 errors，20 页面构建成功
- `dist/.nojekyll` 已生成

切换 Pages Source 后再次推送，Actions 列表中只剩 `Deploy to GitHub Pages`，构建和部署均成功，Jekyll 错误不再出现。
