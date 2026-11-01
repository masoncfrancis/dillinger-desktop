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

test("sidebar exposes open files and creation only", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const sidebar = page.locator("aside");
  await expect(sidebar.getByText("Open files", { exact: true })).toBeVisible();
  await expect(sidebar.getByRole("button", { name: "New Document" })).toBeVisible();
  await expect(sidebar.getByRole("button", { name: "Delete Document" })).toHaveCount(0);
  await expect(sidebar.getByText("Services", { exact: true })).toHaveCount(0);
});
