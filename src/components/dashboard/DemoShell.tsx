"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  Crown,
  EyeOff,
  KeyRound,
  ShieldAlert,
  UserX,
  LayoutDashboard,
  AlertTriangle,
  Radar,
  Table2,
  Network,
  FileCheck2,
  Wrench,
  SlidersHorizontal,
  HeartPulse,
  PlugZap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BackButton from "@/components/BackButton";

export type DemoSectionId =
  | "overview"
  | "risk"
  | "discovery"
  | "inventory"
  | "access"
  | "compliance"
  | "tools"
  | "callers"
  | "policy"
  | "healing";

export type DemoMetrics = {
  total: number;
  active: number;
  unknownOwner: number;
  highRisk: number;
  adminAccess: number;
  prodCreds: number;
  shadow: number;
  shadowTrend: number;
};

type Section = {
  id: DemoSectionId;
  label: string;
  icon: typeof Bot;
  content: ReactNode;
};

const metricRows = (m: DemoMetrics) =>
  [
    { label: "Total agents", value: m.total, icon: Bot, tone: "text-fg", href: "/agents" },
    { label: "Active", value: m.active, icon: Activity, tone: "text-accent", href: "/agents?status=active" },
    { label: "Unknown owner", value: m.unknownOwner, icon: UserX, tone: "text-warn", href: "/agents?owner=unknown" },
    { label: "High risk", value: m.highRisk, icon: ShieldAlert, tone: "text-danger", href: "/agents?risk=High" },
    { label: "Admin access", value: m.adminAccess, icon: Crown, tone: "text-fg", href: "/agents?admin=true" },
    { label: "Prod credentials", value: m.prodCreds, icon: KeyRound, tone: "text-info", href: "/agents?prodCreds=true" },
    {
      label: "Shadow agents",
      value: m.shadow,
      icon: EyeOff,
      tone: "text-warn",
      trend: `+${m.shadowTrend} this week`,
      href: "/agents?shadow=true",
    },
  ] as const;

export const sectionIcons: Record<DemoSectionId, typeof Bot> = {
  overview: LayoutDashboard,
  risk: AlertTriangle,
  discovery: Radar,
  inventory: Table2,
  access: Network,
  compliance: FileCheck2,
  tools: Wrench,
  callers: PlugZap,
  policy: SlidersHorizontal,
  healing: HeartPulse,
};

const sectionLabels: Record<DemoSectionId, string> = {
  overview: "Overview",
  risk: "Risk",
  discovery: "Discovery",
  inventory: "Inventory",
  access: "Access",
  compliance: "Compliance",
  tools: "Tools",
  callers: "Unapproved API callers",
  policy: "Policy & SIEM",
  healing: "Adaptive self-healing",
};

