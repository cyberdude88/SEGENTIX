import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="hairline-t mt-24">
      <div className="mx-auto max-w-[1200px] px-5 py-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-[12px] text-fg-subtle">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-accent" aria-hidden="true" />
          <span>ASPM</span>
          <span className="text-fg-subtle/70">— v0.1 prototype</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="hover:text-fg">
            About
          </Link>
          <Link href="/contact" className="hover:text-fg">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
