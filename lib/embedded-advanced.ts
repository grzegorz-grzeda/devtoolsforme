export function parseNumericInput(raw: string) {
  const value = raw.trim();
  if (!value) return null;

  if (/^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value.slice(2), 16);
  if (/^0b[01]+$/i.test(value)) return Number.parseInt(value.slice(2), 2);
  if (/^[0-9]+$/.test(value)) return Number.parseInt(value, 10);

  return null;
}

export function formatHex(value: number, width = 2) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(width, "0")}`;
}

export function groupHexBytes(bytes: number[]) {
  return bytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, "0")).join(" ");
}

export function parseHexPairs(input: string) {
  const cleaned = input.replace(/[^0-9a-fA-F]/g, "");
  if (!cleaned) return [];
  const pairs = cleaned.match(/.{1,2}/g) ?? [];
  return pairs.filter((pair) => pair.length === 2).map((pair) => Number.parseInt(pair, 16));
}

export function wordToBytes(value: number) {
  const normalized = value & 0xffff;
  return [(normalized >> 8) & 0xff, normalized & 0xff];
}

export function parseBooleanList(input: string) {
  return input
    .split(/[^01]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item === "1");
}

export function parseWordList(input: string) {
  return input
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => parseNumericInput(item))
    .filter((value): value is number => value !== null)
    .map((value) => value & 0xffff);
}

export function packCoils(values: boolean[]) {
  const bytes = new Array<number>(Math.ceil(values.length / 8)).fill(0);
  values.forEach((value, index) => {
    if (!value) return;
    bytes[Math.floor(index / 8)] |= 1 << (index % 8);
  });
  return bytes;
}

export function unpackCoils(bytes: number[], count: number) {
  return Array.from({ length: count }, (_, index) => {
    const byte = bytes[Math.floor(index / 8)] ?? 0;
    return ((byte >> (index % 8)) & 1) === 1;
  });
}

export type ModbusRequestKind =
  | "read-coils"
  | "read-discrete-inputs"
  | "read-holding-registers"
  | "read-input-registers"
  | "write-single-coil"
  | "write-single-register"
  | "write-multiple-coils"
  | "write-multiple-registers"
  | "custom";

export type ModbusRequestConfig = {
  kind: ModbusRequestKind;
  startAddress?: number;
  quantity?: number;
  coilValue?: boolean;
  registerValue?: number;
  coilValues?: boolean[];
  registerValues?: number[];
  customPayload?: string;
};

export function buildModbusRequestPayload(config: ModbusRequestConfig) {
  const { kind } = config;
  if (kind === "custom") return { functionCode: null, payloadBytes: parseHexPairs(config.customPayload ?? "") };

  const startAddress = config.startAddress ?? 0;
  const quantity = config.quantity ?? 0;

  switch (kind) {
    case "read-coils":
      return { functionCode: 0x01, payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(quantity)] };
    case "read-discrete-inputs":
      return { functionCode: 0x02, payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(quantity)] };
    case "read-holding-registers":
      return { functionCode: 0x03, payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(quantity)] };
    case "read-input-registers":
      return { functionCode: 0x04, payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(quantity)] };
    case "write-single-coil":
      return { functionCode: 0x05, payloadBytes: [...wordToBytes(startAddress), ...(config.coilValue ? [0xff, 0x00] : [0x00, 0x00])] };
    case "write-single-register":
      return { functionCode: 0x06, payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(config.registerValue ?? 0)] };
    case "write-multiple-coils": {
      const values = config.coilValues ?? [];
      const packed = packCoils(values);
      return {
        functionCode: 0x0f,
        payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(values.length), packed.length, ...packed],
      };
    }
    case "write-multiple-registers": {
      const values = config.registerValues ?? [];
      return {
        functionCode: 0x10,
        payloadBytes: [...wordToBytes(startAddress), ...wordToBytes(values.length), values.length * 2, ...values.flatMap((value) => wordToBytes(value))],
      };
    }
  }
}

export function validateModbusRequestConfig(config: ModbusRequestConfig) {
  const issues: string[] = [];

  if (config.kind === "custom") {
    if ((config.customPayload ?? "").trim().length === 0) issues.push("Enter payload bytes for the custom request.");
    return issues;
  }

  if (config.startAddress === undefined || config.startAddress < 0 || config.startAddress > 0xffff) {
    issues.push("Start address must be between 0 and 65535.");
  }

  if (
    config.kind === "read-coils" ||
    config.kind === "read-discrete-inputs" ||
    config.kind === "read-holding-registers" ||
    config.kind === "read-input-registers"
  ) {
    if (!config.quantity || config.quantity <= 0 || config.quantity > 125) {
      issues.push("Quantity must be between 1 and 125 for register/bit reads.");
    }
  }

  if (config.kind === "write-single-register") {
    if (config.registerValue === undefined || config.registerValue < 0 || config.registerValue > 0xffff) {
      issues.push("Register value must be between 0 and 65535.");
    }
  }

  if (config.kind === "write-multiple-coils") {
    const values = config.coilValues ?? [];
    if (values.length === 0) issues.push("Enter at least one coil value.");
    if (values.length > 1968) issues.push("Write multiple coils supports up to 1968 coil values per request.");
  }

  if (config.kind === "write-multiple-registers") {
    const values = config.registerValues ?? [];
    if (values.length === 0) issues.push("Enter at least one register value.");
    if (values.length > 123) issues.push("Write multiple registers supports up to 123 registers per request.");
  }

  return issues;
}

export function bytesToCArray(name: string, bytes: number[], columns = 12) {
  const safeName = name.trim() || "payload";
  if (bytes.length === 0) return `const uint8_t ${safeName}[] = {};
