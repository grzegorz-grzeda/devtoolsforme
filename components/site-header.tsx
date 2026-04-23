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
    <header className="sticky top-0 z-40 border-b border-white/60 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sm font-bold uppercase tracking-[0.2em] text-white">
            dt
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lake/80">devtoolsforme</p>
            <p className="text-sm text-ink/65">Fast browser-side utilities for daily work</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
