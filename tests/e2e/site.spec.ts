import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("core pages render and the theme toggle works", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const initialTheme = await page.locator("html").getAttribute("data-color-mode");
  await page.getByRole("button", { name: "Toggle color mode" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-color-mode", initialTheme ?? "");
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

const auditedPages = ["/"];

for (const path of auditedPages) {
  test(`has no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter(({ impact }) => impact === "critical" || impact === "serious");
    expect(blockingViolations).toEqual([]);
  });
}
