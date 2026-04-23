"use client";

import { useMemo, useState } from "react";

function crc16Modbus(bytes: number[]) {
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1;
  }
  return crc & 0xffff;
}

export function ModbusRTUHelperTool() {
  const [slave, setSlave] = useState("01");
  const [functionCode, setFunctionCode] = useState("03");
  const [payload, setPayload] = useState("00 10 00 02");

  const frame = useMemo(() => {
    const bytes = `${slave} ${functionCode} ${payload}`.replace(/[^0-9a-fA-F]/g, "").match(/.{1,2}/g)?.map((value) => Number.parseInt(value, 16)) ?? [];
    if (bytes.length < 2) return null;
    const crc = crc16Modbus(bytes);
    return `${bytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, "0")).join(" ")} ${crc.toString(16).toUpperCase().padStart(4, "0").match(/.{1,2}/g)?.reverse().join(" ")}`;
  }, [functionCode, payload, slave]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Slave<input value={slave} onChange={(event) => setSlave(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Function<input value={functionCode} onChange={(event) => setFunctionCode(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Payload<input value={payload} onChange={(event) => setPayload(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
      </div>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Frame with CRC (little-endian CRC bytes)</p><p className="mt-2 font-mono text-sm text-ink">{frame ?? "Enter at least slave + function bytes"}</p></div>
    </div>
  );
}
