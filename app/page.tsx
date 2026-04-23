import Link from "next/link";
import { HomeToolBrowser } from "@/components/home-tool-browser";
import { tools } from "@/lib/tools";

const embeddedCount = tools.filter((tool) => tool.category === "Embedded").length;

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl flex-1 px-6 py-8 md:px-10 md:py-10">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-card px-6 py-8 shadow-soft backdrop-blur md:px-10 md:py-12">
        <div className="absolute inset-0 -z-10 bg-hero-grid bg-[size:28px_28px] opacity-60" />
        <div className="absolute -right-12 top-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-lake/20 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-lake/80">devtoolsforme</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight text-ink md:text-7xl">
              Pocket-sized developer tools, shaped for everyday flow.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/75">
              Run common developer tasks directly in the browser: format data, inspect tokens, convert
              values, compare text, generate placeholders, and now handle embedded-firmware chores without leaving the tab.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tools/bitmask-calculator" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accentDark">Open Embedded tools</Link>
              <Link href="mailto:hello@devtoolsforme.com?subject=devtoolsforme%20feedback" className="rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white">Request a tool or send feedback</Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-ink p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Toolkit now includes</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-white/85">
              <li>{tools.length} browser-first tools with no backend dependency</li>
              <li>{embeddedCount} dedicated embedded and firmware helpers</li>
              <li>Usage-aware sections, trust pages, and privacy-first analytics controls</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">Tool library</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">General-purpose utilities plus a featured embedded workspace</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-ink/65">
          Pick a tool card and jump straight into the task. Everything here runs client-side for speed and privacy.
        </p>
      </section>

      <HomeToolBrowser tools={tools} />
    </main>
  );
}
