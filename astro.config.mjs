import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default defineConfig({
  site: process.env.SITE ?? "https://Kiwi-2025.github.io",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
