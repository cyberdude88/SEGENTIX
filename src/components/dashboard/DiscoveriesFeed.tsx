"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { timeAgo } from "@/lib/utils";
import type { Discovery, OriginBadge } from "@/lib/types";

function originVariant(o: OriginBadge): "teal" | "info" | "shadow" {
  if (o === "IT-approved") return "teal";
  if (o === "Business unit") return "info";
  return "shadow";
}

type RunbookId =
  | "shadow-ai-containment"
  | "shadow-ai-credential-freeze"
  | "shadow-ai-approval-route"
  | "shadow-ai-full"
  | "business-unit-onboard"
  | "it-approved-baseline";

interface RunbookStep {
  label: string;
  detail: string;
}

interface Runbook {
  id: RunbookId;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  sla: string;
  summary: string;
  steps: RunbookStep[];
}

const RUNBOOKS: Record<RunbookId, Runbook> = {
  "shadow-ai-containment": {
    id: "shadow-ai-containment",
    title: "Quarantine Shadow AI runtime",
    severity: "Critical",
    owner: "SOC · Tier 2",
    sla: "15 min to contain",
    summary:
      "Isolate the discovered agent runtime from production data planes before further investigation.",
    steps: [
      { label: "Snapshot runtime state", detail: "Capture process tree, in-flight tool calls, and memory for forensics." },
      { label: "Sever egress", detail: "Apply deny-all egress policy at the network edge; allow only SOC sink." },
      { label: "Suspend orchestrator", detail: "Pause the agent loop via the platform admin API (Agentforce / n8n / Copilot Studio)." },
      { label: "Notify owner candidate", detail: "Page the suspected business owner with a 1-hour ack window." },
    ],
  },
  "shadow-ai-credential-freeze": {
    id: "shadow-ai-credential-freeze",
    title: "Freeze agent credentials",
    severity: "Critical",
    owner: "IAM · On-call",
    sla: "10 min to revoke",
    summary:
      "Revoke active sessions and rotate every OAuth / API key tied to the shadow agent identity.",
    steps: [
      { label: "Enumerate identities", detail: "Map service principals, OAuth tokens, and connected accounts (Graph, Salesforce, GitHub)." },
      { label: "Revoke active sessions", detail: "Invalidate refresh tokens and force re-auth across all IdPs." },
      { label: "Rotate secrets", detail: "Rotate every static API key referenced by the agent's tool manifests." },
      { label: "Block re-grant", detail: "Add identity to deny-list until governance review completes." },
    ],
  },
  "shadow-ai-approval-route": {
    id: "shadow-ai-approval-route",
    title: "Route to Approval workflow",
    severity: "High",
    owner: "Governance Council",
    sla: "1 business day",
    summary:
      "Hand off to the human-in-the-loop approval pipeline for registration, scoping, or decommission.",
    steps: [
      { label: "Open approval ticket", detail: "Auto-create governance review with discovery evidence attached." },
      { label: "Assign reviewers", detail: "Route to BU owner + Security + Compliance based on platform." },
      { label: "Decision", detail: "Register with policy template, restrict scope, or decommission." },
      { label: "Close loop", detail: "Update agent inventory and SIEM tag; clear quarantine if approved." },
    ],
  },
  "shadow-ai-full": {
    id: "shadow-ai-full",
    title: "Shadow AI full response runbook",
    severity: "Critical",
    owner: "SOC + IAM + Governance",
    sla: "End-to-end · 1 business day",
    summary:
      "Composite runbook covering containment, credential freeze, and governance handoff for any newly surfaced Shadow AI agent.",
    steps: [
      { label: "Triage", detail: "Validate the discovery signal isn't a false positive from a registered agent." },
      { label: "Contain", detail: "Run the quarantine runbook to isolate the runtime." },
      { label: "Freeze", detail: "Run the credential freeze runbook to neutralize identity." },
      { label: "Investigate", detail: "Pull 30d of tool-call telemetry; check for data exfiltration patterns." },
      { label: "Route", detail: "Hand off to Approval workflow with full evidence packet." },
      { label: "Report", detail: "File incident in SIEM; update Exec KPI dashboard." },
    ],
  },
  "business-unit-onboard": {
    id: "business-unit-onboard",
    title: "Business-unit agent onboarding",
    severity: "Medium",
    owner: "BU Owner + Security",
    sla: "3 business days",
    summary:
      "Bring a BU-built agent into the governed inventory with the right policy template and owner.",
    steps: [
      { label: "Confirm owner", detail: "Verify named BU owner is accountable and reachable on-call." },
      { label: "Attach policy template", detail: "Pick the closest policy template (Sales / HR / Finance / IT)." },
      { label: "Register", detail: "Add to agent inventory; tag environment and business unit." },
      { label: "Enable SIEM streaming", detail: "Confirm telemetry lands in the org SIEM connector." },
    ],
  },
  "it-approved-baseline": {
    id: "it-approved-baseline",
    title: "IT-approved baseline check",
    severity: "Low",
    owner: "Platform Eng",
    sla: "5 business days",
    summary:
      "Confirm a known IT-approved agent still matches its registered baseline.",
    steps: [
      { label: "Diff scope", detail: "Compare current scopes against the registered baseline." },
      { label: "Verify telemetry", detail: "Confirm SIEM events are flowing within expected rate." },
      { label: "Re-affirm owner", detail: "Send quarterly attestation ping to the named owner." },
    ],
  },
};

