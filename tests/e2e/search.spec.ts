import { expect, test } from "@playwright/test";

// 冒烟测试：只验证“输入关键词 → 能出结果”这条主链路，
// 不校验具体命中哪几篇文章，发新文章不会把 CI 弄红。
test("search loads the index on demand and renders results", async ({ page }) => {
  let indexRequests = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/search-index.json") indexRequests += 1;
  });

  await page.goto("/search/");
  await expect(page.locator("[data-search-item]")).toHaveCount(0);
  expect(indexRequests).toBe(0);

  await page.getByRole("searchbox").fill("the");
  await expect(page.locator("[data-search-item]").first()).toBeVisible();
  await expect(page.locator("[data-search-status]")).toContainText("note");
  expect(indexRequests).toBe(1);
});
