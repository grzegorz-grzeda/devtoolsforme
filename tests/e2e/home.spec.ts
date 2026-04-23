import { expect, test } from "@playwright/test";

test("homepage loads and links to tool pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Pocket-sized developer tools/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /JSON Formatter/i }).first()).toBeVisible();

  await page.getByRole("link", { name: /UUID Generator/i }).first().click();
  await expect(page).toHaveURL(/\/tools\/uuid$/);
  await expect(page.getByRole("heading", { name: "UUID Generator" })).toBeVisible();
});

test("404 page renders useful recovery actions", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");

  await expect(page.getByRole("heading", { name: /slipped off the workbench/i })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Browse all tools/i })).toBeVisible();
});
