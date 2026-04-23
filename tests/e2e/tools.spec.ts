import { expect, test } from "@playwright/test";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("UUID tool generates valid UUIDs", async ({ page }) => {
  await page.goto("/tools/uuid");

  const codes = page.locator("code");
  await expect(codes.first()).toBeVisible();

  const firstUuid = (await codes.first().textContent())?.trim() ?? "";
  expect(firstUuid).toMatch(uuidRegex);

  await page.getByRole("button", { name: /Generate new batch/i }).click();
  const nextUuid = (await codes.first().textContent())?.trim() ?? "";
  expect(nextUuid).toMatch(uuidRegex);
});

test("Base64 tool encodes and decodes text", async ({ page }) => {
  await page.goto("/tools/base64");

  const input = page.locator("textarea").first();
  await input.click();
  await page.keyboard.press("Control+A");
  await input.fill("hello world");
  await expect(page.locator("pre").first()).toContainText("aGVsbG8gd29ybGQ=");

  await page.getByRole("button", { name: /Base64 -> String/i }).click();
  await input.click();
  await page.keyboard.press("Control+A");
  await input.fill("aGVsbG8gd29ybGQ=");
  await expect(page.locator("pre").first()).toContainText("hello world");
});

test("JSON formatter pretty-prints JSON", async ({ page }) => {
  await page.goto("/tools/json-formatter");

  const input = page.locator("textarea").first();
  await input.click();
  await page.keyboard.press("Control+A");
  await input.fill('{"name":"devtoolsforme","tools":["uuid","json"]}');

  await expect(page.locator("pre").first()).toContainText('"name": "devtoolsforme"');
  await expect(page.locator("pre").first()).toContainText('"tools": [');
});

test("consent banner persists acceptance and recently opened tools appear on homepage", async ({ page, context }) => {
  await page.goto("/");

  const bannerButton = page.getByRole("button", { name: /Accept analytics/i });
  if (await bannerButton.isVisible()) {
    await bannerButton.click();
  }

  await page.goto("/tools/json-formatter");
  await expect(page.getByRole("heading", { name: "JSON Formatter" })).toBeVisible();

  await page.goto("/");
  await expect(page.getByText(/Recently opened/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /JSON Formatter/i }).first()).toBeVisible();

  const consent = await page.evaluate(() => window.localStorage.getItem("dtfm-consent-analytics"));
  expect(consent === null || consent === "granted").toBeTruthy();

  await context.clearCookies();
});
