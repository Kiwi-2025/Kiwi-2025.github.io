import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://Kiwi-2025.github.io");
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${new URL("/sitemap-index.xml", base)}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
