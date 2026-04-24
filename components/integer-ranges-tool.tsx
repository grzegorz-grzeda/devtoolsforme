"use client";

const exactWidthRows = [
  { type: "uint8_t", bits: 8, min: "0", max: "255", macros: "UINT8_MAX", hex: "0x00 - 0xFF" },
  { type: "int8_t", bits: 8, min: "-128", max: "127", macros: "INT8_MIN / INT8_MAX", hex: "0x80 - 0x7F" },
  { type: "uint16_t", bits: 16, min: "0", max: "65,535", macros: "UINT16_MAX", hex: "0x0000 - 0xFFFF" },
  { type: "int16_t", bits: 16, min: "-32,768", max: "32,767", macros: "INT16_MIN / INT16_MAX", hex: "0x8000 - 0x7FFF" },
  { type: "uint32_t", bits: 32, min: "0", max: "4,294,967,295", macros: "UINT32_MAX", hex: "0x00000000 - 0xFFFFFFFF" },
  { type: "int32_t", bits: 32, min: "-2,147,483,648", max: "2,147,483,647", macros: "INT32_MIN / INT32_MAX", hex: "0x80000000 - 0x7FFFFFFF" },
  { type: "uint64_t", bits: 64, min: "0", max: "18,446,744,073,709,551,615", macros: "UINT64_MAX", hex: "0x0000000000000000 - 0xFFFFFFFFFFFFFFFF" },
  { type: "int64_t", bits: 64, min: "-9,223,372,036,854,775,808", max: "9,223,372,036,854,775,807", macros: "INT64_MIN / INT64_MAX", hex: "0x8000000000000000 - 0x7FFFFFFFFFFFFFFF" },
];

const familyCards = [
  {
    title: "Exact-width types",
    header: "stdint.h",
    examples: "int8_t, uint16_t, int32_t, uint64_t",
    description: "Use these when the storage width must match a register, packet field, flash layout, or file format exactly.",
  },
  {
    title: "At least N bits",
    header: "stdint.h",
    examples: "int_least8_t, uint_least32_t",
    description: "These give you the smallest available type that still guarantees at least the requested bit width.",
  },
  {
    title: "Fastest at least N bits",
    header: "stdint.h",
    examples: "int_fast8_t, uint_fast16_t",
    description: "These trade exact width for the fastest integer type that still provides at least the requested number of bits.",
  },
  {
    title: "Sizes and pointer deltas",
    header: "stddef.h + stdint.h limits",
    examples: "size_t, ptrdiff_t, intptr_t, uintptr_t",
    description: "Reach for these when you need object sizes, pointer subtraction results, or pointer-sized integer round-trips.",
  },
];

const limitRows = [
  {
    type: "int_leastN_t / uint_leastN_t",
    declaredIn: "stdint.h",
    macros: "INT_LEASTN_MIN / INT_LEASTN_MAX / UINT_LEASTN_MAX",
    range: "At least N bits",
    description: "Smallest implementation type that meets the width guarantee.",
  },
  {
    type: "int_fastN_t / uint_fastN_t",
    declaredIn: "stdint.h",
    macros: "INT_FASTN_MIN / INT_FASTN_MAX / UINT_FASTN_MAX",
    range: "At least N bits",
    description: "Fastest implementation type that still meets the width guarantee.",
  },
  {
    type: "intmax_t / uintmax_t",
    declaredIn: "stdint.h",
    macros: "INTMAX_MIN / INTMAX_MAX / UINTMAX_MAX",
    range: "Implementation-defined widest integer type",
    description: "Good for generic parsing, formatting, and arithmetic across mixed integer widths.",
  },
  {
    type: "intptr_t / uintptr_t",
    declaredIn: "stdint.h",
    macros: "INTPTR_MIN / INTPTR_MAX / UINTPTR_MAX",
    range: "Optional pointer-sized integer range",
    description: "Optional typedefs for safely round-tripping a pointer value through an integer.",
  },
  {
    type: "size_t",
    declaredIn: "typedef in stddef.h, SIZE_MAX in stdint.h",
    macros: "SIZE_MAX",
    range: "0 .. SIZE_MAX",
    description: "Unsigned type returned by sizeof and commonly used for buffer, array, and object sizes.",
  },
  {
    type: "ptrdiff_t",
    declaredIn: "typedef in stddef.h, limits in stdint.h",
    macros: "PTRDIFF_MIN / PTRDIFF_MAX",
    range: "PTRDIFF_MIN .. PTRDIFF_MAX",
    description: "Signed type produced by subtracting two pointers into the same array object.",
  },
];

export function IntegerRangesTool() {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 text-sm leading-7 text-ink/75">
        Use <span className="font-mono text-ink">stdint.h</span> when you need fixed-width integer typedefs and portable limit macros, then use <span className="font-mono text-ink">stddef.h</span> for object sizes and pointer differences. Exact-width typedefs are optional in the C standard, but when a platform provides them their limits are fixed and portable.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {familyCards.map((card) => (
          <section key={card.title} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 text-sm text-ink">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{card.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-lake">{card.header}</p>
              </div>
              <div className="rounded-2xl bg-canvas px-3 py-2 font-mono text-xs text-ink/75">{card.examples}</div>
            </div>
            <p className="mt-3 leading-7 text-ink/75">{card.description}</p>
          </section>
        ))}
      </div>

      <section className="rounded-[1.4rem] border border-ink/10 bg-white/70">
        <div className="border-b border-ink/10 px-4 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Exact-width ranges</p>
          <p className="mt-1 text-sm text-ink/70">Portable values for the exact-width integer typedefs commonly used in firmware, protocols, and packed binary formats.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-ink">
            <thead className="bg-canvas text-xs font-semibold uppercase tracking-[0.18em] text-lake">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Header</th>
                <th className="px-4 py-3">Bits</th>
                <th className="px-4 py-3">Min</th>
                <th className="px-4 py-3">Max</th>
                <th className="px-4 py-3">Limit macros</th>
                <th className="px-4 py-3">Hex span</th>
              </tr>
            </thead>
            <tbody>
              {exactWidthRows.map((row) => (
                <tr key={row.type} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-mono">{row.type}</td>
                  <td className="px-4 py-3 font-mono text-xs">stdint.h</td>
                  <td className="px-4 py-3">{row.bits}</td>
                  <td className="px-4 py-3 font-mono">{row.min}</td>
                  <td className="px-4 py-3 font-mono">{row.max}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.macros}</td>
                  <td className="px-4 py-3 font-mono">{row.hex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[1.4rem] border border-ink/10 bg-white/70">
        <div className="border-b border-ink/10 px-4 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Related standard limits</p>
          <p className="mt-1 text-sm text-ink/70">Useful typedefs and macros from <span className="font-mono text-ink">stdint.h</span> and <span className="font-mono text-ink">stddef.h</span> when exact-width integers are not the best fit.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-ink">
            <thead className="bg-canvas text-xs font-semibold uppercase tracking-[0.18em] text-lake">
              <tr>
                <th className="px-4 py-3">Type or family</th>
                <th className="px-4 py-3">Declared in</th>
                <th className="px-4 py-3">Limit macros</th>
                <th className="px-4 py-3">Guaranteed range</th>
                <th className="px-4 py-3">When to use it</th>
              </tr>
            </thead>
            <tbody>
              {limitRows.map((row) => (
                <tr key={row.type} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-3 font-mono">{row.type}</td>
                  <td className="px-4 py-3">{row.declaredIn}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.macros}</td>
                  <td className="px-4 py-3">{row.range}</td>
                  <td className="px-4 py-3 text-ink/75">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
