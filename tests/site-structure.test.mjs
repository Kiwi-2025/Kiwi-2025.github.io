import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const requiredFiles = [
  "astro.config.mjs",
  "src/content.config.ts",
  "src/content/blog/Robotics.md",
  "src/content/blog/Milestone.md",
  "src/layouts/BaseLayout.astro",
  "src/layouts/BlogPostLayout.astro",
  "src/pages/index.astro",
  "src/pages/blog/index.astro",
  "src/pages/blog/[slug].astro",
  "src/pages/categories/[category].astro",
  "src/pages/tags/[tag].astro",
  "src/pages/about.astro",
  "src/pages/404.astro",
  "src/site.config.ts",
  ".github/workflows/deploy.yml",
  "public/admin/index.html",
  "public/admin/config.yml",
  "README.md"
];

test("blog project contains the planned Astro files", () => {
  for (const file of requiredFiles) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});

test("math rendering and GitHub Pages deployment are configured", () => {
  const config = readFileSync(join(root, "astro.config.mjs"), "utf8");
  assert.match(config, /remarkMath/);
  assert.match(config, /rehypeKatex/);
  assert.match(config, /sitemap/);

  const layout = readFileSync(join(root, "src/layouts/BaseLayout.astro"), "utf8");
  assert.match(layout, /katex\/dist\/katex\.min\.css/);

  const workflow = readFileSync(join(root, ".github/workflows/deploy.yml"), "utf8");
  assert.match(workflow, /actions\/deploy-pages/);
});

test("migrated Markdown keeps frontmatter categories and tags", () => {
  for (const file of ["Robotics.md", "Milestone.md"]) {
    const content = readFileSync(join(root, "src/content/blog", file), "utf8");
    assert.match(content, /^---[\s\S]*categories:/);
    assert.match(content, /^---[\s\S]*tags:/);
  }
});

test("AstroPaper Mingalaba theme keeps Chinese support", () => {
  const config = readFileSync(join(root, "src/site.config.ts"), "utf8");
  assert.match(config, /theme:\s*"mingalaba"/);
  assert.match(config, /lang:\s*"zh-CN"/);
  assert.match(config, /title:\s*"Kiwi's Blog"/);

  const layout = readFileSync(join(root, "src/layouts/BaseLayout.astro"), "utf8");
  assert.match(layout, /data-theme/);
  assert.match(layout, /lang=\{site\.lang\}/);

  const styles = readFileSync(join(root, "src/styles/global.css"), "utf8");
  assert.match(styles, /Noto Sans SC/);
  assert.match(styles, /\[data-theme="mingalaba"\]\[data-color-mode="dark"\]/);
  assert.match(styles, /--astro-paper-accent/);
});

