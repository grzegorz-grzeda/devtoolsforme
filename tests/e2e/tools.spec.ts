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

  await page.getByRole("button", { name: /UUID v5/i }).click();
  await page.getByLabel(/^Name$/).fill("example.com");
  await expect(codes.first()).toContainText("cfbff0d1-9375-5685-968c-48ce8b15ae17");

  await page.getByRole("button", { name: /UUID v3/i }).click();
  await page.getByLabel(/^Name$/).fill("example.com");
  await expect(codes.first()).toContainText("9073926b-929f-31c2-abc9-fad77ae3e8eb");
  await expect(page.getByText(/Version guide/i)).toBeVisible();
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

test("HTTP status lookup supports standard codes and scenario searches", async ({ page }) => {
  await page.goto("/tools/http-status");

  const input = page.getByPlaceholder("Try 404, websocket, retry-after, upload");

  await expect(page.getByRole("heading", { name: /404 Not Found/i })).toBeVisible();
  await expect(page.getByText(/Example use cases/i)).toBeVisible();
  await expect(page.getByText(/Troubleshooting \/ follow-up/i)).toBeVisible();

  await input.fill("websocket");
  await expect(page.getByRole("heading", { name: /101 Switching Protocols/i })).toBeVisible();
  await expect(page.getByText(/Showing 1 standard status code/i)).toBeVisible();

  await input.fill("captive portal");
  await expect(page.getByRole("heading", { name: /511 Network Authentication Required/i })).toBeVisible();
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

test("memory viewer groups bytes with offsets and ASCII", async ({ page }) => {
  await page.goto("/tools/memory-viewer");

  const input = page.locator("textarea").first();
  await input.click();
  await page.keyboard.press("Control+A");
  await input.fill("48656C6C6F");

  await expect(page.getByText(/0x0000/i)).toBeVisible();
  await expect(page.getByText(/48 65 6C 6C 6F/i)).toBeVisible();
  await expect(page.getByText(/^Hello$/)).toBeVisible();
});

test("Modbus RTU helper appends CRC bytes", async ({ page }) => {
  await page.goto("/tools/modbus-rtu-helper");

  await page.getByLabel("Slave").fill("01");
  await page.getByLabel("Function").selectOption("read-holding-registers");
  await page.getByLabel("Start address").fill("0x0010");
  await page.getByLabel("Quantity").fill("2");

  await expect(page.locator("div").filter({ hasText: /^Payload preview00 10 00 02$/ }).getByText(/^00 10 00 02$/)).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^Frame with CRC \(little-endian CRC bytes\)01 03 00 10 00 02 C5 CE$/ }).getByText(/^01 03 00 10 00 02 C5 CE$/)).toBeVisible();
});

test("fixed-point converter scales decimal into Q format", async ({ page }) => {
  await page.goto("/tools/fixed-point-converter");

  const input = page.locator("input").first();
  await input.fill("1.5");

  await expect(page.getByText(/Scaled integer/i)).toBeVisible();
  await expect(page.getByText(/^49152$/).first()).toBeVisible();
});

test("register field builder packs a field into a register", async ({ page }) => {
  await page.goto("/tools/register-field-builder");

  await page.getByRole("button", { name: /Remove/i }).nth(1).click();
  await page.getByLabel(/Base register value/i).fill("0x12345678");
  await page.getByLabel(/^Value$/).first().fill("0x3");
  await page.getByLabel(/^Offset$/).first().fill("8");
  await page.getByLabel(/^Width$/).first().fill("2");

  await expect(page.getByText(/Combined field mask/i)).toBeVisible();
  await expect(page.getByText(/0x00000300/i).first()).toBeVisible();
  await expect(page.getByText(/0x12345778/i)).toBeVisible();
});

test("PLL calculator derives final clock and period", async ({ page }) => {
  await page.goto("/tools/pll-calculator");

  const inputs = page.locator("input");
  await inputs.nth(0).fill("8000000");
  await inputs.nth(1).fill("1");
  await inputs.nth(2).fill("9");
  await inputs.nth(3).fill("2");

  await expect(page.getByText(/^VCO output$/)).toBeVisible();
  await expect(page.getByText(/36.000 MHz/i)).toBeVisible();
  await expect(page.getByText(/27.778 ns/i)).toBeVisible();
});

