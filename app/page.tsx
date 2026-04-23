import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8 md:px-10 md:py-10">
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
              Start with fast utilities that run right in the browser: UUID generation, Base64 conversion,
              arithmetic, and number-system conversion. Designed to stay lightweight and easy to grow.
            </p>
          </div>

          <div className="rounded-[2rem] bg-ink p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Launch plan</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-white/85">
              <li>Static-friendly Next.js setup for smooth Netlify deployment</li>
              <li>Standalone tool pages that can scale into a larger library</li>
              <li>Browser-only logic for speed, privacy, and lower hosting cost</li>
            </ul>
            <Link
              href="/tools/uuid"
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accentDark"
            >
              Try the first tool
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {tools.map((tool, index) => (
          <ToolCard key={tool.slug} tool={tool} index={index} />
        ))}
      </section>
    </main>
  );
}
