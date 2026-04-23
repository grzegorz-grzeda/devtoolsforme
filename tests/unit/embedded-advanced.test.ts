import { describe, expect, it } from "vitest";
import {
  formatHex,
  groupHexBytes,
  parseHexPairs,
  parseIntelHex,
  parseNumericInput,
  parseSRecord,
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
});

describe("parseIntelHex", () => {
  it("parses extended linear addresses and summarizes data", () => {
    const parsed = parseIntelHex(`:020000040800F2\n:040010001122334442\n:00000001FF`);

    expect(parsed.summary.recordCount).toBe(3);
    expect(parsed.summary.dataBytes).toBe(4);
    expect(parsed.summary.checksumErrors).toBe(0);
    expect(parsed.summary.highestAddress).toBe(0x08000013);
    expect(parsed.records[1]?.absoluteAddress).toBe(0x08000010);
    expect(parsed.records[1]?.data).toEqual([0x11, 0x22, 0x33, 0x44]);
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
