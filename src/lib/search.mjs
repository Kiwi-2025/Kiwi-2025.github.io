export const SEARCH_PAGE_SIZE = 20;

const whitespacePattern = /\s+/gu;
const separatorPattern = /[\p{P}\p{S}]+/gu;

export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("zh-CN")
    .replace(separatorPattern, " ")
    .replace(whitespacePattern, " ")
    .trim();
}

export function normalizeUrlQuery(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(whitespacePattern, " ")
    .toLocaleLowerCase("zh-CN");
}

export function tokenizeSearchQuery(value) {
  const normalized = normalizeSearchText(value);
  return normalized ? normalized.split(" ") : [];
}

export function prepareSearchPosts(posts) {
  return posts.map((post) => ({
    ...post,
    searchText: normalizeSearchText([
      post.title,
      post.description,
      ...(Array.isArray(post.categories) ? post.categories : []),
      ...(Array.isArray(post.tags) ? post.tags : [])
    ].filter(Boolean).join(" "))
  }));
}

export function filterSearchPosts(posts, query) {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return [];
  return posts.filter((post) => tokens.every((token) => post.searchText.includes(token)));
}

export function nextVisibleCount(current, total, pageSize = SEARCH_PAGE_SIZE) {
  return Math.min(Math.max(0, current) + pageSize, Math.max(0, total));
}
