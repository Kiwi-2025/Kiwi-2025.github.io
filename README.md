# Kiwi's Blog

Astro 静态个人博客，采用 AstroPaper-inspired 的 Mingalaba 主题外观，并针对中文内容做了字体、行高、分类/标签路径和公式排版适配。使用 Markdown 写作，支持数学公式、图片、分类和标签。默认部署目标是 GitHub 用户主页仓库：`https://Kiwi-2025.github.io/`。

## 本地开发与预览

```bash
npm install
npm run dev
```

默认开发服务器会启动在 `http://localhost:4321/`。如果端口被占用，Astro 会自动换到其他可用端口，请以终端输出的 `Local` 地址为准。

开发预览适合边写边看，修改文件后页面会自动刷新：

```bash
npm run dev
```

构建后预览用于检查最终静态站点效果：

```bash
npm run build
npm run preview
```

`npm run preview` 默认同样会给出一个本地访问地址，通常是 `http://localhost:4321/`。停止本地服务器时，在运行命令的终端按 `Ctrl+C`。

## 写文章

- 文章放在 `src/content/blog/`。
- frontmatter 字段：`title`、`date`、`categories`、`tags`，可选 `description`、`draft`。
- 图片放在 `public/images/`，Markdown 中使用 `/images/example.png`。
- 行内公式使用 `$...$`，块级公式使用 `$$...$$`。
- 中文分类和标签可以直接写中文，站点会生成对应静态路径。

## 手机写作后台

部署后可以在手机浏览器打开 `https://Kiwi-2025.github.io/admin/` 使用 Sveltia CMS 写作。后台是静态页面，配置在 `public/admin/config.yml`，文章会保存到 `src/content/blog/`，图片会上传到 `public/images/`，正文中以 `/images/example.png` 形式引用。

首次登录建议使用 GitHub fine-grained personal access token：

1. 打开 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens。
2. 选择仓库 `Kiwi-2025/Kiwi-2025.github.io`。
3. Repository permissions 至少开启 `Contents: Read and write`，用于读取文章、提交 Markdown 和上传图片。
4. 生成 token 后只在手机浏览器的 CMS 登录界面粘贴一次。token 只保存在本机浏览器中，不要写进仓库、Markdown 或配置文件。

保存文章时，CMS 会把改动提交到 `main` 分支；`.github/workflows/deploy.yml` 随后自动构建并发布 GitHub Pages。需要暂存不发布时，把文章字段 `draft` 打开。

## 主题配置

主题入口在 `src/site.config.ts`。当前设置：

- `theme: "mingalaba"`
- `lang: "zh-CN"`
- 默认标题：`Kiwi's Blog`
- 首页标题下方文字：`intro`
- 中文字体优先：系统字体、`Noto Sans SC`、`Microsoft YaHei`

修改首页标题和标题下方文字时，编辑 `src/site.config.ts` 中的对应字段，保留其他配置不变：

```ts
export const site = {
  title: "Kiwi's Blog",
  intro: "Engineering notes on robotics, software, and practice. A quiet notebook for long-form posts, formulas, code, and field notes.",
  // ...
};
```

其中 `title` 会显示为首页大标题和顶部站点名，`intro` 会显示在首页 `Kiwi's Blog` 下方。

## 构建

```bash
npm run build
```

## GitHub Pages

1. 在 GitHub 创建空仓库 `Kiwi-2025/Kiwi-2025.github.io`。
2. 将本地仓库推送到 GitHub 的 `main` 分支。
3. 在仓库 Settings → Pages 中选择 GitHub Actions。
4. `.github/workflows/deploy.yml` 会自动构建并发布 `dist/`。
