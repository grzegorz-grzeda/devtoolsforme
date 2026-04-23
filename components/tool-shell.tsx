import Link from "next/link";
import type { ReactNode } from "react";
import { FavoriteToolButton, ToolCopyLinkButton, ToolVisitTracker } from "@/components/tool-preferences";

export function ToolShell({
  slug,
  title,
  eyebrow,
  description,
  children,
}: {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 md:px-8 md:py-7">
      <ToolVisitTracker slug={slug} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="theme-secondary-button px-3 py-1.5 text-sm font-medium">
          Back to tools
        </Link>
        <span className="theme-chip px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      </div>

      <section className="space-y-4">
        <div className="space-y-4 rounded-[1.6rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-lake/80">devtoolsforme</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h1>
              <p className="max-w-3xl text-sm leading-7 text-ink/75 md:text-base">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FavoriteToolButton slug={slug} />
              <ToolCopyLinkButton title={title} />
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/70 bg-card p-4 shadow-soft backdrop-blur md:p-5">
          {children}
        </div>
      </section>
    </main>
  );
}