test("DMA throughput calculator estimates transfer cost", async ({ page }) => {
  await page.goto("/tools/dma-throughput-calculator");

  const inputs = page.locator("input");
  await inputs.nth(0).fill("120000000");
  await inputs.nth(1).fill("32");
  await inputs.nth(2).fill("4");
  await inputs.nth(3).fill("2");
  await inputs.nth(4).fill("4096");

  await expect(page.getByText(/Bursts required/i)).toBeVisible();
  await expect(page.getByText(/^256$/).first()).toBeVisible();
  await expect(page.getByText(/320.000 MB\/s/i)).toBeVisible();
});

test("Intel HEX inspector parses records and absolute address", async ({ page }) => {
  await page.goto("/tools/intel-hex-inspector");

  await expect(page.getByText(/Checksum errors/i)).toBeVisible();
  await expect(page.getByText(/0x08000000/i).first()).toBeVisible();
  await expect(page.getByText(/^16$/).first()).toBeVisible();
  await expect(page.getByText(/Extended linear 0x0800/i)).toBeVisible();
});

test("MQTT client renders browser connection controls", async ({ page }) => {
  await page.goto("/tools/mqtt-client");

  await expect(page.getByRole("heading", { name: "MQTT Client" })).toBeVisible();
  await expect(page.getByLabel(/Broker URL/i)).toHaveValue("ws://127.0.0.1:9001");
  await expect(page.getByRole("button", { name: /^Connect$/ })).toBeVisible();
  await expect(page.getByText(/TLS note:/i)).toBeVisible();
});

test("tool hero stays compact on desktop layouts", async ({ page }) => {
  await page.goto("/tools/mqtt-client");

  const hero = page.locator("main section > div").first();
  await expect(hero).toBeVisible();
  await expect(page.getByText(/inspect traffic directly in the browser/i)).toBeVisible();

  const box = await hero.boundingBox();
  expect(box?.height).toBeLessThan(180);
});

test("TLS key generator renders key generation controls", async ({ page }) => {
  await page.goto("/tools/tls-key-generator");

  await expect(page.getByRole("heading", { name: "TLS Key Generator" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^RSA$/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Generate/i })).toBeVisible();
});

test("certificate inspector parses PEM details", async ({ page }) => {
  await page.goto("/tools/certificate-inspector");

  await expect(page.getByText(/Serial number/i)).toBeVisible();
  await expect(page.getByText(/SHA-256 fingerprint/i)).toBeVisible();
});

test("CSR generator renders subject fields", async ({ page }) => {
  await page.goto("/tools/csr-generator");

  await expect(page.getByRole("heading", { name: "CSR Generator" })).toBeVisible();
  await expect(page.getByLabel(/Common name/i)).toHaveValue("devtoolsforme.local");
  await expect(page.getByRole("button", { name: /Generate CSR/i })).toBeVisible();
});

test("S-record inspector parses records and validates checksums", async ({ page }) => {
  await page.goto("/tools/s-record-inspector");

  await expect(page.getByText(/Checksum errors/i)).toBeVisible();
  await expect(page.getByText(/0x00000000/i).first()).toBeVisible();
  await expect(page.getByText(/Header/i)).toBeVisible();
});

test("two's complement converter shows signed and unsigned views", async ({ page }) => {
  await page.goto("/tools/twos-complement");

  await page.getByRole("button", { name: /8-bit/i }).click();
  await page.locator("input").first().fill("255");

  await expect(page.getByText(/^255$/).first()).toBeVisible();
  await expect(page.getByText(/^-1$/).first()).toBeVisible();
  await expect(page.getByText(/0xFF/i)).toBeVisible();
});

test("consent banner persists acceptance and recently opened tools appear on the my tools page", async ({ page, context }) => {
  await page.goto("/");

  const bannerButton = page.getByRole("button", { name: /Accept analytics/i });
  if (await bannerButton.isVisible()) {
    await bannerButton.click();
  }

  await page.goto("/tools/json-formatter");
  await expect(page.getByRole("heading", { name: "JSON Formatter" })).toBeVisible();

  await page.goto("/my-tools");
  await expect(page.getByText("Recent", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /JSON Formatter/i }).first()).toBeVisible();

  const consent = await page.evaluate(() => window.localStorage.getItem("dtfm-consent-analytics"));
  expect(consent === null || consent === "granted").toBeTruthy();

  await context.clearCookies();
});
