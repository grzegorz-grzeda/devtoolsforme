import Link from "next/link";

const footerLinks = [
  { href: "/", label: "All tools" },
  { href: "/my-tools", label: "My tools" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-white/35">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-5 text-sm text-ink/70 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lake/80">devtoolsforme</p>
          <span className="hidden text-ink/30 md:inline">/</span>
          <p className="text-xs text-ink/60">Browser-first developer utilities</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accent">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
