import { test, expect } from "@playwright/test";

test("loads the editor shell and core controls", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: "Untitled Document.md" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Toggle sidebar" })).toBeVisible();
  await expect(page.locator("#preview")).toBeVisible();
  await expect(page.getByTestId("word-count")).toBeVisible();
  await expect(page.getByTestId("character-count")).toBeVisible();

  await page.getByRole("button", { name: "Hide preview" }).click();
  await expect(page.locator("#preview")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Show preview" })).toBeVisible();

  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
  await expect(page.getByRole("switch", { name: "Night Mode" })).toBeVisible();
});
