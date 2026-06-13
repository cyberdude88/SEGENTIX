"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { ComplianceControl, ComplianceState } from "@/lib/types";

const variant: Record<ComplianceState, "low" | "warn" | "high"> = {
  Pass: "low",
  Partial: "warn",
  Gap: "high",
};

export default function ComplianceMatrix({
  controls,
}: {
  controls: ComplianceControl[];
}) {
  const [active, setActive] = useState<ComplianceControl | null>(null);

  const grouped = new Map<string, ComplianceControl[]>();
  for (const c of controls) {
    const list = grouped.get(c.framework) ?? [];
    list.push(c);
    grouped.set(c.framework, list);
  }

  return (
    <>
      <div className="divide-y divide-line-subtle">
        {Array.from(grouped.entries()).map(([framework, items]) => {
          const pass = items.filter((i) => i.state === "Pass").length;
          return (
            <div key={framework} className="px-5 py-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
                  {framework}
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                  {pass}/{items.length} pass
                </div>
              </div>
              <ul className="space-y-1.5">
                {items.map((c) => {
                  const pct = Math.round(
                    (c.evidenceCount / Math.max(c.agentsInScope, 1)) * 100,
                  );
                  return (
                    <li key={c.framework + c.control}>
                      <button
                        type="button"
                        onClick={() => setActive(c)}
                        aria-label={`Open details for ${c.control}`}
                        className="grid w-full grid-cols-[80px_1fr_auto_auto_16px] items-center gap-3 rounded-sm px-1 py-1 text-left text-[12px] transition-colors hover:bg-accent/5 focus:bg-accent/10 focus:outline-none"
                      >
                        <span className="mono text-[11px] text-accent">
                          {c.control}
                        </span>
                        <span className="truncate text-fg-muted group-hover:text-fg">
                          {c.title}
                        </span>
                        <span className="mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                          {c.evidenceCount}/{c.agentsInScope} evidence
                        </span>
                        <Badge variant={variant[c.state]} dot>
                          {c.state}
                        </Badge>
                        <ChevronRight
                          size={14}
                          className="text-fg-subtle"
                          aria-hidden
                        />
                        <span className="sr-only">{pct}% coverage</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <Sheet
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        {active && (
          <SheetContent>
            <SheetHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
                    {active.framework}
                  </div>
                  <SheetTitle>{active.control}</SheetTitle>
                  <SheetDescription>{active.title}</SheetDescription>
                </div>
                <Badge variant={variant[active.state]} dot>
                  {active.state}
                </Badge>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <Coverage
                evidence={active.evidenceCount}
                scope={active.agentsInScope}
              />

              {active.requirement && (
                <Section label="Requirement">
                  <p className="text-[13px] text-fg-muted leading-relaxed">
                    {active.requirement}
                  </p>
                </Section>
              )}

              {active.gapSummary && (
                <Section label="Current gap">
                  <p className="text-[13px] text-fg-muted leading-relaxed">
                    {active.gapSummary}
                  </p>
                </Section>
              )}

              {active.recommendedActions &&
                active.recommendedActions.length > 0 && (
                  <Section label="Recommended actions">
                    <ul className="space-y-1.5 text-[13px] text-fg-muted">
                      {active.recommendedActions.map((a) => (
                        <li
                          key={a}
                          className="flex gap-2 leading-relaxed before:mt-2 before:h-1 before:w-1 before:flex-shrink-0 before:bg-accent"
                        >
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

              {active.sampleEvidence &&
                active.sampleEvidence.length > 0 && (
                  <Section label="Sample evidence">
                    <ul className="space-y-1 mono text-[11px] text-fg-muted">
                      {active.sampleEvidence.map((e) => (
                        <li
                          key={e}
                          className="truncate border-l border-accent/30 pl-2"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
        {label}
      </div>
      {children}
    </section>
  );
}

function Coverage({ evidence, scope }: { evidence: number; scope: number }) {
  const pct = Math.round((evidence / Math.max(scope, 1)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
          Evidence coverage
        </div>
        <div className="mono text-[11px] text-fg-muted">
          {evidence}/{scope} · {pct}%
        </div>
      </div>
      <div className="h-1.5 w-full bg-line-subtle">
        <div
          className="h-full bg-accent"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
