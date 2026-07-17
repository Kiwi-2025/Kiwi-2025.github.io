import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const auditedPages = ["/", "/blog/fourieroptics2/", "/search/"];

test("homepage and milestone timeline render without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Milestone" })).toBeVisible();
  const milestoneDates = await page.locator(".milestone-date").allTextContents();
  expect(milestoneDates[0]).toContain("2026");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("article structure, reading progress, and theme toggle work", async ({ page }) => {
  await page.goto("/blog/fourieroptics2/");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".reading-progress")).toHaveAttribute("aria-valuenow", "0");

  const initialTheme = await page.locator("html").getAttribute("data-color-mode");
  await page.getByRole("button", { name: "Toggle color mode" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-color-mode", initialTheme ?? "");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => Number(await page.locator(".reading-progress").getAttribute("aria-valuenow"))).toBeGreaterThan(0);

  const adjacentLinks = page.locator(".post-navigation__link");
  await expect(adjacentLinks).toHaveCount(2);
  const firstBox = await adjacentLinks.nth(0).boundingBox();
  const secondBox = await adjacentLinks.nth(1).boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  const navigationGap = (page.viewportSize()?.width ?? 0) <= 640
    ? secondBox!.y - (firstBox!.y + firstBox!.height)
    : secondBox!.x - (firstBox!.x + firstBox!.width);
  expect(navigationGap).toBeGreaterThanOrEqual(15);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("search filters notes and persists the normalized query", async ({ page }) => {
  await page.goto("/search/");
  const input = page.getByRole("searchbox");

  await input.fill("Optics");
  await expect(page.locator("[data-search-item]:visible")).toHaveCount(3);
  await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("optics");

  await input.fill("no-such-note");
  await expect(page.locator("[data-search-item]:visible")).toHaveCount(0);
  await expect(page.locator(".search-empty")).toBeVisible();
});

test("search input follows the light and dark palettes", async ({ page }) => {
  await page.goto("/search/");
  const input = page.getByRole("searchbox");

  await expect(input).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(input).toHaveCSS("color", "rgb(17, 24, 39)");

  await page.getByRole("button", { name: "Toggle color mode" }).click();
  await expect(input).toHaveCSS("background-color", "rgb(17, 24, 39)");
  await expect(input).toHaveCSS("color", "rgb(248, 250, 252)");
});

test("category, tag, and 404 routes expose expected metadata", async ({ page }) => {
  await page.goto("/categories/Notes/");
  await expect(page.locator("h1")).toHaveText("Notes");

  await page.goto("/tags/Optics/");
  await expect(page.locator("h1")).toHaveText("#Optics");

  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");

  await page.goto("/search/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

test("internal navigation links resolve", async ({ page }) => {
  const links = new Set<string>();

  for (const hub of ["/", "/blog/", "/categories/", "/tags/"]) {
    await page.goto(hub);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).href)
    )) {
      const url = new URL(href);
      url.hash = "";
      links.add(url.href);
    }
  }

  for (const url of links) {
    const response = await page.request.get(url);
    expect.soft(response.status(), url).toBeLessThan(400);
  }
});

for (const path of auditedPages) {
  test(`has no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
    expect(blockingViolations).toEqual([]);
  });
}
