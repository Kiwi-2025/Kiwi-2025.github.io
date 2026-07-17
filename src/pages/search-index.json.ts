import type { APIRoute } from "astro";
import { formatDate, getAllPosts, slugFromId } from "@/lib/blog";

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  return new Response(JSON.stringify({
    posts: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      categories: post.data.categories,
      tags: post.data.tags,
      dateLabel: formatDate(post.data.date),
      href: `/blog/${slugFromId(post.id)}/`
    }))
  }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};
