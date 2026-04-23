"use client";

import { useMemo, useState } from "react";

function cleanBytes(input: string) {
  return input.replace(/[^0-9a-fA-F]/g, "").toUpperCase().match(/.{1,2}/g)?.slice(0, 8) ?? [];
}

export function CANFrameHelperTool() {
  const [canId, setCanId] = useState("7DF");
  const [data, setData] = useState("02 01 0C 00 00 00 00 00");
  const bytes = useMemo(() => cleanBytes(data), [data]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">CAN ID<input value={canId} onChange={(event) => setCanId(event.target.value.toUpperCase())} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Data bytes<input value={data} onChange={(event) => setData(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-3"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Frame type</p><p className="mt-2 font-mono text-lg text-ink">{canId.length > 3 ? "Extended" : "Standard"}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">DLC</p><p className="mt-2 font-mono text-lg text-ink">{bytes.length}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Frame summary</p><p className="mt-2 font-mono text-sm text-ink">ID 0x{canId} [{bytes.length}] {bytes.join(" ")}</p></div></div>
    </div>
  );
}
