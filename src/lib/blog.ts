import { getCollection } from "astro:content";

export type BlogPost = Awaited<ReturnType<typeof getAllPosts>>[number];

export function slugFromId(id: string) {
  return id.replace(/\.md$/i, "").replace(/\/index$/i, "");
}

export function routePart(value: string) {
  return encodeURIComponent(value);
}

export function routeLabel(value: string | undefined) {
  const label = value ?? "";
  try {
    return decodeURIComponent(label);
  } catch {
    return label;
  }
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function readingMinutes(body: string) {
  const latinWords = body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const cjkCharacters = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  return Math.max(1, Math.ceil(latinWords / 220 + cjkCharacters / 400));
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

export function getPostNavigation(posts: BlogPost[], post: BlogPost) {
  const index = posts.findIndex((candidate) => candidate.id === post.id);
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined
  };
}

export function getRelatedPosts(posts: BlogPost[], post: BlogPost, limit = 3) {
  const categories = new Set(post.data.categories);
  const tags = new Set(post.data.tags);

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      score:
        candidate.data.categories.filter((category) => categories.has(category)).length * 2 +
        candidate.data.tags.filter((tag) => tags.has(tag)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.valueOf() - a.post.data.date.valueOf())
    .slice(0, limit)
    .map(({ post: relatedPost }) => relatedPost);
}

function countTerms(terms: string[]) {
  const counts = new Map<string, number>();
  for (const term of terms) counts.set(term, (counts.get(term) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}
