"use client";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PolicyTemplate, AccessScope } from "@/lib/types";

const variant: Record<
  PolicyTemplate["then"],
  "high" | "warn" | "info"
> = {
  Deny: "high",
  Warn: "warn",
  "Require approval": "info",
};

const SCOPES: AccessScope[] = [
  "Email",
  "Source code",
  "Cloud infra",
  "Identity",
  "CRM data",
  "ITSM",
  "Chat",
  "Payroll / HR",
];

const ACTIONS: PolicyTemplate["then"][] = ["Deny", "Warn", "Require approval"];

const WHEN_OPTIONS = [
  "agent reads from data store",
  "agent writes to data store",
  "agent invokes external API",
  "agent executes shell command",
  "agent spawns sub-agent",
  "agent shares data externally",
  "agent escalates privileges",
  "agent modifies IAM policy",
  "agent deploys infrastructure",
  "agent accesses secrets vault",
  "agent sends email or message",
  "agent opens or merges PR",
];

const AND_OPTIONS = [
  "record contains PII",
  "record contains PHI",
  "record contains payment data (PCI)",
  "record contains source secrets / tokens",
  "destination is outside org",
  "destination is unapproved vendor",
  "actor is non-human identity",
  "actor is unauthenticated",
  "request is outside business hours",
  "volume exceeds baseline 3x",
  "data classification is restricted",
  "no human approver on session",
];

const NETWORK_SEGMENTS = [
  "Any",
  "Production",
  "Staging",
  "Development",
  "DMZ / public edge",
  "Internal corporate",
  "Restricted enclave",
  "Partner VPN",
  "Public internet",
];

const fieldClass =
  "w-full border border-line-subtle bg-surface-2/40 px-2.5 py-1.5 text-[12px] text-fg outline-none focus:border-accent/60 focus:bg-surface-2/70 [color-scheme:light_dark] [&>option]:bg-bg [&>option]:text-fg";
const labelClass =
  "mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle";

