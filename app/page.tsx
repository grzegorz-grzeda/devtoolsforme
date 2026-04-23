import Link from "next/link";
import { HomeToolBrowser } from "@/components/home-tool-browser";
import { tools } from "@/lib/tools";

const embeddedCount = tools.filter((tool) => tool.category === "Embedded").length;

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl flex-1 px-5 py-6 md:px-8 md:py-8">
      <section className="rounded-[1.8rem] border border-white/60 bg-card px-5 py-5 shadow-soft backdrop-blur md:px-7 md:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lake/80">devtoolsforme</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Quick browser tools for developer workflows.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/75 md:text-base">
              Search, open, and use the tool you need without leaving the tab. General utilities,
              data helpers, and embedded workflows are all client-side.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools/bitmask-calculator"
              className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accentDark"
            >
              Embedded tools
            </Link>
            <Link
              href="mailto:hello@devtoolsforme.com?subject=devtoolsforme%20feedback"
              className="rounded-full border border-ink/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Request a tool
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-lake/85">
          <span className="rounded-full bg-sage px-3 py-1.5">{tools.length} tools</span>
          <span className="rounded-full bg-sage px-3 py-1.5">{embeddedCount} embedded</span>
          <span className="rounded-full bg-sage px-3 py-1.5">client-side only</span>
          <span className="rounded-full bg-sage px-3 py-1.5">privacy-first analytics</span>
        </div>
      </section>

      <HomeToolBrowser tools={tools} />
    </main>
  );
}
