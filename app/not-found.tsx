import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16 md:px-10">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-card px-6 py-10 shadow-soft backdrop-blur md:px-10 md:py-14">
        <div className="absolute inset-0 -z-10 bg-hero-grid bg-[size:28px_28px] opacity-50" />
        <div className="absolute -right-12 top-8 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-lake/15 blur-3xl" />

        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-lake/80">404 · Not Found</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight text-ink md:text-7xl">
          This tool page slipped off the workbench.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/75">
          The page you tried to open does not exist or may have moved. Head back to the library and pick up where you left off.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="theme-primary-button px-5 py-3 text-sm font-semibold">
            Browse all tools
          </Link>
          <Link href="/tools/json-formatter" className="theme-secondary-button px-5 py-3 text-sm font-semibold">
            Open JSON Formatter
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { href: "/tools/uuid", label: "UUID Generator" },
            { href: "/tools/regex-tester", label: "Regex Tester" },
            { href: "/tools/http-status", label: "HTTP Status Lookup" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-ink/10 bg-white/70 px-5 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
