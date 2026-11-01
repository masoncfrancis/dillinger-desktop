import { test, expect } from "@playwright/test";

test("does not render advertising", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#logobar")).toHaveCount(0);
  await expect(page.locator('script[src*="servedby-buysellads"]')).toHaveCount(0);
});
