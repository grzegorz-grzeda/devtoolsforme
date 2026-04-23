"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

type Algorithm = (typeof algorithms)[number];

function bytesToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function HashGeneratorTool() {
  const [input, setInput] = useState("devtoolsforme");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hash, setHash] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function generateHash() {
      const data = new TextEncoder().encode(input);
      const digest = await crypto.subtle.digest(algorithm, data);
      if (!cancelled) {
        setHash(bytesToHex(digest));
      }
    }

    generateHash().catch(() => {
      if (!cancelled) {
        setHash("Unable to generate hash in this browser.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [algorithm, input]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {algorithms.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAlgorithm(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              algorithm === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Input text
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={8}
          className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Digest</h2>
            <p className="text-xs text-ink/50">Generated locally with Web Crypto</p>
          </div>
          <CopyButton value={hash} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm leading-7 text-ink">{hash || "Hash output will appear here."}</pre>
      </div>
    </div>
  );
}
