"use client";

import { useMemo, useState } from "react";
import { formatHex, groupHexBytes, parseIntelHex } from "@/lib/embedded-advanced";

const sample = `:020000040800F2
:100000000102030405060708090A0B0C0D0E0F1068
:10001000112233445566778899AABBCCDDEEFF00E8
:00000001FF`;

export function IntelHexInspectorTool() {
  const [source, setSource] = useState(sample);
  const parsed = useMemo(() => parseIntelHex(source), [source]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Intel HEX input
        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          rows={8}
          className="w-full rounded-[1.5rem] border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Records" value={String(parsed.summary.recordCount)} />
        <SummaryCard label="Data bytes" value={String(parsed.summary.dataBytes)} />
        <SummaryCard label="Checksum errors" value={String(parsed.summary.checksumErrors)} />
        <SummaryCard
          label="Highest address"
          value={parsed.summary.highestAddress === null ? "-" : formatHex(parsed.summary.highestAddress, 8)}
        />
      </div>

      <div className="overflow-x-auto rounded-[1.6rem] border border-ink/10 bg-white/80">
        <table className="min-w-full divide-y divide-ink/10 text-left text-sm text-ink/80">
          <thead className="bg-sage/40 text-xs uppercase tracking-[0.18em] text-lake">
            <tr>
              <th className="px-4 py-3">Line</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Base</th>
              <th className="px-4 py-3">Absolute</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Checksum</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 font-mono text-xs md:text-sm">
            {parsed.records.map((record) => (
              <tr key={`${record.line}-${record.address}-${record.recordType}`}>
                <td className="px-4 py-3">{record.line}</td>
                <td className="px-4 py-3">{formatHex(record.recordType)}</td>
                <td className="px-4 py-3">{formatHex(record.address, 4)}</td>
                <td className="px-4 py-3">{record.absoluteAddress === null ? "-" : formatHex(record.absoluteAddress, 8)}</td>
                <td className="px-4 py-3">{record.data.length ? groupHexBytes(record.data) : "-"}</td>
                <td className={`px-4 py-3 ${record.checksumValid ? "text-lake" : "text-red-700"}`}>
                  {record.checksumValid ? "OK" : `Bad (${formatHex(record.checksum)})`}
                </td>
                <td className="px-4 py-3 font-sans text-ink/70">{record.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{label}</p>
      <p className="mt-2 font-mono text-lg text-ink">{value}</p>
    </div>
  );
}
