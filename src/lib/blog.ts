import { getCollection } from "astro:content";

export type BlogPost = Awaited<ReturnType<typeof getAllPosts>>[number];

export function slugFromId(id: string) {
  return id.replace(/\.md$/i, "").replace(/\/index$/i, "");
}

export function routePart(value: string) {
  return encodeURIComponent(value);
}

export function routeLabel(value: string | undefined) {
  return decodeURIComponent(value ?? "");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export async function getAllPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getCategories(posts: BlogPost[]) {
  return countTerms(posts.flatMap((post) => post.data.categories));
}

export function getTags(posts: BlogPost[]) {
  return countTerms(posts.flatMap((post) => post.data.tags));
}

function countTerms(terms: string[]) {
  const counts = new Map<string, number>();
  for (const term of terms) counts.set(term, (counts.get(term) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}
