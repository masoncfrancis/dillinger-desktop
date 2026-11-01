import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("creates an in-memory document without session storage", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 2, name: "Untitled Document.md" })).toBeVisible();
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await page.getByRole("button", { name: "New Document" }).click();
  await expect(page.locator("aside ul button")).toHaveCount(2);
  await expect(page.evaluate(() => localStorage.length)).resolves.toBe(0);
});

test("edits the local document and updates its preview", async ({ page }) => {
  const editor = page.locator(".monaco-editor");
  await expect(editor).toBeVisible();
  await page.getByRole("button", { name: "Enter zen mode" }).click();
  await expect(page.getByRole("button", { name: "Exit zen mode" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Enter zen mode" })).toBeVisible();
});

test("opens settings and changes editor preferences in memory", async ({ page }) => {
  await page.getByRole("button", { name: "Open settings" }).click();
  await page.locator("#tab-size").selectOption("2");
  await expect(page.locator("#tab-size")).toHaveValue("2");
  await expect(page.getByText(/saved directly to disk/i)).toBeVisible();
  await expect(page.getByText("GitHub")).toHaveCount(0);
});

test("does not expose file deletion controls", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(page.getByRole("button", { name: "Delete Document" })).toHaveCount(0);
});
