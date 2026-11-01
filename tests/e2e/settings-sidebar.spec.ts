import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("settings are available without persisted session state", async ({ page }) => {
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
  await expect(page.getByText(/saved directly to disk/i)).toBeVisible();
  await expect(page.getByText("Auto Save", { exact: true })).toHaveCount(0);
  await expect(page.getByText("GitHub")).toHaveCount(0);
  await expect(page.evaluate(() => localStorage.length)).resolves.toBe(0);
});

test("sidebar exposes open files and creation only", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(page.getByText("Open files")).toBeVisible();
  await expect(page.getByRole("button", { name: "New Document" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete Document" })).toHaveCount(0);
  await expect(page.getByText("Services")).toHaveCount(0);
});
