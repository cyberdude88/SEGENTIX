"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn, timeAgo } from "@/lib/utils";
import type { Agent, RiskClass, RiskLevel } from "@/lib/types";

const riskTone: Record<RiskClass, "low" | "info" | "warn" | "high"> = {
  Read: "low",
  Write: "info",
  Execute: "warn",
  Modify: "info",
  Delete: "warn",
  Admin: "high",
};

const RISK_ORDER: RiskLevel[] = ["High", "Medium", "Low"];

function lowerRisk(r: RiskLevel, steps: number): RiskLevel {
  const i = RISK_ORDER.indexOf(r);
  return RISK_ORDER[Math.min(i + steps, RISK_ORDER.length - 1)];
}

interface Mitigations {
  contained: boolean;
  credsFrozen: boolean;
  runbookExecuted: boolean;
  ownerNotified: boolean;
}

const EMPTY: Mitigations = {
  contained: false,
  credsFrozen: false,
  runbookExecuted: false,
  ownerNotified: false,
};

export default function AgentDetailPanel({
  agent,
  onClose,
}: {
  agent: Agent | null;
  onClose: () => void;
}) {
  const [mitigations, setMitigations] = useState<Record<string, Mitigations>>(
    {},
  );
  const m: Mitigations = agent ? mitigations[agent.id] ?? EMPTY : EMPTY;
  const steps =
    (m.contained ? 1 : 0) +
    (m.credsFrozen ? 1 : 0) +
    (m.runbookExecuted ? 1 : 0);
  const displayedRisk: RiskLevel = agent
    ? lowerRisk(agent.risk, steps)
    : "Low";
  const apply = (patch: Partial<Mitigations>) => {
    if (!agent) return;
    setMitigations((prev) => ({
      ...prev,
      [agent.id]: { ...(prev[agent.id] ?? EMPTY), ...patch },
    }));
  };

  return (
    <Sheet open={!!agent} onOpenChange={(o) => !o && onClose()}>
      {agent && (
        <SheetContent>
          <SheetHeader className="pt-6 pr-14">
            <div className="flex items-start gap-3">
              <Avatar
                name={agent.name}
                size={36}
                tone={
                  agent.risk === "High"
                    ? "danger"
                    : agent.risk === "Medium"
                      ? "warn"
                      : "accent"
                }
              />
              <div className="min-w-0 flex-1">
                <SheetTitle>{agent.name}</SheetTitle>
                <SheetDescription>
                  {agent.platform} · {agent.environment} · {agent.businessUnit}
                </SheetDescription>
              </div>
              <Badge
                variant={
                  displayedRisk === "High"
                    ? "high"
                    : displayedRisk === "Medium"
                      ? "medium"
                      : "low"
                }
                dot
              >
                {displayedRisk}
              </Badge>
            </div>
          </SheetHeader>

          <div className="overflow-y-auto px-6 py-5 space-y-5">
            <section>
              <h4 className="text-[11px] uppercase tracking-wider text-fg-subtle mb-2">
                Metadata
              </h4>
              <dl className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[12px]">
                <dt className="text-fg-muted">Agent ID</dt>
                <dd className="font-mono">{agent.id}</dd>
                <dt className="text-fg-muted">Owner</dt>
                <dd>
                  {agent.owner ?? (
                    <span className="text-warn">Unknown</span>
                  )}
                </dd>
                <dt className="text-fg-muted">Origin</dt>
                <dd>
                  {agent.origin === "Shadow" ? (
                    <Badge variant="shadow">Shadow</Badge>
                  ) : agent.origin === "Discovered" ? (
                    <Badge variant="info">Discovered</Badge>
                  ) : (
                    <Badge variant="neutral">Registered</Badge>
                  )}
                </dd>
                <dt className="text-fg-muted">Environment</dt>
                <dd>{agent.environment}</dd>
                <dt className="text-fg-muted">Business unit</dt>
                <dd>{agent.businessUnit}</dd>
                <dt className="text-fg-muted">Created</dt>
                <dd>{timeAgo(agent.createdAt)}</dd>
                <dt className="text-fg-muted">Last active</dt>
                <dd>{timeAgo(agent.lastActiveAt)}</dd>
              </dl>
            </section>

            <section>
              <h4 className="text-[11px] uppercase tracking-wider text-fg-subtle mb-2 flex items-center justify-between">
                <span>Risk flags</span>
                <span className="text-fg-subtle">{agent.flags.length}</span>
              </h4>
              {agent.flags.length === 0 ? (
                <div className="text-[12px] text-fg-muted">No risk flags.</div>
              ) : (
                <ul className="space-y-1.5">
                  {agent.flags.map((f) => (
                    <li
                      key={f}
                      className="text-[12px] flex items-center gap-2"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          f.includes("shadow")
                            ? "bg-danger"
                            : f.includes("Administrative")
                              ? "bg-danger"
                              : f.includes("Production")
                                ? "bg-warn"
                                : "bg-info",
                        )}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h4 className="text-[11px] uppercase tracking-wider text-fg-subtle mb-2 flex items-center justify-between">
                <span>Tool inventory</span>
                <span className="text-fg-subtle">{agent.tools.length}</span>
              </h4>
              <ul className="space-y-2.5">
                {agent.tools.map((t) => (
                  <li
                    key={t.name}
                    className="rounded-lg hairline p-3 bg-surface-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium">{t.name}</div>
                        <div className="text-[11px] text-fg-muted">
                          {t.type} · {t.authMethod} · {t.connectedAccount}
                        </div>
                      </div>
                      <Badge variant="neutral">{t.actions.length} actions</Badge>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {t.actions.map((a) => (
                        <li
                          key={a.name}
                          className="inline-flex items-center gap-1.5 text-[11px]"
                        >
                          <Badge variant={riskTone[a.risk]}>{a.risk}</Badge>
                          <span className="font-mono text-fg-muted">
                            {a.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-line-subtle pt-4">
              <h4 className="text-[11px] uppercase tracking-wider text-fg-subtle mb-3 flex items-center justify-between">
                <span>Response actions</span>
                <span className="text-fg-subtle">
                  {steps > 0 ? `${steps} applied` : "None applied"}
                </span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={m.contained}
                  onClick={() => apply({ contained: true })}
                  className="inline-flex items-center justify-center gap-1.5 border border-danger/40 bg-danger/10 px-3 py-2 text-[11px] mono uppercase tracking-[0.16em] text-danger hover:bg-danger/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {m.contained ? "✓ Quarantined" : "Quarantine"}
                </button>
                <button
                  type="button"
                  disabled={m.credsFrozen}
                  onClick={() => apply({ credsFrozen: true })}
                  className="inline-flex items-center justify-center gap-1.5 border border-warn/40 bg-warn/10 px-3 py-2 text-[11px] mono uppercase tracking-[0.16em] text-warn hover:bg-warn/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {m.credsFrozen ? "✓ Creds frozen" : "Freeze creds"}
                </button>
                <button
                  type="button"
                  disabled={m.runbookExecuted}
                  onClick={() => apply({ runbookExecuted: true })}
                  className="inline-flex items-center justify-center gap-1.5 border border-accent/40 bg-accent/10 px-3 py-2 text-[11px] mono uppercase tracking-[0.16em] text-accent hover:bg-accent/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {m.runbookExecuted ? "✓ Runbook done" : "Execute runbook"}
                </button>
                <button
                  type="button"
                  disabled={m.ownerNotified}
                  onClick={() => apply({ ownerNotified: true })}
                  className="inline-flex items-center justify-center gap-1.5 border border-info/40 bg-info/10 px-3 py-2 text-[11px] mono uppercase tracking-[0.16em] text-info hover:bg-info/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {m.ownerNotified ? "✓ Owner paged" : "Notify owner"}
                </button>
              </div>
              <div className="mt-2 text-[10px] text-fg-subtle">
                Quarantine, Freeze creds, and Execute runbook each lower risk by
                one tier.
              </div>
            </section>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
