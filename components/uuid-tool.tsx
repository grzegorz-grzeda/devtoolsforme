"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const UUID_EPOCH_OFFSET = BigInt("122192928000000000");
const textEncoder = new TextEncoder();
const uuidVersions = ["v1", "v3", "v4", "v5", "v7"] as const;
type UUIDVersion = (typeof uuidVersions)[number];

type NamespacePreset = "dns" | "url" | "oid" | "x500" | "custom";

const namespaceValues: Record<Exclude<NamespacePreset, "custom">, string> = {
  dns: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  url: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  oid: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  x500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

const versionGuide: Record<UUIDVersion, { title: string; detail: string }> = {
  v1: { title: "Time + node", detail: "Needs timestamp, clock sequence, and node ID. Useful when ordering by creation time matters." },
  v3: { title: "Deterministic MD5", detail: "Same namespace + name always yields the same UUID. Good for stable identifiers." },
  v4: { title: "Random", detail: "Purely random UUIDs for general-purpose IDs, fixtures, and client-generated keys." },
  v5: { title: "Deterministic SHA-1", detail: "Like v3, but SHA-1-based. Good when you want repeatable UUIDs from names." },
  v7: { title: "Time-ordered random", detail: "Timestamp-first UUIDs that sort better than v4 while staying globally unique." },
};

function bytesToUuid(bytes: Uint8Array) {
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidToBytes(uuid: string) {
  const cleaned = uuid.replace(/-/g, "").trim().toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(cleaned)) return null;

  const bytes = new Uint8Array(16);
  for (let index = 0; index < 16; index += 1) {
    bytes[index] = Number.parseInt(cleaned.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function randomHex(bytes: number) {
  const values = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}

function createV4() {
  return crypto.randomUUID();
}

function createV7() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let timestamp = BigInt(Date.now());

  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(timestamp & BigInt(0xff));
    timestamp >>= BigInt(8);
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

function createV1(timestampInput: string, clockSequenceInput: string, nodeInput: string, offset = 0) {
  const date = timestampInput ? new Date(timestampInput) : new Date();
  if (Number.isNaN(date.getTime())) throw new Error("Use a valid timestamp for UUID v1.");

  const clockSequence = Number.parseInt(clockSequenceInput, 16);
  if (!/^[0-9a-fA-F]{1,4}$/.test(clockSequenceInput) || Number.isNaN(clockSequence) || clockSequence > 0x3fff) {
    throw new Error("Clock sequence must be 1-4 hex characters and fit in 14 bits.");
  }

  const normalizedNode = nodeInput.replace(/[^0-9a-fA-F]/g, "");
  if (!/^[0-9a-fA-F]{12}$/.test(normalizedNode)) {
    throw new Error("Node ID must be 12 hex characters (for example 001122334455).");
  }

  const timestamp = BigInt(date.getTime()) * BigInt(10000) + UUID_EPOCH_OFFSET + BigInt(offset);
  const timeLow = Number(timestamp & BigInt(0xffffffff));
  const timeMid = Number((timestamp >> BigInt(32)) & BigInt(0xffff));
  const timeHigh = Number((timestamp >> BigInt(48)) & BigInt(0x0fff));

  const bytes = new Uint8Array(16);
  bytes[0] = (timeLow >>> 24) & 0xff;
  bytes[1] = (timeLow >>> 16) & 0xff;
  bytes[2] = (timeLow >>> 8) & 0xff;
  bytes[3] = timeLow & 0xff;
  bytes[4] = (timeMid >>> 8) & 0xff;
  bytes[5] = timeMid & 0xff;
  bytes[6] = ((timeHigh >>> 8) & 0x0f) | 0x10;
  bytes[7] = timeHigh & 0xff;
  bytes[8] = ((clockSequence >>> 8) & 0x3f) | 0x80;
  bytes[9] = clockSequence & 0xff;

  for (let index = 0; index < 6; index += 1) {
    bytes[10 + index] = Number.parseInt(normalizedNode.slice(index * 2, index * 2 + 2), 16);
  }

  return bytesToUuid(bytes);
}

function leftRotate(value: number, amount: number) {
  return (value << amount) | (value >>> (32 - amount));
}

function md5Digest(input: Uint8Array) {
  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 2 ** 32) >>> 0);

  const originalBitLength = input.length * 8;
  const paddedLength = (((input.length + 9 + 63) >> 6) << 6);
  const padded = new Uint8Array(paddedLength);
  padded.set(input);
  padded[input.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, originalBitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(originalBitLength / 2 ** 32), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const block = new Uint32Array(16);
    for (let index = 0; index < 16; index += 1) {
      block[index] = view.getUint32(offset + index * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f = 0;
      let g = 0;

      if (index < 16) {
        f = (b & c) | (~b & d);
        g = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        g = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * index) % 16;
      }

      const nextD = d;
      d = c;
      c = b;
      const sum = (((a + f) >>> 0) + constants[index] + block[g]) >>> 0;
      b = (b + leftRotate(sum, shifts[index])) >>> 0;
      a = nextD;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const digest = new Uint8Array(16);
  const output = new DataView(digest.buffer);
  output.setUint32(0, a0, true);
  output.setUint32(4, b0, true);
  output.setUint32(8, c0, true);
  output.setUint32(12, d0, true);
  return digest;
}

function createNameBasedValue(namespace: string, name: string) {
  const namespaceBytes = uuidToBytes(namespace);
  if (!namespaceBytes) throw new Error("Namespace UUID must be a valid UUID.");
  if (!name.trim()) throw new Error("Name is required for namespace-based UUIDs.");

  const encodedName = textEncoder.encode(name);
  const value = new Uint8Array(namespaceBytes.length + encodedName.length);
  value.set(namespaceBytes, 0);
  value.set(encodedName, namespaceBytes.length);
  return value;
}

function createV3(namespace: string, name: string) {
  const digest = md5Digest(createNameBasedValue(namespace, name));
  digest[6] = (digest[6] & 0x0f) | 0x30;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  return bytesToUuid(digest);
}

async function createV5(namespace: string, name: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-1", createNameBasedValue(namespace, name)));
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;

  return bytesToUuid(digest.slice(0, 16));
}

function currentDateTimeLocal() {
  const date = new Date();
  const timezoneAdjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return timezoneAdjusted.toISOString().slice(0, 16);
}

export function UUIDTool() {
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [count, setCount] = useState(4);
  const [refreshKey, setRefreshKey] = useState(0);
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [clockSequence, setClockSequence] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [namespacePreset, setNamespacePreset] = useState<NamespacePreset>("dns");
  const [customNamespace, setCustomNamespace] = useState(namespaceValues.dns);
  const [name, setName] = useState("devtoolsforme.com");

  const effectiveNamespace = useMemo(
    () => (namespacePreset === "custom" ? customNamespace : namespaceValues[namespacePreset]),
    [customNamespace, namespacePreset]
  );

  const supportsBatch = version !== "v3" && version !== "v5";
  const joined = uuids.join("\n");
  const selectedGuide = versionGuide[version];
  const usesNamespaceInputs = version === "v3" || version === "v5";

  useEffect(() => {
    if (!timestamp) setTimestamp(currentDateTimeLocal());
    if (!clockSequence) setClockSequence(randomHex(2).slice(0, 4));
    if (!nodeId) setNodeId(randomHex(6));
  }, [clockSequence, nodeId, timestamp]);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      try {
        setError("");

        let next: string[] = [];
        if (version === "v4") {
          next = Array.from({ length: count }, () => createV4());
        } else if (version === "v7") {
          next = Array.from({ length: count }, () => createV7());
        } else if (version === "v1") {
          next = Array.from({ length: count }, (_, index) => createV1(timestamp, clockSequence, nodeId, index));
        } else if (version === "v3") {
          next = [createV3(effectiveNamespace, name)];
        } else {
          next = [await createV5(effectiveNamespace, name)];
        }

        if (!cancelled) setUuids(next);
      } catch (generationError) {
        if (!cancelled) {
          setUuids([]);
          setError(generationError instanceof Error ? generationError.message : "Could not generate UUIDs.");
        }
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [clockSequence, count, effectiveNamespace, name, nodeId, refreshKey, timestamp, version]);

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-[1.4rem] border border-ink/10 bg-white/60 p-4">
        <div className="flex flex-wrap gap-2">
          {uuidVersions.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setVersion(value)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                version === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
              }`}
            >
              UUID {value}
            </button>
          ))}
        </div>

        <div className="rounded-[1.2rem] border border-ink/10 bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Selected version</p>
              <p className="mt-1 text-sm font-semibold text-ink">{selectedGuide.title}</p>
            </div>
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-lake">
              RFC 4122-style
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink/75">{selectedGuide.detail}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportsBatch ? (
            <label className="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-ink/80 xl:col-span-2">
              Number of UUIDs
              <input
                type="range"
                min={1}
                max={12}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="accent-accent"
              />
              <span className="font-mono text-lg text-lake">{count}</span>
            </label>
          ) : (
            <div className="rounded-2xl border border-ink/10 bg-card px-4 py-3 text-sm text-ink/70 xl:col-span-2">
              UUID {version} is deterministic, so one UUID is generated for the namespace/name pair.
            </div>
          )}

          {version === "v1" && (
            <>
              <label className="block space-y-2 text-sm font-medium text-ink/80">
                Timestamp
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(event) => setTimestamp(event.target.value)}
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-ink/80">
                Clock sequence
                <input
                  type="text"
                  value={clockSequence}
                  onChange={(event) => setClockSequence(event.target.value)}
                  placeholder="14-bit hex"
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-ink/80 xl:col-span-2">
                Node ID
                <input
                  type="text"
                  value={nodeId}
                  onChange={(event) => setNodeId(event.target.value)}
                  placeholder="001122334455"
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
            </>
          )}

          {usesNamespaceInputs && (
            <>
              <label className="block space-y-2 text-sm font-medium text-ink/80">
                Namespace preset
                <select
                  value={namespacePreset}
                  onChange={(event) => setNamespacePreset(event.target.value as NamespacePreset)}
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                >
                  <option value="dns">DNS</option>
                  <option value="url">URL</option>
                  <option value="oid">OID</option>
                  <option value="x500">X.500</option>
                  <option value="custom">Custom namespace UUID</option>
                </select>
              </label>
              <label className="block space-y-2 text-sm font-medium text-ink/80 xl:col-span-3">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="example.com"
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-ink/80 xl:col-span-4">
                Namespace UUID
                <input
                  type="text"
                  value={effectiveNamespace}
                  onChange={(event) => setCustomNamespace(event.target.value)}
                  disabled={namespacePreset !== "custom"}
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:bg-sage/40 focus:border-accent"
                />
              </label>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accentDark"
          >
            {usesNamespaceInputs ? "Regenerate UUID" : "Generate new batch"}
          </button>
          <CopyButton value={joined} label="Copy all" />
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Version guide</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {uuidVersions.map((value) => (
            <div key={value} className={`rounded-[1.1rem] border p-3 ${value === version ? "border-accent/40 bg-sage/50" : "border-ink/10 bg-card"}`}>
              <p className="text-sm font-semibold text-ink">UUID {value}</p>
              <p className="mt-1 text-sm text-ink/70">{versionGuide[value].detail}</p>
            </div>
          ))}
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{error}</p> : null}

      <div className="grid gap-3">
        {uuids.map((uuid, index) => (
          <div
            key={`${uuid}-${index}`}
            className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
          >
            <code className="overflow-x-auto font-mono text-sm text-lake">{uuid}</code>
            <CopyButton value={uuid} />
          </div>
        ))}
      </div>
    </div>
  );
}