`;

  const lines: string[] = [];
  for (let index = 0; index < bytes.length; index += columns) {
    const slice = bytes.slice(index, index + columns);
    lines.push(`  ${slice.map((byte) => formatHex(byte)).join(", ")}`);
  }

  return `const uint8_t ${safeName}[] = {\n${lines.join(",\n")}\n};`;
}

export function rgbaToMonochromePixels(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
  invert = false,
) {
  const pixels = new Array<number>(width * height).fill(0);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    const red = rgba[offset] ?? 0;
    const green = rgba[offset + 1] ?? 0;
    const blue = rgba[offset + 2] ?? 0;
    const alpha = (rgba[offset + 3] ?? 255) / 255;
    const blended = 255 - (255 - (0.299 * red + 0.587 * green + 0.114 * blue)) * alpha;
    const on = invert ? blended >= threshold : blended < threshold;
    pixels[index] = on ? 1 : 0;
  }

  return pixels;
}

export function packSsd1309Bytes(pixels: number[], width: number, height: number) {
  const pages = Math.ceil(height / 8);
  const bytes: number[] = [];

  for (let page = 0; page < pages; page += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        const y = page * 8 + bit;
        if (y >= height) continue;
        const pixel = pixels[y * width + x] ?? 0;
        if (pixel) value |= 1 << bit;
      }
      bytes.push(value);
    }
  }

  return bytes;
}

export function packHorizontalBytes(pixels: number[], width: number, height: number) {
  const bytes: number[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let chunk = 0; chunk < Math.ceil(width / 8); chunk += 1) {
      let value = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        const x = chunk * 8 + bit;
        if (x >= width) continue;
        const pixel = pixels[y * width + x] ?? 0;
        if (pixel) value |= 1 << (7 - bit);
      }
      bytes.push(value);
    }
  }

  return bytes;
}

export type BitmapPackingMode = "ssd1309-page" | "horizontal-msb";

export function packMonochromeBytes(pixels: number[], width: number, height: number, packing: BitmapPackingMode) {
  if (packing === "horizontal-msb") return packHorizontalBytes(pixels, width, height);
  return packSsd1309Bytes(pixels, width, height);
}

export function convertImageDataToMonochromeBytes(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
  invert = false,
  packing: BitmapPackingMode = "ssd1309-page",
) {
  const pixels = rgbaToMonochromePixels(rgba, width, height, threshold, invert);
  return {
    pixels,
    bytes: packMonochromeBytes(pixels, width, height, packing),
  };
}

export function convertImageDataToSsd1309Bytes(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
  invert = false,
) {
  return convertImageDataToMonochromeBytes(rgba, width, height, threshold, invert, "ssd1309-page");
}

export type IntelHexRecord = {
  line: number;
  byteCount: number;
  address: number;
  recordType: number;
  data: number[];
  checksum: number;
  checksumValid: boolean;
  absoluteAddress: number | null;
  note: string;
};

export type AddressSpan = {
  start: number;
  end: number;
  bytes: number;
  gapBefore: number;
};

export function parseIntelHex(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let upperLinear = 0;
  let upperSegment = 0;
  let dataBytes = 0;
  let checksumErrors = 0;
  let highestAddress = -1;
  let lowestAddress = Number.POSITIVE_INFINITY;

  const records: IntelHexRecord[] = lines.map((line, index) => {
    if (!line.startsWith(":")) {
      checksumErrors += 1;
      return {
        line: index + 1,
        byteCount: 0,
        address: 0,
        recordType: 0,
        data: [],
        checksum: 0,
        checksumValid: false,
        absoluteAddress: null,
        note: "Missing leading colon",
      };
    }

    const body = line.slice(1);
    const bytes = body.match(/.{1,2}/g)?.map((pair) => Number.parseInt(pair, 16)) ?? [];
    if (bytes.length < 5 || body.length % 2 !== 0) {
      checksumErrors += 1;
      return {
        line: index + 1,
        byteCount: 0,
        address: 0,
        recordType: 0,
        data: [],
        checksum: 0,
        checksumValid: false,
        absoluteAddress: null,
        note: "Malformed record length",
      };
    }

    const byteCount = bytes[0];
    const address = (bytes[1] << 8) | bytes[2];
    const recordType = bytes[3];
    const data = bytes.slice(4, 4 + byteCount);
    const checksum = bytes[4 + byteCount] ?? 0;
    const checksumValid = (bytes.reduce((sum, value) => sum + value, 0) & 0xff) === 0;
    if (!checksumValid) checksumErrors += 1;

    let absoluteAddress: number | null = null;
    let note = "Data";

    if (recordType === 0x00) {
      absoluteAddress = ((upperLinear << 16) + (upperSegment << 4) + address) >>> 0;
      dataBytes += data.length;
      lowestAddress = Math.min(lowestAddress, absoluteAddress);
      highestAddress = Math.max(highestAddress, absoluteAddress + Math.max(data.length - 1, 0));
    } else if (recordType === 0x01) {
      note = "EOF";
    } else if (recordType === 0x02) {
      upperSegment = ((data[0] ?? 0) << 8) | (data[1] ?? 0);
      upperLinear = 0;
      note = `Extended segment ${formatHex(upperSegment, 4)}`;
    } else if (recordType === 0x04) {
      upperLinear = ((data[0] ?? 0) << 8) | (data[1] ?? 0);
      upperSegment = 0;
      note = `Extended linear ${formatHex(upperLinear, 4)}`;
    } else if (recordType === 0x03) {
      note = "Start segment address";
    } else if (recordType === 0x05) {
      note = "Start linear address";
    } else {
      note = "Unknown / vendor-specific";
    }

    return {
      line: index + 1,
      byteCount,
      address,
      recordType,
      data,
      checksum,
      checksumValid,
      absoluteAddress,
      note,
    };
  });

  const spans: AddressSpan[] = [];
  const dataRecords = records
    .filter((record) => record.recordType === 0x00 && record.absoluteAddress !== null && record.data.length > 0)
    .sort((left, right) => (left.absoluteAddress as number) - (right.absoluteAddress as number));

  for (const record of dataRecords) {
    const start = record.absoluteAddress as number;
    const end = start + record.data.length - 1;
    const previous = spans.at(-1);

    if (!previous) {
      spans.push({ start, end, bytes: record.data.length, gapBefore: 0 });
      continue;
    }

    if (start <= previous.end + 1) {
      previous.end = Math.max(previous.end, end);
      previous.bytes = previous.end - previous.start + 1;
      continue;
    }

    spans.push({
      start,
      end,
      bytes: record.data.length,
      gapBefore: start - previous.end - 1,
    });
  }

  const largestGap = spans.reduce((largest, span) => Math.max(largest, span.gapBefore), 0);

  return {
    records,
    summary: {
      recordCount: records.length,
      dataBytes,
      checksumErrors,
      lowestAddress: Number.isFinite(lowestAddress) ? lowestAddress : null,
      highestAddress: highestAddress >= 0 ? highestAddress : null,
      spanCount: spans.length,
      gapCount: Math.max(spans.length - 1, 0),
      largestGap,
    },
    spans,
  };
}

type SRecordEntry = {
  line: number;
  type: string;
  count: number;
  address: number | null;
  data: number[];
  checksum: number | null;
  checksumValid: boolean;
  note: string;
};

const sRecordAddressLengths: Record<string, number> = {
  S0: 2,
  S1: 2,
  S2: 3,
  S3: 4,
  S5: 2,
  S6: 3,
  S7: 4,
  S8: 3,
  S9: 2,
};

export function parseSRecord(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let dataBytes = 0;
  let checksumErrors = 0;
  let highestAddress = -1;

  const records: SRecordEntry[] = lines.map((line, index) => {
    const type = line.slice(0, 2).toUpperCase();
    const addressBytes = sRecordAddressLengths[type];
    if (!/^S[0-9]$/i.test(type) || !addressBytes) {
      checksumErrors += 1;
      return {
        line: index + 1,
        type,
        count: 0,
        address: null,
        data: [],
        checksum: null,
        checksumValid: false,
        note: "Unsupported record type",
      };
    }

    const payload = line.slice(2);
    const bytes = payload.match(/.{1,2}/g)?.map((pair) => Number.parseInt(pair, 16)) ?? [];
    if (payload.length % 2 !== 0 || bytes.length < addressBytes + 2) {
      checksumErrors += 1;
      return {
        line: index + 1,
        type,
        count: 0,
        address: null,
        data: [],
        checksum: null,
        checksumValid: false,
        note: "Malformed record length",
      };
    }

    const count = bytes[0];
    const addressParts = bytes.slice(1, 1 + addressBytes);
    const address = addressParts.reduce((acc, value) => (acc << 8) | value, 0);
    const dataLength = Math.max(count - addressBytes - 1, 0);
    const data = bytes.slice(1 + addressBytes, 1 + addressBytes + dataLength);
    const checksum = bytes[1 + addressBytes + dataLength] ?? null;
    const total = bytes.reduce((sum, value) => sum + value, 0) & 0xff;
    const checksumValid = total === 0xff;
    if (!checksumValid) checksumErrors += 1;

    let note = "Data";
    if (type === "S0") note = "Header";
    if (type === "S5" || type === "S6") note = "Count record";
    if (type === "S7" || type === "S8" || type === "S9") note = "Termination";

    if (type === "S1" || type === "S2" || type === "S3") {
      dataBytes += data.length;
      highestAddress = Math.max(highestAddress, address + Math.max(data.length - 1, 0));
    }

    return {
      line: index + 1,
      type,
      count,
      address,
      data,
      checksum,
      checksumValid,
      note,
    };
  });

  return {
    records,
    summary: {
      recordCount: records.length,
      dataBytes,
      checksumErrors,
      highestAddress: highestAddress >= 0 ? highestAddress : null,
    },
  };
}
