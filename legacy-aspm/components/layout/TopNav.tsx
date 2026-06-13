"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const pills = [
  { href: "/demo", label: "Overview" },
  { href: "/agents", label: "Agents" },
  { href: "/policies", label: "Policies" },
  { href: "/reports", label: "Reports" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="h-12 hairline-b flex items-center gap-3 px-4 bg-bg-base/80 backdrop-blur supports-[backdrop-filter]:bg-bg-base/60 sticky top-0 z-30">
      <Link href="/demo" className="md:hidden flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-accent" aria-hidden="true" />
        <span className="text-[13px] font-semibold">ASPM</span>
      </Link>

      <nav className="hidden sm:flex items-center gap-1 rounded-lg bg-surface-2 hairline p-0.5">
        {pills.map((p) => {
          const active = pathname.startsWith(p.href);
          return (
            <Link
              key={p.href}
              href={p.href}
              className={cn(
                "px-3 h-7 inline-flex items-center text-[12px] rounded-md text-fg-muted hover:text-fg",
                active && "bg-surface-3 text-fg",
              )}
            >
              {p.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:flex items-center gap-2 ml-2 px-2.5 h-7 rounded-md bg-surface-2 hairline text-fg-subtle text-[12px] w-72">
        <Search size={12} />
        <span>Search agents, tools, owners…</span>
        <span className="ml-auto text-[10px] border [border-width:0.5px] border-line-strong rounded px-1 py-0.5">
          ⌘K
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="sm">
          <Download size={12} />
          Export
        </Button>
        <Button variant="primary" size="sm">
          <Plus size={12} />
          Add agent
        </Button>
      </div>
    </header>
  );
}
