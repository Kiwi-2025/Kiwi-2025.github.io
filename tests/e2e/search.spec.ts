import { expect, test } from "@playwright/test";

test("search stays empty until a query and loads its index only once", async ({ page }) => {
  let indexRequests = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/search-index.json") indexRequests += 1;
  });

  await page.goto("/search/");
  await expect(page.locator("[data-search-status]")).toHaveText("Enter a keyword to search.");
  await expect(page.locator("[data-search-item]")).toHaveCount(0);
  await page.waitForTimeout(250);
  expect(indexRequests).toBe(0);

  const input = page.getByRole("searchbox");
  await input.fill("Optics");
  await expect(page.locator("[data-search-status]")).toContainText("notes");
  await expect(page.locator("[data-search-item]")).toHaveCount(4);
  expect(indexRequests).toBe(1);

  await input.fill("机器人学");
  await expect(page.locator('[data-search-item] a[href="/blog/robotics/"]')).toBeVisible();
  await expect(page.locator("[data-search-status]")).toHaveText("1 note");
  expect(indexRequests).toBe(1);
});

test("search matches title, summary, category, and tag metadata", async ({ page }) => {
  await page.goto("/search/");
  const input = page.getByRole("searchbox");

  await input.fill("Fourier Note");
  await expect(page.locator('[data-search-item] a[href="/blog/fourieroptics4/"]')).toBeVisible();

  await input.fill("scalar diffraction");
  await expect(page.locator('[data-search-item] a[href="/blog/fourieroptics2/"]')).toBeVisible();

  await input.fill("工程笔记");
  await expect(page.locator('[data-search-item] a[href="/blog/github-pages-jekyll-astro/"]')).toBeVisible();

  await input.fill("机器人学");
  await expect(page.locator('[data-search-item] a[href="/blog/robotics/"]')).toBeVisible();
});

test("search normalizes whitespace, punctuation, apostrophes, and partial terms", async ({ page }) => {
  await page.goto("/search/");
  const input = page.getByRole("searchbox");

  for (const [query, href] of [
    ["Super Typhoon Bavi", "/blog/super-typhoon-bavi/"],
    ["Goodman's", "/blog/fourieroptics1/"],
    ["thin lens", "/blog/fourieroptics4/"],
    ["optic", "/blog/fourieroptics4/"]
  ] as const) {
    await input.fill(query);
    await expect(page.locator(`[data-search-item] a[href="${href}"]`).first()).toBeVisible();
  }
});

test("deep links preserve unrelated URL state and clearing restores the prompt", async ({ page }) => {
  await page.goto("/search/?source=e2e&q=FOURIER%20%20NOTE#results");
  const input = page.getByRole("searchbox");

  await expect(page.locator('[data-search-item] a[href="/blog/fourieroptics1/"]')).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("fourier note");
  expect(new URL(page.url()).searchParams.get("source")).toBe("e2e");
  expect(new URL(page.url()).hash).toBe("#results");

  await input.fill("no-such-note");
  await expect(page.locator("[data-search-status]")).toHaveText("0 notes");
  await expect(page.locator(".search-empty")).toBeVisible();

  await input.fill("");
  await expect(page.locator("[data-search-status]")).toHaveText("Enter a keyword to search.");
  await expect(page.locator("[data-search-item]")).toHaveCount(0);
  expect(new URL(page.url()).searchParams.has("q")).toBe(false);
});

test("search renders large result sets in batches without treating titles as HTML", async ({ page }) => {
  const posts = Array.from({ length: 45 }, (_, index) => ({
    title: index === 0 ? "<img src=x onerror=alert(1)> Scale note" : `Scale note ${index + 1}`,
    description: "Synthetic pagination result",
    categories: ["Scale"],
    tags: ["Load test"],
    dateLabel: "2026/07/17",
    href: `/blog/scale-${index + 1}/`
  }));

  await page.route("**/search-index.json", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ posts })
  }));

  await page.goto("/search/");
  await page.getByRole("searchbox").fill("scale");
  await expect(page.locator("[data-search-status]")).toHaveText("45 notes");
  await expect(page.locator("[data-search-item]")).toHaveCount(20);
  await expect(page.getByRole("button", { name: "Load more" })).toBeVisible();
  await expect(page.locator("[data-search-item] img")).toHaveCount(0);
  await expect(page.locator("[data-search-item]").first()).toContainText("<img src=x onerror=alert(1)>");

  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.locator("[data-search-item]")).toHaveCount(40);
  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.locator("[data-search-item]")).toHaveCount(45);
  await expect(page.getByRole("button", { name: "Load more" })).toBeHidden();
});

test("search reports index failures without leaving stale results", async ({ page }) => {
  await page.route("**/search-index.json", (route) => route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({ error: "unavailable" })
  }));

  await page.goto("/search/");
  await page.getByRole("searchbox").fill("optics");
  await expect(page.locator("[data-search-status]")).toHaveText("Search unavailable");
  await expect(page.locator(".search-error")).toBeVisible();
  await expect(page.locator("[data-search-item]")).toHaveCount(0);
});

test("search index exposes only the expected metadata contract", async ({ page }) => {
  const response = await page.request.get("/search-index.json");
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(Array.isArray(payload.posts)).toBe(true);
  expect(payload.posts.length).toBeGreaterThan(0);

  for (const post of payload.posts) {
    expect(Object.keys(post).sort()).toEqual([
      "categories",
      "dateLabel",
      "description",
      "href",
      "tags",
      "title"
    ]);
    expect(post.href).toMatch(/^\/blog\/[^/]+\/$/);
    expect(post).not.toHaveProperty("body");
  }
});
