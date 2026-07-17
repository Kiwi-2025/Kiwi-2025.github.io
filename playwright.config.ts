import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4321",
    browserName: "chromium",
    channel: "msedge",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "mobile-360",
      use: { viewport: { width: 360, height: 800 } }
    },
    {
      name: "tablet-768",
      use: { viewport: { width: 768, height: 1024 } }
    },
    {
      name: "desktop-1440",
      use: { viewport: { width: 1440, height: 900 } }
    }
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
