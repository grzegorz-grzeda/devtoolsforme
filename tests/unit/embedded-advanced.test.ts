import { describe, expect, it } from "vitest";
import {
  bytesToCArray,
  convertImageDataToMonochromeBytes,
  convertImageDataToSsd1309Bytes,
  formatHex,
  groupHexBytes,
  packHorizontalBytes,
  packMonochromeBytes,
  packSsd1309Bytes,
  parseHexPairs,
  parseIntelHex,
  parseNumericInput,
  parseSRecord,
  rgbaToMonochromePixels,
} from "../../lib/embedded-advanced";

describe("parseNumericInput", () => {
  it("parses decimal, hex, and binary forms", () => {
    expect(parseNumericInput("42")).toBe(42);
    expect(parseNumericInput("0x2A")).toBe(42);
    expect(parseNumericInput("0b101010")).toBe(42);
  });

  it("returns null for unsupported forms", () => {
    expect(parseNumericInput("")).toBeNull();
    expect(parseNumericInput("12.5")).toBeNull();
    expect(parseNumericInput("0xZZ")).toBeNull();
  });
});

describe("formatting helpers", () => {
  it("formats hex and groups bytes", () => {
    expect(formatHex(255, 4)).toBe("0x00FF");
    expect(groupHexBytes([0x12, 0xab, 0x0f])).toBe("12 AB 0F");
    expect(parseHexPairs("12 ab 0f")).toEqual([0x12, 0xab, 0x0f]);
  });

  it("formats byte arrays as C source", () => {
    expect(bytesToCArray("logo", [0x01, 0xab, 0xff], 2)).toBe(
      "const uint8_t logo[] = {\n  0x01, 0xAB,\n  0xFF\n};",
    );
  });
});

describe("ssd1309 bitmap helpers", () => {
  it("converts rgba pixels into monochrome bits", () => {
    const rgba = new Uint8ClampedArray([
      0, 0, 0, 255,
      255, 255, 255, 255,
      127, 127, 127, 255,
      255, 255, 255, 0,
    ]);

    expect(rgbaToMonochromePixels(rgba, 2, 2, 128)).toEqual([1, 0, 1, 0]);
  });

  it("packs pixels in SSD1309 page order", () => {
    const pixels = [
      1, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 0,
      0, 1,
    ];

    expect(packSsd1309Bytes(pixels, 2, 8)).toEqual([0x55, 0xaa]);
  });

  it("packs pixels in horizontal MSB-first order", () => {
    const pixels = [
      1, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 1, 0, 1,
    ];

    expect(packHorizontalBytes(pixels, 8, 2)).toEqual([0xaa, 0x55]);
    expect(packMonochromeBytes(pixels, 8, 2, "horizontal-msb")).toEqual([0xaa, 0x55]);
  });

  it("converts image data directly into SSD1309 bytes", () => {
    const rgba = new Uint8ClampedArray([
      0, 0, 0, 255,
      255, 255, 255, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      255, 255, 255, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
    ]);

    const converted = convertImageDataToSsd1309Bytes(rgba, 1, 8, 128);

    expect(converted.pixels).toEqual([1, 0, 0, 1, 1, 0, 0, 1]);
    expect(converted.bytes).toEqual([0x99]);
  });

  it("converts image data directly into horizontal bytes", () => {
    const rgba = new Uint8ClampedArray([
      0, 0, 0, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
      255, 255, 255, 255,
    ]);

    const converted = convertImageDataToMonochromeBytes(rgba, 4, 2, 128, false, "horizontal-msb");

    expect(converted.pixels).toEqual([1, 0, 1, 0, 1, 0, 1, 0]);
    expect(converted.bytes).toEqual([0xa0, 0xa0]);
  });
});

describe("parseIntelHex", () => {
  it("parses extended linear addresses and summarizes data", () => {
    const parsed = parseIntelHex(`:020000040800F2\n:040010001122334442\n:04002000AABBCCDDCE\n:00000001FF`);

    expect(parsed.summary.recordCount).toBe(4);
    expect(parsed.summary.dataBytes).toBe(8);
    expect(parsed.summary.checksumErrors).toBe(0);
    expect(parsed.summary.lowestAddress).toBe(0x08000010);
    expect(parsed.summary.highestAddress).toBe(0x08000023);
    expect(parsed.summary.spanCount).toBe(2);
    expect(parsed.summary.gapCount).toBe(1);
    expect(parsed.summary.largestGap).toBe(12);
    expect(parsed.records[1]?.absoluteAddress).toBe(0x08000010);
    expect(parsed.records[1]?.data).toEqual([0x11, 0x22, 0x33, 0x44]);
    expect(parsed.spans[1]).toMatchObject({
      start: 0x08000020,
      end: 0x08000023,
      bytes: 4,
      gapBefore: 12,
    });
  });

  it("flags checksum and syntax failures", () => {
    const parsed = parseIntelHex(`020000040800F2\n:040000001122334451\n:00000001FF`);

    expect(parsed.summary.checksumErrors).toBe(2);
    expect(parsed.records[0]?.note).toBe("Missing leading colon");
    expect(parsed.records[1]?.checksumValid).toBe(false);
  });
});

describe("parseSRecord", () => {
  it("parses S1 data records and summary info", () => {
    const parsed = parseSRecord(`S00600004844521B\nS1070010DEADBEEFB0\nS9030000FC`);

    expect(parsed.summary.recordCount).toBe(3);
    expect(parsed.summary.dataBytes).toBe(4);
    expect(parsed.summary.checksumErrors).toBe(0);
    expect(parsed.summary.highestAddress).toBe(0x0013);
    expect(parsed.records[1]?.address).toBe(0x0010);
    expect(parsed.records[1]?.data).toEqual([0xde, 0xad, 0xbe, 0xef]);
  });

  it("flags unsupported and malformed records", () => {
    const parsed = parseSRecord(`SZ0000\nS1070010DEADBEEFB1`);

    expect(parsed.summary.checksumErrors).toBe(2);
    expect(parsed.records[0]?.note).toBe("Unsupported record type");
    expect(parsed.records[1]?.checksumValid).toBe(false);
  });
});
