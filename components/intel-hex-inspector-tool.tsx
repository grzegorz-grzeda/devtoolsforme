"use client";

import { useMemo, useState } from "react";
import { formatHex, groupHexBytes, parseIntelHex } from "@/lib/embedded-advanced";

const sample = `:020000040800F2
:100000000102030405060708090A0B0C0D0E0F1068
:10002000112233445566778899AABBCCDDEEFF00D8
:00000001FF`;

export function IntelHexInspectorTool() {
  const [source, setSource] = useState(sample);
  const parsed = useMemo(() => parseIntelHex(source), [source]);
  const addressSpan =
    parsed.summary.lowestAddress === null || parsed.summary.highestAddress === null
      ? "-"
      : `${formatHex(parsed.summary.lowestAddress, 8)} -> ${formatHex(parsed.summary.highestAddress, 8)}`;

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Records" value={String(parsed.summary.recordCount)} />
        <SummaryCard label="Data bytes" value={String(parsed.summary.dataBytes)} />
        <SummaryCard label="Checksum errors" value={String(parsed.summary.checksumErrors)} tone={parsed.summary.checksumErrors ? "danger" : "default"} />
        <SummaryCard label="Address span" value={addressSpan} />
        <SummaryCard label="Gaps" value={parsed.summary.gapCount ? `${parsed.summary.gapCount} (${parsed.summary.largestGap} bytes)` : "0"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
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
                <tr
                  key={`${record.line}-${record.address}-${record.recordType}`}
                  className={record.checksumValid ? "" : "bg-red-50/80"}
                >
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

        <div className="space-y-4 rounded-[1.6rem] border border-ink/10 bg-white/80 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Memory spans</p>
            <p className="mt-2 text-sm text-ink/70">Contiguous data regions after applying extended address records.</p>
          </div>
          <div className="space-y-3">
            {parsed.spans.length ? (
              parsed.spans.map((span, index) => (
                <div key={`${span.start}-${span.end}`} className="rounded-[1.2rem] border border-ink/10 bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">Span {index + 1}</p>
                      <p className="mt-1 font-mono text-xs text-ink/80">
                        {formatHex(span.start, 8)}
                        {" -> "}
                        {formatHex(span.end, 8)}
                      </p>
                    </div>
                    <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-lake">{span.bytes} bytes</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{span.gapBefore > 0 ? `Gap before span: ${span.gapBefore} bytes` : "No gap before this span"}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-ink/15 bg-card/60 p-4 text-sm text-ink/65">No data records parsed yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" }) {
  return (
    <div className={`rounded-[1.4rem] border p-4 ${tone === "danger" ? "border-red-200 bg-red-50" : "border-ink/10 bg-white/70"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${tone === "danger" ? "text-red-700" : "text-lake"}`}>{label}</p>
      <p className="mt-2 font-mono text-lg text-ink">{value}</p>
    </div>
  );
}