export default function DemoShell({
  metrics,
  sections,
}: {
  metrics: DemoMetrics;
  sections: Record<DemoSectionId, ReactNode>;
}) {
  const [active, setActive] = useState<DemoSectionId>("overview");
  const [tick, setTick] = useState(0);
  const [railOpen, setRailOpen] = useState(true);

  const ordered: Section[] = (Object.keys(sectionLabels) as DemoSectionId[]).map(
    (id) => ({
      id,
      label: sectionLabels[id],
      icon: sectionIcons[id],
      content: sections[id],
    }),
  );

  const activeSection = ordered.find((s) => s.id === active)!;

  const onSelect = (id: DemoSectionId) => {
    if (id === active) return;
    setActive(id);
    setTick((t) => t + 1);
  };

  return (
    <main className="min-h-screen bg-bg text-fg grid-bg">
      <button
        type="button"
        onClick={() => setRailOpen(true)}
        aria-label="Show side panel"
        aria-hidden={railOpen}
        tabIndex={railOpen ? -1 : 0}
        className={cn(
          "fixed left-0 top-1/2 z-30 -translate-y-1/2 border border-l-0 border-accent/35 bg-bg/85 px-1.5 py-3 text-fg-muted backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent",
          railOpen
            ? "pointer-events-none -translate-x-full opacity-0"
            : "translate-x-0 opacity-100",
        )}
      >
        <PanelLeftOpen size={16} />
      </button>
      <div className="mx-auto max-w-[1440px] px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-accent/15 pb-5">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-accent">
              SEGENTIX // DEMO
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-shadow-glow md:text-5xl">
              Posture overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              Discovery, privilege mapping, and policy enforcement across every
              registered and shadow agent.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BackButton fallbackHref="/" />
            <Link
              href="/"
              className="mono border border-accent/45 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              Home
            </Link>
            <a
              href="mailto:alex.ansbergs@gmail.com"
              className="mono border border-accent/45 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              Contact
            </a>
          </div>
        </div>

        <div
          className={cn(
            "mt-5 grid grid-cols-1 gap-4 transition-[grid-template-columns] duration-300 ease-out",
            railOpen
              ? "lg:grid-cols-[280px_minmax(0,1fr)]"
              : "lg:grid-cols-[0px_minmax(0,1fr)]",
          )}
        >
          {/* Left rail */}
          <aside
            className={cn(
              "lg:sticky lg:top-4 lg:self-start space-y-4 transition-[transform,opacity] duration-300 ease-out",
              railOpen
                ? "translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-4 opacity-0 lg:-translate-x-[110%]",
            )}
            aria-hidden={!railOpen}
          >
            <div className="border border-accent/15 bg-bg/40 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-accent/15 px-4 py-3">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.24em] text-fg-muted">
                    Fleet metrics
                  </div>
                  <div className="mono mt-1 text-[10px] text-fg-subtle">
                    Last sync · 2m ago
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRailOpen(false)}
                  aria-label="Hide side panel"
                  className="inline-flex h-7 w-7 items-center justify-center border border-accent/25 text-fg-muted transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  <PanelLeftClose size={14} />
                </button>
              </div>
              <ul className="divide-y divide-accent/10">
                {metricRows(metrics).map((row) => {
                  const Icon = row.icon;
                  return (
                    <li key={row.label}>
                      <Link
                        href={row.href}
                        aria-label={`View ${row.label.toLowerCase()} agents`}
                        className="group flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-accent/5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon size={13} className={cn("opacity-80", row.tone)} />
                          <span className="mono truncate text-[10px] uppercase tracking-[0.18em] text-fg-muted group-hover:text-fg">
                            {row.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 shrink-0">
                          <span className="text-base font-semibold tabular-nums">
                            {row.value}
                          </span>
                          {"trend" in row && row.trend && (
                            <span className={cn("text-[10px]", row.tone)}>
                              {row.trend}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <nav className="border border-accent/15 bg-bg/40 backdrop-blur-sm">
              <div className="border-b border-accent/15 px-4 py-3 mono text-[10px] uppercase tracking-[0.24em] text-fg-muted">
                Sections
              </div>
              <ul>
                {ordered.map((s) => {
                  const Icon = s.icon;
                  const isActive = s.id === active;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(s.id)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors",
                          "border-l-2",
                          isActive
                            ? "border-accent bg-accent/10 text-fg"
                            : "border-transparent text-fg-muted hover:border-accent/40 hover:bg-accent/5 hover:text-fg",
                        )}
                      >
                        <Icon size={14} className={isActive ? "text-accent" : ""} />
                        <span>{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Right pane */}
          <section className="relative overflow-hidden">
            <div
              key={`${active}-${tick}`}
              className="animate-slide-in-right space-y-4"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-accent/15 pb-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  {activeSection.label}
                </h2>
                <div className="mono text-[10px] uppercase tracking-[0.24em] text-fg-subtle">
                  Section {ordered.findIndex((s) => s.id === active) + 1} /{" "}
                  {ordered.length}
                </div>
              </div>
              {activeSection.content}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
