import { expect, test } from "@playwright/test";

test("homepage loads and links to tool pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Free developer tools\. Built by an embedded engineer\./i })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /Search tools/i })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "My tools" })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "My tools" })).toBeVisible();

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

test("saved tool lists live on the my tools page", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("dtfm-favorite-tools", JSON.stringify(["uuid"]));
    window.localStorage.setItem("dtfm-recent-tools", JSON.stringify(["json-formatter"]));
    window.localStorage.setItem("dtfm-tool-open-counts", JSON.stringify({ "crc-calculator": 3 }));
  });

  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "My tools" }).click();

  await expect(page).toHaveURL(/\/my-tools$/);
  await expect(page.getByRole("heading", { name: /Your tool lists/i })).toBeVisible();
  await expect(page.getByText("Favorites", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /UUID Generator/i })).toBeVisible();
  await expect(page.getByText("Recent", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /JSON Formatter/i })).toBeVisible();
  await expect(page.getByText("Popular", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /CRC Calculator/i })).toBeVisible();
});

test("404 page renders useful recovery actions", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");

  await expect(page.getByRole("heading", { name: /slipped off the workbench/i })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Browse all tools/i })).toBeVisible();
});
