import Link from "next/link";
import { HomeToolBrowser } from "@/components/home-tool-browser";
import { tools } from "@/lib/tools";

const embeddedCount = tools.filter((tool) => tool.category === "Embedded").length;

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl flex-1 px-5 py-5 md:px-8 md:py-6">
      <section className="theme-panel rounded-[1.6rem] px-5 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lake/80">devtoolsforme</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Quick browser tools for developer workflows.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/75">
              Search, open, and use the tool you need without leaving the tab. General utilities,
              data helpers, and embedded workflows are all client-side.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/my-tools" className="theme-primary-button px-4 py-2 text-sm font-semibold">
              My tools
            </Link>
            <Link href="mailto:hello@devtoolsforme.com?subject=devtoolsforme%20feedback" className="theme-secondary-button px-4 py-2 text-sm font-semibold">
              Request a tool
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-lake/85">
          <span className="theme-chip px-3 py-1.5">{tools.length} tools</span>
          <span className="theme-chip px-3 py-1.5">{embeddedCount} embedded</span>
          <span className="theme-chip px-3 py-1.5">client-side only</span>
          <span className="theme-chip px-3 py-1.5">privacy-first analytics</span>
        </div>
      </section>

      <HomeToolBrowser tools={tools} />
    </main>
  );
}
