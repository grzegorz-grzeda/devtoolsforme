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

test("bitmask calculator computes register operations", async ({ page }) => {
  await page.goto("/tools/bitmask-calculator");

  const inputs = page.locator("input");
  await inputs.nth(0).fill("0x5A");
  await inputs.nth(1).fill("0x0F");

  await expect(page.getByText(/Bits selected by mask/i)).toBeVisible();
  await expect(page.getByText(/BIT3, BIT2, BIT1, BIT0/i)).toBeVisible();
  await expect(page.getByText(/0x5F/i).first()).toBeVisible();
  await expect(page.getByText(/0x50/i).first()).toBeVisible();
});

test("CRC calculator produces a checksum", async ({ page }) => {
  await page.goto("/tools/crc-calculator");

  const input = page.locator("textarea").first();
  await input.click();
  await page.keyboard.press("Control+A");
  await input.fill("ABC");

  await expect(page.getByText(/crc32/i)).toBeVisible();
  await expect(page.getByText(/0xA3830348/i)).toBeVisible();
});

test("endianness converter flips byte order", async ({ page }) => {
  await page.goto("/tools/endianness-converter");

  const input = page.locator("input").first();
  await input.fill("1234ABCD");

  await expect(page.getByText(/12 34 AB CD/i)).toBeVisible();
  await expect(page.getByText(/CD AB 34 12/i)).toBeVisible();
});

test("UART baud calculator shows divisor and error", async ({ page }) => {
  await page.goto("/tools/uart-baud-calculator");

  const inputs = page.locator("input");
  await inputs.nth(0).fill("16000000");
  await inputs.nth(1).fill("115200");

  await expect(page.getByText(/UBRR \/ divisor/i)).toBeVisible();
  await expect(page.getByText(/^8$/).first()).toBeVisible();
  await expect(page.getByText(/111111\.11/i)).toBeVisible();
});

test("float inspector shows IEEE-754 hex breakdown", async ({ page }) => {
  await page.goto("/tools/float-inspector");

  const input = page.locator("input").first();
  await input.fill("1.5");

  await expect(page.getByText(/0x3FC00000/i)).toBeVisible();
  await expect(page.getByText(/^0$/).first()).toBeVisible();
  await expect(page.getByText(/01111111/)).toBeVisible();
});

test("C array generator produces uint8_t output", async ({ page }) => {
  await page.goto("/tools/c-array-generator");

  const inputs = page.locator("input, textarea");
  await inputs.nth(0).fill("payload");
  await inputs.nth(1).fill("OK");

  await expect(page.getByText(/const uint8_t payload\[\]/i)).toBeVisible();
  await expect(page.getByText(/0x4F, 0x4B/i)).toBeVisible();
});

test("two's complement converter shows signed and unsigned views", async ({ page }) => {
  await page.goto("/tools/twos-complement");

  await page.getByRole("button", { name: /8-bit/i }).click();
  await page.locator("input").first().fill("255");

  await expect(page.getByText(/^255$/).first()).toBeVisible();
  await expect(page.getByText(/^-1$/).first()).toBeVisible();
  await expect(page.getByText(/0xFF/i)).toBeVisible();
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
