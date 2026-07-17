import rss from "@astrojs/rss";
import { getAllPosts, slugFromId } from "@/lib/blog";
import { site } from "@/site.config";

export async function GET(context: { site?: URL }) {
  const posts = await getAllPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? "https://Kiwi-2025.github.io",
    customData: `<language>${site.lang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${slugFromId(post.id)}/`,
      categories: [...post.data.categories, ...post.data.tags]
    }))
  });
}
