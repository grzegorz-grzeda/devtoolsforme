import { expect, test } from "@playwright/test";

test("homepage loads and links to tool pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Quick browser tools for developer workflows/i })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /Search tools/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Browse embedded/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Embedded tools/i })).toBeVisible();

  await page.getByRole("link", { name: /UUID Generator/i }).first().click();
  await expect(page).toHaveURL(/\/tools\/uuid$/);
  await expect(page.getByRole("heading", { name: "UUID Generator" })).toBeVisible();
});

test("homepage search can filter to embedded tools", async ({ page }) => {
  await page.goto("/");

  const search = page.getByPlaceholder(/Find hex, regex, json, crc, uart/i);
  await search.fill("crc");

  await expect(page.getByRole("link", { name: /CRC Calculator/i }).first()).toBeVisible();
  await expect(page.getByText(/Showing/i)).toBeVisible();
});

test("404 page renders useful recovery actions", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");

  await expect(page.getByRole("heading", { name: /slipped off the workbench/i })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Browse all tools/i })).toBeVisible();
});
