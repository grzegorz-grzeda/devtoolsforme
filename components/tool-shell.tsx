import Link from "next/link";
import type { ReactNode } from "react";

export function ToolShell({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:bg-white"
        >
          Back to all tools
        </Link>
        <span className="rounded-full bg-sage px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-lake">
          {eyebrow}
        </span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">devtoolsforme</p>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-ink md:text-6xl">{title}</h1>
          <p className="max-w-lg text-lg leading-8 text-ink/75">{description}</p>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-card p-5 shadow-soft backdrop-blur md:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
