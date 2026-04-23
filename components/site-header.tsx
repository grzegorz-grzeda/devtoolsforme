import Link from "next/link";

const navItems = [
  { href: "/", label: "All tools" },
  { href: "/tools/json-formatter", label: "Data" },
  { href: "/tools/regex-tester", label: "Text" },
  { href: "/about", label: "About" },
  { href: "mailto:hello@devtoolsforme.com?subject=devtoolsforme%20feedback", label: "Feedback" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-canvas/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-xs font-bold uppercase tracking-[0.18em] text-white">
            dt
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-lake/80">devtoolsforme</p>
            <p className="truncate text-xs text-ink/65">Fast browser-side utilities</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-ink/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
