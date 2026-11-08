import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("starts with a blank tab and creates another in-memory document", async ({ page }) => {
  await expect(page.getByRole("tab", { name: "Untitled Document.md" })).toBeVisible();
  await expect(page.locator(".monaco-editor")).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "New document" }).click();
  await expect(page.getByRole("tab", { name: "Untitled Document.md" })).toHaveCount(2);
  await expect(page.evaluate(() => localStorage.length)).resolves.toBe(0);
});

test("edits the local document and updates its preview", async ({ page }) => {
  const editor = page.locator(".monaco-editor");
  await expect(editor).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "Enter zen mode" }).click();
  await expect(page.getByRole("button", { name: "Exit zen mode" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Enter zen mode" })).toBeVisible();
});

test("opens settings and changes editor preferences in memory", async ({ page }) => {
  await page.getByRole("button", { name: "Open settings" }).click();
  const settings = page.getByRole("dialog", { name: "Settings" });
  await settings.locator("#tab-size").selectOption("2");
  await expect(settings.locator("#tab-size")).toHaveValue("2");
  await expect(settings.getByText(/saved directly to disk/i)).toBeVisible();
  await expect(settings.getByText("GitHub")).toHaveCount(0);
});

test("does not expose file deletion controls", async ({ page }) => {
  await expect(page.getByRole("tablist", { name: "Open files" })).toBeVisible();
  await expect(page.getByText("Open files", { exact: true })).toHaveCount(0);
});
