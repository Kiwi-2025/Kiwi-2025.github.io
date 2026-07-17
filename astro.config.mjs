import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { rehypeOptimizeImages } from "./src/lib/rehype-optimize-images.mjs";

export default defineConfig({
  site: process.env.SITE ?? "https://Kiwi-2025.github.io",
  integrations: [sitemap({
    filter: (page) => !page.endsWith("/search/")
  })],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeOptimizeImages]
  }
});
