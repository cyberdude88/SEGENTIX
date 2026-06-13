"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingNav() {
  const pathname = usePathname();
  return (
    <header className="h-14 hairline-b sticky top-0 z-30 bg-bg-base/80 backdrop-blur supports-[backdrop-filter]:bg-bg-base/60">
      <div className="mx-auto max-w-[1200px] h-full px-5 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-accent" aria-hidden="true" />
          <span className="text-[14px] font-semibold tracking-tight">SEGENTIX</span>
          <span className="text-[10px] text-fg-subtle tracking-wider uppercase rounded border [border-width:0.5px] border-line-strong px-1.5 py-0.5">
            v0.1
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 ml-2">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 h-8 inline-flex items-center text-[13px] rounded-md text-fg-muted hover:text-fg",
                  active && "text-fg",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
