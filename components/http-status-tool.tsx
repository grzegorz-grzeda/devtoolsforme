"use client";

import { useMemo, useState } from "react";

const statusMap: Record<string, { title: string; detail: string; category: string }> = {
  "200": { title: "OK", detail: "The request succeeded and the response contains the expected data.", category: "Success" },
  "201": { title: "Created", detail: "A new resource was created successfully.", category: "Success" },
  "204": { title: "No Content", detail: "The request succeeded and there is nothing to return in the body.", category: "Success" },
  "301": { title: "Moved Permanently", detail: "The resource now lives at a different permanent URL.", category: "Redirect" },
  "302": { title: "Found", detail: "The resource is temporarily available at another URL.", category: "Redirect" },
  "400": { title: "Bad Request", detail: "The server could not process the request because the input was invalid.", category: "Client Error" },
  "401": { title: "Unauthorized", detail: "Authentication is required or failed.", category: "Client Error" },
  "403": { title: "Forbidden", detail: "The client is authenticated but does not have permission.", category: "Client Error" },
  "404": { title: "Not Found", detail: "The requested resource could not be found.", category: "Client Error" },
  "409": { title: "Conflict", detail: "The request conflicts with the current state of the target resource.", category: "Client Error" },
  "422": { title: "Unprocessable Content", detail: "The request structure is valid but semantic validation failed.", category: "Client Error" },
  "429": { title: "Too Many Requests", detail: "Rate limits were exceeded for this client or token.", category: "Client Error" },
  "500": { title: "Internal Server Error", detail: "The server encountered an unexpected condition.", category: "Server Error" },
  "502": { title: "Bad Gateway", detail: "An upstream server returned an invalid response.", category: "Server Error" },
  "503": { title: "Service Unavailable", detail: "The service is temporarily unavailable, often due to overload or maintenance.", category: "Server Error" }
};

export function HTTPStatusTool() {
  const [query, setQuery] = useState("404");

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return Object.entries(statusMap).filter(([code, info]) => {
      return !normalized || code.includes(normalized) || info.title.toLowerCase().includes(normalized) || info.category.toLowerCase().includes(normalized);
    });
  }, [query]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Search by code or label
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-lg outline-none transition focus:border-accent" />
      </label>
      <div className="grid gap-3">
        {matches.map(([code, info]) => (
          <div key={code} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{info.category}</p>
                <h2 className="text-2xl font-bold tracking-tight text-ink">{code} {info.title}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-ink/70">{info.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
