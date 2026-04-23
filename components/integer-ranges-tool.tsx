"use client";

const rows = [
  { type: "uint8_t", bits: 8, min: "0", max: "255", hex: "0x00 - 0xFF" },
  { type: "int8_t", bits: 8, min: "-128", max: "127", hex: "0x80 - 0x7F" },
  { type: "uint16_t", bits: 16, min: "0", max: "65,535", hex: "0x0000 - 0xFFFF" },
  { type: "int16_t", bits: 16, min: "-32,768", max: "32,767", hex: "0x8000 - 0x7FFF" },
  { type: "uint32_t", bits: 32, min: "0", max: "4,294,967,295", hex: "0x00000000 - 0xFFFFFFFF" },
  { type: "int32_t", bits: 32, min: "-2,147,483,648", max: "2,147,483,647", hex: "0x80000000 - 0x7FFFFFFF" },
  { type: "uint64_t", bits: 64, min: "0", max: "18,446,744,073,709,551,615", hex: "0x0000000000000000 - 0xFFFFFFFFFFFFFFFF" },
  { type: "int64_t", bits: 64, min: "-9,223,372,036,854,775,808", max: "9,223,372,036,854,775,807", hex: "0x8000000000000000 - 0x7FFFFFFFFFFFFFFF" },
];

export function IntegerRangesTool() {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 text-sm leading-7 text-ink/75">
        Quick reference for common fixed-width integer types used in embedded C and firmware code.
      </div>
      <div className="overflow-x-auto rounded-[1.4rem] border border-ink/10 bg-white/70">
        <table className="min-w-full text-left text-sm text-ink">
          <thead className="bg-canvas text-xs font-semibold uppercase tracking-[0.18em] text-lake">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Bits</th>
              <th className="px-4 py-3">Min</th>
              <th className="px-4 py-3">Max</th>
              <th className="px-4 py-3">Hex span</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.type} className="border-t border-ink/10">
                <td className="px-4 py-3 font-mono">{row.type}</td>
                <td className="px-4 py-3">{row.bits}</td>
                <td className="px-4 py-3 font-mono">{row.min}</td>
                <td className="px-4 py-3 font-mono">{row.max}</td>
                <td className="px-4 py-3 font-mono">{row.hex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
