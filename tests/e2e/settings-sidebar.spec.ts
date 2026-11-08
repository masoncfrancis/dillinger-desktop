import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("settings are available without persisted session state", async ({ page }) => {
  await page.getByRole("button", { name: "Open settings" }).click();
  const settings = page.getByRole("dialog", { name: "Settings" });
  await expect(settings).toBeVisible();
  await expect(settings.getByText(/saved directly to disk/i)).toBeVisible();
  await expect(settings.getByText("Auto Save", { exact: true })).toHaveCount(0);
  await expect(settings.getByText("GitHub")).toHaveCount(0);
  await expect(page.evaluate(() => localStorage.length)).resolves.toBe(0);
});

test("tabs expose open files without a sidebar", async ({ page }) => {
  await expect(page.getByRole("tablist", { name: "Open files" })).toBeVisible();
  await expect(page.locator("aside")).toHaveCount(0);
});