export default function PolicyBuilder({
  templates,
}: {
  templates: PolicyTemplate[];
}) {
  const [rules, setRules] = useState<PolicyTemplate[]>(templates);
  const [open, setOpen] = useState(false);
  const [detailRule, setDetailRule] = useState<PolicyTemplate | null>(null);
  const [when, setWhen] = useState(WHEN_OPTIONS[0]);
  const [and, setAnd] = useState("__none__");
  const [then, setThen] = useState<PolicyTemplate["then"]>("Warn");
  const [category, setCategory] = useState<AccessScope>("Email");
  const [segment, setSegment] = useState<string>(NETWORK_SEGMENTS[0]);

  function reset() {
    setWhen(WHEN_OPTIONS[0]);
    setAnd("__none__");
    setThen("Warn");
    setCategory("Email");
    setSegment(NETWORK_SEGMENTS[0]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const andClause =
      and === "__none__"
        ? segment !== "Any"
          ? `network segment is ${segment}`
          : null
        : segment !== "Any"
          ? `${and} on ${segment}`
          : and;
    setRules((prev) => [
      ...prev,
      {
        id: `rule-${Date.now().toString(36)}`,
        when,
        and: andClause,
        then,
        category,
        enabled: true,
      },
    ]);
    reset();
    setOpen(false);
  }

  return (
    <div className="px-5 py-4">
      <div className="mb-3 text-[12px] text-fg-muted">
        No-code rules. Security, compliance, or BU leads compose policies in
        plain language — no YAML, no code review.
      </div>
      <ul className="space-y-2">
        {rules.map((p) => (
          <li
            key={p.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-line-subtle bg-surface-2/40 px-3 py-2 transition-colors hover:border-accent/40 hover:bg-surface-2/70"
          >
            <input
              type="checkbox"
              defaultChecked={p.enabled}
              aria-label={`Enable ${p.id}`}
              className="h-3.5 w-3.5 accent-accent"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setDetailRule(p)}
              className="text-left text-[12px] leading-snug focus:outline-none"
            >
              <span className={labelClass}>if</span>{" "}
              <span className="text-fg underline decoration-accent/0 hover:decoration-accent/60">
                {p.when}
              </span>
              {p.and ? (
                <>
                  {" "}
                  <span className={labelClass}>and</span>{" "}
                  <span className="text-fg-muted">{p.and}</span>
                </>
              ) : null}{" "}
              <span className={labelClass}>then</span>
            </button>
            <Badge variant={variant[p.then]} dot>
              {p.then}
            </Badge>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger asChild>
          <button
            type="button"
            className="mono mt-3 border border-accent/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
          >
            + new rule
          </button>
        </DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 border border-accent/25 bg-bg text-fg shadow-2xl grid-bg">
            <div className="border-b border-accent/15 px-5 py-3">
              <DialogPrimitive.Title className="mono text-sm font-medium uppercase tracking-[0.18em] text-accent">
                New policy rule
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1 text-[11px] text-fg-muted">
                Plain-language conditions. No YAML.
              </DialogPrimitive.Description>
            </div>
            <form onSubmit={submit} className="space-y-3 px-5 py-4">
              <div>
                <label className={labelClass} htmlFor="rule-when">
                  if
                </label>
                <select
                  id="rule-when"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className={`${fieldClass} mt-1`}
                  autoFocus
                >
                  {WHEN_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="rule-and">
                  and (optional)
                </label>
                <select
                  id="rule-and"
                  value={and}
                  onChange={(e) => setAnd(e.target.value)}
                  className={`${fieldClass} mt-1`}
                >
                  <option value="__none__">— none —</option>
                  {AND_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="rule-then">
                    then
                  </label>
                  <select
                    id="rule-then"
                    value={then}
                    onChange={(e) =>
                      setThen(e.target.value as PolicyTemplate["then"])
                    }
                    className={`${fieldClass} mt-1`}
                  >
                    {ACTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="rule-scope">
                    scope
                  </label>
                  <select
                    id="rule-scope"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AccessScope)}
                    className={`${fieldClass} mt-1`}
                  >
                    {SCOPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="rule-segment">
                  network segment
                </label>
                <select
                  id="rule-segment"
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className={`${fieldClass} mt-1`}
                >
                  {NETWORK_SEGMENTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    className="mono border border-line-subtle px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-fg-muted transition-colors hover:text-fg"
                  >
                    cancel
                  </button>
                </DialogPrimitive.Close>
                <button
                  type="submit"
                  className="mono border border-accent/40 bg-accent/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-accent transition-colors hover:border-accent hover:bg-accent/20"
                >
                  create rule
                </button>
              </div>
            </form>
            <DialogPrimitive.Close className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center border border-accent/25 bg-bg/50 text-fg-muted hover:bg-accent/10 hover:text-accent">
              <X size={14} />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DialogPrimitive.Root
        open={detailRule !== null}
        onOpenChange={(o) => !o && setDetailRule(null)}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm animate-fade-in" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[min(96vw,980px)] -translate-x-1/2 -translate-y-1/2 flex-col border border-accent/25 bg-bg text-fg shadow-2xl grid-bg">
            {detailRule ? (
              <RuleDetail
                rule={detailRule}
                onBack={() => setDetailRule(null)}
              />
            ) : null}
            <DialogPrimitive.Close className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center border border-accent/25 bg-bg/50 text-fg-muted hover:bg-accent/10 hover:text-accent">
              <X size={14} />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

// ---------- Rule detail view ---------------------------------------------

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ruleMetrics(rule: PolicyTemplate) {
  const seed = hash(rule.id);
  const blocked24h = (seed % 47) + 3;
  const warned24h = ((seed >> 3) % 120) + 12;
  const allowed24h = ((seed >> 5) % 4000) + 200;
  const totalEval = blocked24h + warned24h + allowed24h;
  const openTickets = ((seed >> 7) % 9) + 1;
  const mttrMin = ((seed >> 9) % 40) + 8;
  return { blocked24h, warned24h, allowed24h, totalEval, openTickets, mttrMin };
}

const LOG_ACTORS = [
  "agent://acme-sdr-bot",
  "agent://copilot-eng-42",
  "agent://shadow-llm-9f",
  "agent://finance-recon",
  "agent://ops-runbook-7",
  "agent://hr-screener-2",
];
const LOG_DECISIONS: Array<"DENY" | "WARN" | "ALLOW" | "APPROVAL"> = [
  "DENY",
  "WARN",
  "ALLOW",
  "APPROVAL",
];
const TICKET_STATES = ["OPEN", "TRIAGE", "IN PROGRESS", "WAITING", "RESOLVED"];
const TICKET_OWNERS = [
  "secops-oncall",
  "platform-sre",
  "iam-team",
  "appsec",
  "data-gov",
];

function ruleLogs(rule: PolicyTemplate) {
  const seed = hash(rule.id);
  return Array.from({ length: 8 }).map((_, i) => {
    const s = seed + i * 1103;
    const mins = (s % 240) + i * 7;
    const decision = LOG_DECISIONS[(s >> 2) % LOG_DECISIONS.length];
    return {
      id: `log-${rule.id}-${i}`,
      ts: `T-${mins}m`,
      actor: LOG_ACTORS[(s >> 4) % LOG_ACTORS.length],
      decision,
      target: `${rule.category.toLowerCase().replace(/\s+/g, "-")}/${(s >> 6) % 9999}`,
    };
  });
}

function ruleTickets(rule: PolicyTemplate) {
  const seed = hash(rule.id);
  const m = ruleMetrics(rule);
  return Array.from({ length: m.openTickets }).map((_, i) => {
    const s = seed + i * 7919;
    return {
      id: `INC-${10000 + ((s >> 1) % 8999)}`,
      title: `${rule.then} on ${rule.when.toLowerCase()}`,
      state: TICKET_STATES[(s >> 3) % TICKET_STATES.length],
      owner: TICKET_OWNERS[(s >> 5) % TICKET_OWNERS.length],
      age: `${((s >> 7) % 48) + 1}h`,
    };
  });
}

const decisionBadge: Record<
  "DENY" | "WARN" | "ALLOW" | "APPROVAL",
  "high" | "warn" | "info" | "low"
> = { DENY: "high", WARN: "warn", APPROVAL: "info", ALLOW: "low" };

function RuleDetail({
  rule,
  onBack,
}: {
  rule: PolicyTemplate;
  onBack: () => void;
}) {
  const m = ruleMetrics(rule);
  const logs = ruleLogs(rule);
  const tickets = ruleTickets(rule);
  const blockRate = ((m.blocked24h / m.totalEval) * 100).toFixed(2);

  return (
    <>
      <div className="border-b border-accent/15 px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="mono border border-line-subtle px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-fg-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            ← back
          </button>
          <DialogPrimitive.Title className="mono text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Rule stack · {rule.category}
          </DialogPrimitive.Title>
          <Badge variant={variant[rule.then]} dot>
            {rule.then}
          </Badge>
        </div>
        <DialogPrimitive.Description className="mt-2 text-[12px] text-fg-muted">
          <span className={labelClass}>if</span>{" "}
          <span className="text-fg">{rule.when}</span>
          {rule.and ? (
            <>
              {" "}
              <span className={labelClass}>and</span> {rule.and}
            </>
          ) : null}
        </DialogPrimitive.Description>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-px border-b border-accent/15 bg-line-subtle md:grid-cols-5">
          {[
            { l: "blocked / 24h", v: m.blocked24h },
            { l: "warned / 24h", v: m.warned24h },
            { l: "allowed / 24h", v: m.allowed24h.toLocaleString() },
            { l: "block rate", v: `${blockRate}%` },
            { l: "open tickets", v: m.openTickets },
          ].map((s) => (
            <div key={s.l} className="bg-bg px-4 py-3">
              <div className={labelClass}>{s.l}</div>
              <div className="mt-1 font-mono text-lg text-fg">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-px bg-line-subtle md:grid-cols-2">
          <section className="bg-bg px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className={labelClass}>SIEM logs</h3>
              <span className="mono text-[10px] text-fg-subtle">
                last {logs.length} events
              </span>
            </div>
            <ul className="space-y-1">
              {logs.map((l) => (
                <li
                  key={l.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border border-line-subtle bg-surface-2/30 px-2.5 py-1.5 font-mono text-[11px]"
                >
                  <span className="text-fg-subtle">{l.ts}</span>
                  <span className="truncate text-fg-muted">
                    <span className="text-fg">{l.actor}</span> → {l.target}
                  </span>
                  <Badge variant={decisionBadge[l.decision]} dot>
                    {l.decision}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-bg px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className={labelClass}>Tickets</h3>
              <span className="mono text-[10px] text-fg-subtle">
                MTTR {m.mttrMin}m
              </span>
            </div>
            <ul className="space-y-1">
              {tickets.map((t) => (
                <li
                  key={t.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border border-line-subtle bg-surface-2/30 px-2.5 py-1.5 text-[11px]"
                >
                  <span className="mono text-fg-subtle">{t.id}</span>
                  <span className="truncate text-fg-muted">
                    <span className="text-fg">{t.title}</span> · {t.owner}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    {t.state} · {t.age}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