interface ActionPart {
  text: string;
  runbook?: RunbookId;
}

function recommendedAction(o: OriginBadge): ActionPart[] {
  if (o === "Shadow AI")
    return [
      { text: "Quarantine the agent runtime", runbook: "shadow-ai-containment" },
      { text: ", " },
      { text: "freeze credentials", runbook: "shadow-ai-credential-freeze" },
      { text: ", and route to the " },
      { text: "Approval workflow", runbook: "shadow-ai-approval-route" },
      { text: " for governance review." },
    ];
  if (o === "Business unit")
    return [
      { text: "Assign an owner, attach a policy template, and confirm registration in the inventory.", runbook: "business-unit-onboard" },
    ];
  return [
    { text: "Verify scope, confirm SIEM streaming, and mark as IT-approved baseline.", runbook: "it-approved-baseline" },
  ];
}

function fullRunbookId(o: OriginBadge): RunbookId {
  if (o === "Shadow AI") return "shadow-ai-full";
  if (o === "Business unit") return "business-unit-onboard";
  return "it-approved-baseline";
}

function severityClass(s: Runbook["severity"]): string {
  if (s === "Critical") return "text-danger border-danger/40 bg-danger/10";
  if (s === "High") return "text-warn border-warn/40 bg-warn/10";
  if (s === "Medium") return "text-info border-info/40 bg-info/10";
  return "text-accent border-accent/40 bg-accent/10";
}

type RiskLevel = "Critical" | "High" | "Medium" | "Low";

const RISK_ORDER: RiskLevel[] = ["Critical", "High", "Medium", "Low"];

function initialRisk(o: OriginBadge): RiskLevel {
  if (o === "Shadow AI") return "Critical";
  if (o === "Business unit") return "Medium";
  return "Low";
}

function lowerRisk(r: RiskLevel): RiskLevel {
  const i = RISK_ORDER.indexOf(r);
  return RISK_ORDER[Math.min(i + 1, RISK_ORDER.length - 1)];
}

function riskClass(r: RiskLevel): string {
  if (r === "Critical") return "text-danger border-danger/40 bg-danger/10";
  if (r === "High") return "text-warn border-warn/40 bg-warn/10";
  if (r === "Medium") return "text-info border-info/40 bg-info/10";
  return "text-accent border-accent/40 bg-accent/10";
}

interface AgentState {
  risk: RiskLevel;
  contained: boolean;
  credsFrozen: boolean;
  routed: boolean;
}

