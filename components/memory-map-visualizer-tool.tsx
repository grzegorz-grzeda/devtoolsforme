import React, { useState } from 'react';

type Field = {
    name: string;
    type: string;
    count: number;
    size: number;
    align: number;
};

type LayoutItem = Field & {
    start: number;
    padding: number;
    color: string;
};

const typeMap: Record<string, { size: number; align: number }> = {
    uint8_t: { size: 1, align: 1 },
    uint16_t: { size: 2, align: 2 },
    uint32_t: { size: 4, align: 4 },
    uint64_t: { size: 8, align: 8 },
    int8_t: { size: 1, align: 1 },
    int16_t: { size: 2, align: 2 },
    int32_t: { size: 4, align: 4 },
    int64_t: { size: 8, align: 8 },
    char: { size: 1, align: 1 },
    float: { size: 4, align: 4 },
    double: { size: 8, align: 8 },
};

function formatType(field: Field) {
    return field.count > 1 ? `${field.type}[${field.count}]` : field.type;
}

function buildLayout(fields: Field[]) {
    let offset = 0;
    const layout: LayoutItem[] = fields.map((field, index) => {
        const padding = (field.align - (offset % field.align)) % field.align;
        offset += padding;
        const start = offset;
        offset += field.size;

        return {
            ...field,
            start,
            padding,
            color: `hsl(${(index * 67 + 155) % 360}, 72%, 78%)`,
        };
    });

    const structAlign = fields.length ? Math.max(...fields.map(field => field.align)) : 1;
    const tailPadding = fields.length ? (structAlign - (offset % structAlign)) % structAlign : 0;
    const totalSize = offset + tailPadding;

    return { layout, totalSize, tailPadding, structAlign };
}

export default function MemoryMapVisualizerTool() {
    const [input, setInput] = useState<string>(
        `typedef struct {
    uint8_t flag;
    uint32_t count;
    uint16_t mode;
} MyStruct;`
    );
    const [fields, setFields] = useState<Field[]>([]);
    const [error, setError] = useState('');

    function parseStruct(definition: string) {
        const fieldLines = definition
            .split('\n')
            .map(line => line.trim())
            .filter(line => /^(uint|int|char|float|double)/.test(line));

        const parsed = fieldLines.flatMap(line => {
            const match = line.match(/^(\w+)\s+(\w+)(?:\[(\d+)\])?;/);
            if (!match) return [];

            const [, type, name, countText] = match;
            const baseType = typeMap[type];
            if (!baseType) return [];

            const count = countText ? Math.max(parseInt(countText, 10), 1) : 1;
            return [{
                name,
                type,
                count,
                size: baseType.size * count,
                align: baseType.align,
            }];
        });

        setFields(parsed);
        setError(parsed.length ? '' : 'No supported C struct fields were found.');
    }

    const { layout, totalSize, tailPadding, structAlign } = buildLayout(fields);

    return (
        <div className="w-full space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
                <section className="rounded-2xl border border-ink/10 bg-white/75 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-ink">Struct Definition</h3>
                        <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/60">
                            C layout input
                        </span>
                    </div>
                    <textarea
                        className="min-h-64 w-full resize-y rounded-xl border border-ink/10 bg-white px-4 py-3 font-mono text-sm text-ink outline-none transition focus:border-accent"
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        spellCheck={false}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accentDark" onClick={() => parseStruct(input)}>
                            Analyze
                        </button>
                        <button className="rounded-full bg-sage px-5 py-2 text-sm font-semibold text-lake transition hover:bg-sage/70" onClick={() => { setFields([]); setError(''); }}>
                            Clear Results
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-ink/10 bg-white/75 p-5">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-ink">Layout Result</h3>
                            <p className="mt-1 text-xs text-ink/60">Offsets and sizes are shown in bytes.</p>
                        </div>
                        {fields.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-ink/70">Size: <b>{totalSize}</b> bytes</span>
                                <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-ink/70">Align: <b>{structAlign}</b></span>
                            </div>
                        )}
                    </div>

                    {fields.length === 0 ? (
                        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-white/60 p-8 text-center text-sm text-ink/55">
                            Analyze a struct to see the memory layout.
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
                                <div className="flex min-h-20 w-full">
                                    {layout.map((field, index) => (
                                        <React.Fragment key={`${field.name}-${index}`}>
                                            {field.padding > 0 && (
                                                <div
                                                    className="flex min-w-10 items-center justify-center border-r border-white/80 bg-gray-200 px-2 text-center text-[10px] font-semibold text-gray-500"
                                                    style={{ width: `${(field.padding / totalSize) * 100}%` }}
                                                    title={`Padding before ${field.name}: ${field.padding} byte${field.padding === 1 ? '' : 's'}`}
                                                >
                                                    pad {field.padding}
                                                </div>
                                            )}
                                            <div
                                                className="flex min-w-14 flex-col justify-center border-r border-white/80 px-3 py-3 text-center"
                                                style={{ width: `${(field.size / totalSize) * 100}%`, background: field.color }}
                                                title={`${field.name}: offset ${field.start}, size ${field.size} byte${field.size === 1 ? '' : 's'}`}
                                            >
                                                <span className="truncate text-xs font-bold text-ink">{field.name}</span>
                                                <span className="font-mono text-[10px] text-ink/65">@{field.start}</span>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                    {tailPadding > 0 && (
                                        <div
                                            className="flex min-w-10 items-center justify-center bg-gray-200 px-2 text-center text-[10px] font-semibold text-gray-500"
                                            style={{ width: `${(tailPadding / totalSize) * 100}%` }}
                                            title={`Tail padding: ${tailPadding} byte${tailPadding === 1 ? '' : 's'}`}
                                        >
                                            tail {tailPadding}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between border-t border-ink/10 px-3 py-2 font-mono text-[11px] text-ink/60">
                                    <span>0</span>
                                    <span>{totalSize} bytes</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
                                <table className="w-full min-w-[520px] text-left text-sm">
                                    <thead className="border-b border-ink/10 bg-ink/[0.03] text-xs uppercase text-ink/60">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Field</th>
                                            <th className="px-4 py-3 font-semibold">Type</th>
                                            <th className="px-4 py-3 font-semibold">Offset</th>
                                            <th className="px-4 py-3 font-semibold">Size</th>
                                            <th className="px-4 py-3 font-semibold">Padding Before</th>
                                            <th className="px-4 py-3 font-semibold">Alignment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-ink/10">
                                        {layout.map(field => (
                                            <tr key={`${field.name}-${field.start}`} className="text-ink/80">
                                                <td className="px-4 py-3 font-semibold text-ink">{field.name}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{formatType(field)}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{field.start}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{field.size}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{field.padding}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{field.align}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <details className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-xs text-ink/70">
                <summary className="cursor-pointer font-semibold text-ink">How it works</summary>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Supports simple C struct fields such as uint8_t, uint16_t, uint32_t, int8_t, float, double, and char.</li>
                    <li>Calculates each field offset using the field alignment requirement.</li>
                    <li>Shows internal padding before fields and tail padding at the end of the structure.</li>
                </ul>
            </details>
        </div>
    );
}
