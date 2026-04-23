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

type IntelHexRecord = {
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
