import assert from "node:assert/strict";
import test from "node:test";
import {
  SEARCH_PAGE_SIZE,
  filterSearchPosts,
  nextVisibleCount,
  normalizeSearchText,
  normalizeUrlQuery,
  prepareSearchPosts,
  tokenizeSearchQuery
} from "../src/lib/search.mjs";

const posts = prepareSearchPosts([
  {
    title: "Fourier Optics Note-1",
    description: "Based on Goodman’s book",
    categories: ["Notes"],
    tags: ["Optics"]
  },
  {
    title: "Super Typhoon  Bavi",
    description: "My story with Typhoon",
    categories: ["随笔"],
    tags: ["生活"]
  },
  {
    title: "机器人学札记",
    description: "机械臂运动学",
    categories: ["工程笔记"],
    tags: ["Robotics"]
  }
]);

test("normalization handles Unicode, punctuation, and repeated whitespace", () => {
  assert.equal(normalizeSearchText("  ＦＯＵＲＩＥＲ   Optics—Note  "), "fourier optics note");
  assert.deepEqual(tokenizeSearchQuery("Goodman's thin-lens"), ["goodman", "s", "thin", "lens"]);
  assert.equal(normalizeUrlQuery("  Fourier   Note-1  "), "fourier note-1");
});

test("filtering matches across metadata fields and empty input returns nothing", () => {
  // 命中的字段各不相同（标题/描述/分类/标签/大小写/部分词），不用关心具体几篇；
  // 关键是每个查询都恰好命中同一篇，且互不串扰。
  for (const query of ["Fourier Note", "Goodman's", "typhoon", "机器人学", "optic", "Goodman", "Typhoon Bavi"]) {
    assert.equal(filterSearchPosts(posts, query).length, 1, query);
  }
  assert.equal(filterSearchPosts(posts, "Fourier Robotics").length, 0);
  assert.deepEqual(filterSearchPosts(posts, ""), []);
});

test("visible result count advances in bounded pages", () => {
  assert.equal(SEARCH_PAGE_SIZE, 20);
  assert.equal(nextVisibleCount(0, 45), 20);
  assert.equal(nextVisibleCount(20, 45), 40);
  assert.equal(nextVisibleCount(40, 45), 45);
  assert.equal(nextVisibleCount(45, 45), 45);
  assert.equal(nextVisibleCount(-10, 5), 5);
});
