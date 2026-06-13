"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  ShieldCheck,
  FileBarChart,
  Workflow,
  Plug,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const main = [
  { href: "/demo", label: "Overview", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/policies", label: "Policies", icon: ShieldCheck },
  { href: "/reports", label: "Reports", icon: FileBarChart },
];

const ops = [
  { href: "#", label: "Runtime gateway", icon: Workflow, tag: "Roadmap" },
  { href: "#", label: "Behavioral analytics", icon: Activity, tag: "Roadmap" },
  { href: "#", label: "Integrations", icon: Plug },
  { href: "#", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 shrink-0 hairline-r bg-bg-surface/40 flex-col">
      <div className="px-4 h-12 flex items-center hairline-b">
        <Link href="/demo" className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-md bg-accent" aria-hidden="true" />
          <span className="text-[13px] font-semibold tracking-tight">
            ASPM
          </span>
          <span className="text-[10px] text-fg-subtle tracking-wider uppercase rounded border [border-width:0.5px] border-line-strong px-1.5 py-0.5">
            v0.1
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 text-[13px]">
        <div className="px-2 pb-1 pt-1 text-[10px] uppercase tracking-wider text-fg-subtle">
          Governance
        </div>
        <ul className="space-y-0.5">
          {main.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-fg-muted hover:text-fg hover:bg-surface-2",
                    active && "bg-surface-3 text-fg",
                  )}
                >
                  <Icon size={14} className="opacity-80" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-2 pb-1 pt-4 text-[10px] uppercase tracking-wider text-fg-subtle">
          Operations
        </div>
        <ul className="space-y-0.5">
          {ops.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-fg-muted hover:text-fg hover:bg-surface-2"
                >
                  <Icon size={14} className="opacity-80" />
                  <span className="flex-1">{item.label}</span>
                  {item.tag && (
                    <span className="text-[9px] uppercase tracking-wider text-fg-subtle border [border-width:0.5px] border-line-strong rounded px-1 py-0.5">
                      {item.tag}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 hairline-t text-[11px] text-fg-subtle">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>Posture layer active</span>
        </div>
        <div className="mt-1 text-[10px] text-fg-subtle/70">
          Runtime + behavioral on roadmap
        </div>
      </div>
    </aside>
  );
}