test("homepage follows the AstroPaper demo layout instead of a large hero", () => {
  const home = readFileSync(join(root, "src/pages/index.astro"), "utf8");
  assert.match(home, /Featured/);
  assert.match(home, /Recent Notes/);
  assert.match(home, /recentPosts\s*=\s*posts\.slice\(0,\s*5\)/);
  assert.match(
    home,
    /featuredPosts\s*=\s*posts\s*\.filter\(\(post\)\s*=>\s*post\.data\.featured\)\s*\.slice\(0,\s*3\)/
  );
  assert.match(home, /featuredPosts\.map\(\(post\)\s*=>/);
  assert.match(home, /featuredPosts\.length\s*>\s*0/);
  assert.doesNotMatch(home, /featuredPost\s*=\s*posts\.find/);
  assert.doesNotMatch(home, /recentPosts\s*=\s*posts\.slice\(1\)/);
  assert.ok(
    home.indexOf('id="recent-posts"') < home.indexOf('id="featured-posts"'),
    "Recent Notes should appear before Featured on the homepage"
  );
  assert.doesNotMatch(home, /astro-paper-hero/);

  const styles = readFileSync(join(root, "src/styles/global.css"), "utf8");
  assert.match(styles, /max-width:\s*48rem/);
  assert.match(styles, /--astro-paper-accent:\s*#2563eb/);
  assert.doesNotMatch(styles, /font-size:\s*clamp\(2\.75rem,\s*10vw,\s*6\.5rem\)/);
});

test("homepage surfaces milestone updates from the Milestone post", () => {
  const home = readFileSync(join(root, "src/pages/index.astro"), "utf8");
  const milestone = readFileSync(join(root, "src/content/blog/Milestone.md"), "utf8");

  assert.match(home, /milestonePost/);
  assert.match(home, /milestoneItems/);
  assert.match(home, /id="milestone-updates"/);
  assert.match(home, /Milestone/);
  assert.match(home, /\/blog\/milestone\//);
  assert.match(home, /class="milestone-timeline"/);
  assert.match(home, /class="milestone-date"/);
  assert.match(home, /class="milestone-marker"/);
  assert.match(home, /class="milestone-copy"/);
  assert.match(home, /formatMilestoneDate/);
  assert.match(home, /\.reverse\(\)/);
  assert.match(milestone, /# Milestone/);
  assert.match(milestone, /^- 2025年1月30日/m);
});

test("homepage milestone timeline avoids vertical line and item dividers", () => {
  const styles = readFileSync(join(root, "src/styles/global.css"), "utf8");
  const milestoneCopyBlock = styles.match(/\.milestone-copy\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";
  const milestoneTimelineBlock = styles.match(/\.milestone-timeline\s*\{(?<body>[^}]*)\}/)?.groups?.body ?? "";

  assert.match(milestoneTimelineBlock, /--milestone-date-width:\s*6\.6rem/);
  assert.doesNotMatch(milestoneCopyBlock, /border-bottom:/);
  assert.doesNotMatch(styles, /\.milestone-timeline::before\s*\{/);
  assert.doesNotMatch(styles, /\.milestone-timeline li::before\s*\{/);
});

test("static UI chrome is English while document language remains Chinese", () => {
  const config = readFileSync(join(root, "src/site.config.ts"), "utf8");
  const layout = readFileSync(join(root, "src/layouts/BaseLayout.astro"), "utf8");
  const home = readFileSync(join(root, "src/pages/index.astro"), "utf8");
  const about = readFileSync(join(root, "src/pages/about.astro"), "utf8");
  const notFound = readFileSync(join(root, "src/pages/404.astro"), "utf8");

  assert.match(config, /lang:\s*"zh-CN"/);
  assert.match(config, /intro:\s*"/);
  assert.match(layout, /Skip to content/);
  assert.match(layout, /aria-label="Primary navigation"/);
  assert.match(layout, /<a href="\/blog\/">Blog<\/a>/);
  assert.match(layout, /<a href="\/categories\/">Categories<\/a>/);
  assert.match(layout, /<a href="\/tags\/">Tags<\/a>/);
  assert.match(layout, /aria-label="Toggle color mode"/);
  assert.doesNotMatch(layout, /Technical notes in Markdown/);
  assert.doesNotMatch(layout, /public\/images/);

  assert.match(home, /Recent Notes/);
  assert.match(home, /\{site\.intro\}/);
  assert.doesNotMatch(home, /A quiet notebook for long-form posts, formulas, code, and field notes/);
  assert.match(home, /aria-label="Site links"/);
  assert.match(home, /<a href="\/blog\/">Blog<\/a>/);
  assert.match(home, /<a href="\/about\/">About<\/a>/);
  assert.match(about, /<BaseLayout title="About"/);
  assert.match(about, /<h1>About this blog<\/h1>/);
  assert.match(notFound, /<BaseLayout title="Not found"/);
  assert.match(notFound, /<h1>Page not found<\/h1>/);
  assert.match(notFound, /Back home/);
});

test("post listings omit placeholder summaries when description is missing", () => {
  for (const file of [
    "src/pages/index.astro",
    "src/pages/blog/index.astro",
    "src/pages/categories/[category].astro",
    "src/pages/tags/[tag].astro"
  ]) {
    const source = readFileSync(join(root, file), "utf8");
    assert.doesNotMatch(source, /Markdown technical note\./);
    assert.doesNotMatch(source, /Latest technical note\./);
    assert.doesNotMatch(source, /description\s*\?\?/);
    assert.match(source, /data\.description &&/);
  }
});

test("blog index lists all posts without category or tag filters", () => {
  const blogIndex = readFileSync(join(root, "src/pages/blog/index.astro"), "utf8");

  assert.match(blogIndex, /<BaseLayout title="Blog"/);
  assert.match(blogIndex, /<h1>Blog<\/h1>/);
  assert.match(blogIndex, /getAllPosts\(\)/);
  assert.match(blogIndex, /posts\.map\(\(post\) =>/);
  assert.match(blogIndex, /href=\{`\/blog\/\$\{slugFromId\(post\.id\)\}\/`\}/);
  assert.doesNotMatch(blogIndex, /data\.tags\.includes/);
  assert.doesNotMatch(blogIndex, /data\.categories\.includes/);
});

test("category and tag pages use English chrome but preserve Chinese terms", () => {
  const categories = readFileSync(join(root, "src/pages/categories/index.astro"), "utf8");
  const categoryDetail = readFileSync(join(root, "src/pages/categories/[category].astro"), "utf8");
  const tags = readFileSync(join(root, "src/pages/tags/index.astro"), "utf8");
  const tagDetail = readFileSync(join(root, "src/pages/tags/[tag].astro"), "utf8");
  const robotics = readFileSync(join(root, "src/content/blog/Robotics.md"), "utf8");

  assert.match(categories, /<BaseLayout title="Categories"/);
  assert.match(categories, /<h1>Categories<\/h1>/);
  assert.match(categories, /notes<\/small>/);
  assert.match(categoryDetail, /<BaseLayout title=\{`Category: \$\{label\}`\}/);
  assert.match(categoryDetail, /aria-label="Notes in category"/);

  assert.match(tags, /<BaseLayout title="Tags"/);
  assert.match(tags, /<h1>Tags<\/h1>/);
  assert.match(tags, /notes<\/small>/);
  assert.match(tagDetail, /<BaseLayout title=\{`Tag: \$\{label\}`\}/);
  assert.match(tagDetail, /aria-label="Notes with tag"/);

  assert.match(robotics, /categories:\s*\n-\s*机器人学/);
  assert.match(robotics, /tags:\s*\n-\s*杂碎知识/);
});

test("technical note styling protects long-form content on small screens", () => {
  const layout = readFileSync(join(root, "src/layouts/BlogPostLayout.astro"), "utf8");
  const styles = readFileSync(join(root, "src/styles/global.css"), "utf8");

  assert.match(layout, /aria-label="Categories and tags"/);
  assert.match(styles, /\.article-shell\s*\{[\s\S]*max-width:\s*min\(100%,\s*48rem\)/);
  assert.match(styles, /\.prose\s*\{[\s\S]*line-height:\s*1\.76/);
  assert.match(styles, /\.prose pre,\s*\n\.prose table,\s*\n\.prose \.katex-display\s*\{[\s\S]*overflow-x:\s*auto/);
  assert.match(styles, /-webkit-overflow-scrolling:\s*touch/);
  assert.match(styles, /table-layout:\s*auto/);
  assert.match(styles, /word-break:\s*normal/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /\[data-theme="mingalaba"\]\[data-color-mode="dark"\][\s\S]*--astro-paper-code:\s*#020617/);
});

test("article pages provide a responsive table of contents and reading progress", () => {
  const layout = readFileSync(join(root, "src/layouts/BlogPostLayout.astro"), "utf8");
  const styles = readFileSync(join(root, "src/styles/global.css"), "utf8");

  assert.match(layout, /const \{ Content, headings \} = await render\(post\)/);
  assert.match(layout, /depth >= 1 && depth <= 3/);
  assert.match(layout, /article-toc--desktop/);
  assert.match(layout, /<details class="article-toc article-toc--mobile">/);
  assert.match(layout, /On this page/);
  assert.match(layout, /role="progressbar"/);
  assert.match(layout, /aria-valuenow="0"/);
  assert.match(layout, /requestAnimationFrame\(updateReadingState\)/);
  assert.match(layout, /aria-current/);

  assert.match(styles, /\.reading-progress\s*\{[\s\S]*height:\s*3px/);
  assert.match(styles, /\.article-toc--desktop\s*\{[\s\S]*display:\s*none/);
  assert.match(styles, /@media \(min-width:\s*1100px\)[\s\S]*position:\s*sticky/);
  assert.match(styles, /\.article-toc--mobile\s*\{[\s\S]*border-top:/);
  assert.match(styles, /\.toc-link\.is-active\s*\{[\s\S]*--astro-paper-accent/);
  assert.match(styles, /scroll-margin-top:\s*6rem/);
});

test("home brand typography and rhythm match compact AstroPaper notes", () => {
  const layout = readFileSync(join(root, "src/layouts/BaseLayout.astro"), "utf8");
  const styles = readFileSync(join(root, "src/styles/global.css"), "utf8");

  assert.doesNotMatch(layout, /<footer[\s\S]*Technical notes in Markdown/);
  assert.match(styles, /Google Sans Code/);
  assert.match(styles, /--font-brand:\s*"Google Sans Code"/);
  assert.match(styles, /\.intro h1\s*\{[\s\S]*font-family:\s*var\(--font-brand\)/);
  assert.match(styles, /\.intro h1\s*\{[\s\S]*font-size:\s*clamp\(1\.85rem,\s*5vw,\s*3rem\)/);
  assert.match(styles, /\.intro\s*\{[\s\S]*padding-block:\s*2\.25rem 1\.25rem/);
  assert.match(styles, /\.listing,\s*\n\.page-title\s*\{[\s\S]*padding-block:\s*1\.1rem/);
  assert.match(styles, /\.post-item a\s*\{[\s\S]*min-height:\s*56px/);
  assert.match(styles, /\.article-shell\s*\{[\s\S]*padding:\s*clamp\(1\.25rem,\s*3vw,\s*2\.25rem\) 1rem/);
});

test("Sveltia CMS admin supports mobile GitHub publishing", () => {
  const admin = readFileSync(join(root, "public/admin/index.html"), "utf8");
  const cmsConfig = readFileSync(join(root, "public/admin/config.yml"), "utf8");
  const readme = readFileSync(join(root, "README.md"), "utf8");

  assert.match(admin, /<meta name="robots" content="noindex, nofollow" \/>/);
  assert.match(admin, /https:\/\/unpkg\.com\/@sveltia\/cms\/dist\/sveltia-cms\.js/);
  assert.match(admin, /<title>Kiwi's Blog CMS<\/title>/);

  assert.match(cmsConfig, /backend:\s*\n\s+name:\s+github/);
  assert.match(cmsConfig, /repo:\s+Kiwi-2025\/Kiwi-2025\.github\.io/);
  assert.match(cmsConfig, /branch:\s+main/);
  assert.match(cmsConfig, /media_folder:\s+public\/images/);
  assert.match(cmsConfig, /public_folder:\s+\/images/);
  assert.match(cmsConfig, /folder:\s+src\/content\/blog/);
  assert.match(cmsConfig, /create:\s+true/);
  assert.match(cmsConfig, /slug:\s+"\{\{slug\}\}"/);
  for (const field of ["title", "date", "description", "categories", "tags", "featured", "draft", "body"]) {
    assert.match(cmsConfig, new RegExp(`name:\\s+${field}`));
  }

  assert.match(readme, /## 手机写作后台/);
  assert.match(readme, /\/admin\//);
  assert.match(readme, /fine-grained personal access token/i);
  assert.match(readme, /public\/images/);
  assert.match(readme, /\/images\//);
});

test("blog content schema supports manual featured posts", () => {
  const contentConfig = readFileSync(join(root, "src/content.config.ts"), "utf8");
  assert.match(contentConfig, /featured:\s*z\.boolean\(\)\.default\(false\)/);
});

test("Sveltia CMS offers existing categories and tags as multi-select options", () => {
  const cmsConfig = readFileSync(join(root, "public/admin/config.yml"), "utf8");

  assert.match(cmsConfig, /name:\s+categories[\s\S]*?widget:\s+select[\s\S]*?multiple:\s+true/);
  for (const category of ["Notes", "生活", "机器人学", "光学", "软件开发", "工程笔记", "数学", "读书笔记", "随笔"]) {
    assert.match(cmsConfig, new RegExp(`- ${category}`));
  }

  assert.match(cmsConfig, /name:\s+tags[\s\S]*?widget:\s+select[\s\S]*?multiple:\s+true/);
  for (const tag of ["Optics", "history", "杂碎知识", "Robotics", "Astro", "Markdown", "GitHub Pages", "编程", "公式", "实验", "项目记录", "读书"]) {
    assert.match(cmsConfig, new RegExp(`- ${tag}`));
  }
});
