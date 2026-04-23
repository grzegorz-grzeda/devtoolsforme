"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function formatUnixDate(value: unknown) {
  if (typeof value !== "number") {
    return null;
  }

  return new Date(value * 1000).toLocaleString();
}

export function JWTDecoderTool() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldnRvb2xzIEZvciBNZSIsImlhdCI6MTcxMzg4ODAwMCwiZXhwIjoyNzEzODg4MDAwfQ.signature"
  );

  const decoded = useMemo(() => {
    const parts = token.split(".");
    if (parts.length < 2) {
      return { error: "A JWT must include at least header and payload sections." };
    }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      return { header, payload };
    } catch {
      return { error: "Unable to decode this token. Check the formatting and Base64URL sections." };
    }
  }, [token]);

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-[#fff2d8] px-4 py-3 text-sm leading-7 text-[#7a5317]">
        This tool decodes JWTs locally for inspection only. It does not verify signatures.
      </p>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        JWT
        <textarea
          value={token}
          onChange={(event) => setToken(event.target.value)}
          rows={7}
          className="min-h-[170px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      {"error" in decoded ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{decoded.error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Header</h2>
              <CopyButton value={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Payload</h2>
              <CopyButton value={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Time claims</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-canvas px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Issued at</p>
                <p className="font-mono text-sm">{formatUnixDate(decoded.payload.iat) ?? "Not present"}</p>
              </div>
              <div className="rounded-2xl bg-canvas px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Expires at</p>
                <p className="font-mono text-sm">{formatUnixDate(decoded.payload.exp) ?? "Not present"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