interface ExecutionState {
  runbook: RunbookId;
  stepIndex: number;
  totalSteps: number;
}

const STEP_INTERVAL_MS = 900;

function effectsFor(rb: RunbookId): Partial<Omit<AgentState, "risk">> {
  if (rb === "shadow-ai-containment") return { contained: true };
  if (rb === "shadow-ai-credential-freeze") return { credsFrozen: true };
  if (rb === "shadow-ai-approval-route") return { routed: true };
  if (rb === "shadow-ai-full")
    return { contained: true, credsFrozen: true, routed: true };
  return {};
}

export default function DiscoveriesFeed({ items }: { items: Discovery[] }) {
  const [selected, setSelected] = useState<Discovery | null>(null);
  const [runbook, setRunbook] = useState<RunbookId | null>(null);
  const [executing, setExecuting] = useState<Record<string, ExecutionState>>(
    {},
  );
  const [states, setStates] = useState<Record<string, AgentState>>(() =>
    Object.fromEntries(
      items.map((d) => [
        d.id,
        {
          risk: initialRisk(d.origin),
          contained: false,
          credsFrozen: false,
          routed: false,
        },
      ]),
    ),
  );

  const stateFor = (id: string): AgentState =>
    states[id] ?? {
      risk: "Medium",
      contained: false,
      credsFrozen: false,
      routed: false,
    };

  const applyAction = (
    id: string,
    patch: Partial<Omit<AgentState, "risk">>,
  ) => {
    setStates((prev) => {
      const cur = prev[id] ?? {
        risk: "Medium" as RiskLevel,
        contained: false,
        credsFrozen: false,
        routed: false,
      };
      const next = { ...cur, ...patch };
      const changed = Object.entries(patch).some(
        ([k, v]) => cur[k as keyof AgentState] !== v && v === true,
      );
      if (changed) next.risk = lowerRisk(cur.risk);
      return { ...prev, [id]: next };
    });
  };

  useEffect(() => {
    if (Object.keys(executing).length === 0) return;
    const timer = setInterval(() => {
      setExecuting((prev) => {
        const next: Record<string, ExecutionState> = {};
        const completed: { id: string; runbook: RunbookId }[] = [];
        for (const [id, ex] of Object.entries(prev)) {
          const nextIdx = ex.stepIndex + 1;
          if (nextIdx >= ex.totalSteps) {
            completed.push({ id, runbook: ex.runbook });
          } else {
            next[id] = { ...ex, stepIndex: nextIdx };
          }
        }
        if (completed.length > 0) {
          queueMicrotask(() => {
            for (const c of completed) {
              const patch = effectsFor(c.runbook);
              if (Object.keys(patch).length > 0) applyAction(c.id, patch);
            }
          });
        }
        return next;
      });
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [executing]);

  const startExecution = (id: string, rb: RunbookId) => {
    setExecuting((prev) => {
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          runbook: rb,
          stepIndex: 0,
          totalSteps: RUNBOOKS[rb].steps.length,
        },
      };
    });
  };

  return (
    <>
      <ul className="divide-y divide-line-subtle max-h-[420px] overflow-y-auto">
        {items.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => setSelected(d)}
              className="w-full px-5 py-3 flex items-start gap-3 text-left hover:bg-accent/5 focus:bg-accent/10 focus:outline-none transition-colors"
            >
              <div className="mt-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full block ${
                    d.origin === "Shadow AI"
                      ? "bg-danger animate-pulse"
                      : d.origin === "Business unit"
                        ? "bg-info"
                        : "bg-accent"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium truncate">
                    {d.name}
                  </span>
                  <Badge variant={originVariant(d.origin)}>{d.origin}</Badge>
                  <span
                    className={`inline-flex items-center border px-1.5 py-0 text-[9px] mono uppercase tracking-[0.16em] ${riskClass(stateFor(d.id).risk)}`}
                  >
                    {stateFor(d.id).risk}
                  </span>
                  {executing[d.id] && (
                    <span className="inline-flex items-center gap-1 border border-accent/40 bg-accent/10 px-1.5 py-0 text-[9px] mono uppercase tracking-[0.16em] text-accent">
                      <span className="h-2 w-2 rounded-full border border-accent border-t-transparent animate-spin" />
                      Runbook {executing[d.id].stepIndex + 1}/
                      {executing[d.id].totalSteps}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-fg-muted truncate mt-0.5">
                  {d.platform} · {d.source}
                </div>
              </div>
              <div className="text-[11px] text-fg-subtle whitespace-nowrap pt-0.5">
                {timeAgo(d.discoveredAt)}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  Discovered {timeAgo(selected.discoveredAt)} via{" "}
                  {selected.source}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 py-5 space-y-5 overflow-y-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={originVariant(selected.origin)}>
                    {selected.origin}
                  </Badge>
                  <span className="text-[11px] text-fg-muted mono uppercase tracking-wider">
                    {selected.platform}
                  </span>
                  <span
                    className={`inline-flex items-center border px-2 py-0.5 text-[10px] mono uppercase tracking-[0.18em] ${riskClass(stateFor(selected.id).risk)}`}
                  >
                    Risk · {stateFor(selected.id).risk}
                  </span>
                </div>

                {selected.origin === "Shadow AI" && (
                  <div className="border border-line-subtle bg-bg-elev/40 p-3 space-y-2">
                    <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
                      Containment actions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={stateFor(selected.id).contained}
                        onClick={() =>
                          applyAction(selected.id, { contained: true })
                        }
                        className="inline-flex items-center gap-1.5 border border-danger/40 bg-danger/10 px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-danger hover:bg-danger/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {stateFor(selected.id).contained
                          ? "✓ Quarantined"
                          : "Quarantine runtime"}
                      </button>
                      <button
                        type="button"
                        disabled={stateFor(selected.id).credsFrozen}
                        onClick={() =>
                          applyAction(selected.id, { credsFrozen: true })
                        }
                        className="inline-flex items-center gap-1.5 border border-warn/40 bg-warn/10 px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-warn hover:bg-warn/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {stateFor(selected.id).credsFrozen
                          ? "✓ Creds frozen"
                          : "Freeze credentials"}
                      </button>
                      <button
                        type="button"
                        disabled={stateFor(selected.id).routed}
                        onClick={() =>
                          applyAction(selected.id, { routed: true })
                        }
                        className="inline-flex items-center gap-1.5 border border-info/40 bg-info/10 px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-info hover:bg-info/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {stateFor(selected.id).routed
                          ? "✓ Routed"
                          : "Route to approval"}
                      </button>
                    </div>
                    <div className="text-[10px] text-fg-subtle">
                      Each action lowers risk by one tier in the demo.
                    </div>
                  </div>
                )}

                <dl className="grid grid-cols-1 gap-3 text-[12px]">
                  <div className="flex justify-between border-b border-line-subtle pb-2">
                    <dt className="text-fg-muted">Agent ID</dt>
                    <dd className="mono text-fg">{selected.id}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line-subtle pb-2">
                    <dt className="text-fg-muted">Platform</dt>
                    <dd className="text-fg">{selected.platform}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line-subtle pb-2">
                    <dt className="text-fg-muted">Origin</dt>
                    <dd className="text-fg">{selected.origin}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line-subtle pb-2">
                    <dt className="text-fg-muted">Discovery source</dt>
                    <dd className="text-fg text-right">{selected.source}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line-subtle pb-2">
                    <dt className="text-fg-muted">First seen</dt>
                    <dd className="text-fg">
                      {timeAgo(selected.discoveredAt)}
                    </dd>
                  </div>
                </dl>

                <div>
                  <h4 className="mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                    Recommended action
                  </h4>
                  <p className="text-[12px] text-fg-muted leading-relaxed">
                    {recommendedAction(selected.origin).map((part, i) =>
                      part.runbook ? (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRunbook(part.runbook!)}
                          className="text-accent underline decoration-dotted underline-offset-2 hover:text-accent/80 focus:outline-none"
                        >
                          {part.text}
                        </button>
                      ) : (
                        <span key={i}>{part.text}</span>
                      ),
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setRunbook(fullRunbookId(selected.origin))}
                      className="inline-flex items-center gap-1.5 border border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-accent hover:bg-accent/20 focus:outline-none"
                    >
                      Open full runbook
                    </button>
                    {selected.origin === "Shadow AI" && (
                      <button
                        type="button"
                        onClick={() => setRunbook("shadow-ai-approval-route")}
                        className="inline-flex items-center gap-1.5 border border-line-subtle px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-fg-muted hover:text-fg hover:border-accent/30 focus:outline-none"
                      >
                        Escalate to governance
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet
        open={runbook !== null}
        onOpenChange={(open) => !open && setRunbook(null)}
      >
        <SheetContent width="max-w-[600px]" className="border-l-accent/40">
          {runbook && (
            <>
              <SheetHeader>
                <SheetTitle>{RUNBOOKS[runbook].title}</SheetTitle>
                <SheetDescription>
                  {RUNBOOKS[runbook].summary}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 py-5 space-y-5 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center border px-2 py-0.5 text-[10px] mono uppercase tracking-[0.18em] ${severityClass(RUNBOOKS[runbook].severity)}`}
                  >
                    {RUNBOOKS[runbook].severity}
                  </span>
                  <span className="text-[11px] text-fg-muted mono uppercase tracking-wider">
                    {RUNBOOKS[runbook].owner}
                  </span>
                  <span className="text-[11px] text-fg-subtle mono uppercase tracking-wider">
                    SLA · {RUNBOOKS[runbook].sla}
                  </span>
                </div>

                {(() => {
                  const ex = selected ? executing[selected.id] : undefined;
                  const isExecuting =
                    !!ex && ex.runbook === runbook;
                  return (
                    <>
                      <ol className="space-y-3">
                        {RUNBOOKS[runbook].steps.map((s, i) => {
                          const status = !isExecuting
                            ? "idle"
                            : i < ex.stepIndex
                              ? "done"
                              : i === ex.stepIndex
                                ? "active"
                                : "pending";
                          return (
                            <li
                              key={i}
                              className={`border p-3 transition-colors ${
                                status === "active"
                                  ? "border-accent/50 bg-accent/5"
                                  : status === "done"
                                    ? "border-line-subtle bg-bg-elev/20 opacity-70"
                                    : "border-line-subtle bg-bg-elev/40"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="mono text-[11px] text-accent mt-0.5 w-4 flex-shrink-0">
                                  {status === "active" ? (
                                    <span className="inline-block h-2.5 w-2.5 rounded-full border border-accent border-t-transparent animate-spin" />
                                  ) : status === "done" ? (
                                    "✓"
                                  ) : (
                                    String(i + 1).padStart(2, "0")
                                  )}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[12px] font-medium text-fg">
                                    {s.label}
                                  </div>
                                  <div className="text-[11px] text-fg-muted mt-1 leading-relaxed">
                                    {s.detail}
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          disabled={isExecuting || !selected}
                          onClick={() => {
                            if (!selected) return;
                            startExecution(selected.id, runbook);
                          }}
                          className="inline-flex items-center gap-1.5 border border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-accent hover:bg-accent/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isExecuting ? (
                            <>
                              <span className="h-2.5 w-2.5 rounded-full border border-accent border-t-transparent animate-spin" />
                              Executing…
                            </>
                          ) : (
                            "Execute runbook"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRunbook(null)}
                          className="inline-flex items-center gap-1.5 border border-line-subtle px-3 py-1.5 text-[11px] mono uppercase tracking-[0.16em] text-fg-muted hover:text-fg focus:outline-none"
                        >
                          {isExecuting ? "Close" : "Back"}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
