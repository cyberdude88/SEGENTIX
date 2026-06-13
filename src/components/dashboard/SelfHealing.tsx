import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Wand2, FlaskConical, UserCheck, Rocket } from "lucide-react";

type Stage =
  | "Contained"
  | "Patch proposed"
  | "Sandbox validating"
  | "Awaiting approval"
  | "Deployed";

type SandboxRun = {
  progress: number;
  evalsPassed: number;
  evalsTotal: number;
  regressions: number;
  attackReplay: "pending" | "blocked" | "leaked";
  eta: string;
};

type Incident = {
  id: string;
  attack: string;
  vector: string;
  agent: string;
  contained: string;
  patch: string;
  approver: string;
  stage: Stage;
  age: string;
  sandbox?: SandboxRun;
};

const variant: Record<Stage, "warn" | "low" | "high" | "neutral"> = {
  Contained: "high",
  "Patch proposed": "warn",
  "Sandbox validating": "neutral",
  "Awaiting approval": "warn",
  Deployed: "low",
};

const stageIcon: Record<Stage, typeof ShieldCheck> = {
  Contained: ShieldCheck,
  "Patch proposed": Wand2,
  "Sandbox validating": FlaskConical,
  "Awaiting approval": UserCheck,
  Deployed: Rocket,
};

export const SELF_HEALING_INCIDENTS: Incident[] = [
  {
    id: "sh-001",
    attack: "Indirect prompt injection",
    vector: "Notion page → support-bot tool call",
    agent: "support-bot-prod",
    contained: "Tool calls to `email.send` blocked for session",
    patch: "Add allow-list filter on inbound doc sources; tighten system prompt",
    approver: "security@acme.io",
    stage: "Awaiting approval",
    age: "3m ago",
  },
  {
    id: "sh-002",
    attack: "Credential exfiltration attempt",
    vector: "Agent attempted `s3:GetObject` on prod-secrets/*",
    agent: "data-broker-7",
    contained: "IAM scope rolled back to read:reports only",
    patch: "Policy: deny `s3:*` outside `data-lake/clean/*` for this agent class",
    approver: "platform-oncall",
    stage: "Sandbox validating",
    age: "11m ago",
    sandbox: {
      progress: 68,
      evalsPassed: 142,
      evalsTotal: 210,
      regressions: 0,
      attackReplay: "blocked",
      eta: "~90s",
    },
  },
  {
    id: "sh-003",
    attack: "Tool chaining → unauthorized payment",
    vector: "search → memo → invoice.create (no human in loop)",
    agent: "finance-copilot",
    contained: "invoice.create requires approval ≥ $0",
    patch: "Wire HITL gate for any `*.create` on financial tools",
    approver: "cfo-office",
    stage: "Deployed",
    age: "1h ago",
  },
  {
    id: "sh-004",
    attack: "Jailbreak (DAN-variant)",
    vector: "Multi-turn role-play bypass on customer chat",
    agent: "cx-agent-v3",
    contained: "Session terminated; transcript quarantined",
    patch: "Refusal-classifier threshold 0.62 → 0.55; add 4 new eval cases",
    approver: "alex.ansbergs",
    stage: "Contained",
    age: "just now",
  },
];

export default function SelfHealing({ incidents }: { incidents: Incident[] }) {
  return (
    <ul className="divide-y divide-line-subtle">
      {incidents.map((i) => {
        const Icon = stageIcon[i.stage];
        return (
          <li key={i.id} className="px-5 py-4">
            <div className="flex items-start gap-3">
              <Badge variant={variant[i.stage]} dot>
                <Icon size={11} className="mr-1 inline -translate-y-px" />
                {i.stage}
              </Badge>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="truncate text-[13px] text-fg">
                    {i.attack}
                    <span className="text-fg-subtle"> · </span>
                    <span className="mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                      {i.agent}
                    </span>
                  </div>
                  <span className="mono shrink-0 text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                    {i.age}
                  </span>
                </div>
                <div className="mt-1 text-[12px] text-fg-muted">{i.vector}</div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="border border-accent/15 bg-bg/40 px-3 py-2">
                    <div className="mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Auto-contained
                    </div>
                    <div className="mt-1 text-[12px] text-fg-muted">
                      {i.contained}
                    </div>
                  </div>
                  <div className="border border-accent/15 bg-bg/40 px-3 py-2">
                    <div className="mono text-[10px] uppercase tracking-[0.18em] text-warn">
                      Proposed patch
                    </div>
                    <div className="mt-1 text-[12px] text-fg-muted">
                      {i.patch}
                    </div>
                  </div>
                </div>

                {i.sandbox && (
                  <div className="mt-2 border border-info/30 bg-info/5 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="mono text-[10px] uppercase tracking-[0.18em] text-info">
                        Sandbox replay · patch validation
                      </div>
                      <span className="mono text-[10px] text-fg-subtle">
                        ETA {i.sandbox.eta}
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-bg/60">
                      <div
                        className="h-full bg-info/70 transition-all"
                        style={{ width: `${i.sandbox.progress}%` }}
                      />
                    </div>
                    <div className="mono mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                      <span>
                        evals ·{" "}
                        <span className="text-fg-muted">
                          {i.sandbox.evalsPassed}/{i.sandbox.evalsTotal}
                        </span>
                      </span>
                      <span>
                        regressions ·{" "}
                        <span
                          className={
                            i.sandbox.regressions === 0
                              ? "text-accent"
                              : "text-danger"
                          }
                        >
                          {i.sandbox.regressions}
                        </span>
                      </span>
                      <span>
                        attack replay ·{" "}
                        <span
                          className={
                            i.sandbox.attackReplay === "blocked"
                              ? "text-accent"
                              : i.sandbox.attackReplay === "leaked"
                                ? "text-danger"
                                : "text-warn"
                          }
                        >
                          {i.sandbox.attackReplay}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                <div className="mono mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                  <span>
                    approver ·{" "}
                    <span className="text-fg-muted">{i.approver}</span>
                  </span>
                  <span>human-in-the-loop required</span>
                </div>

                {i.stage === "Awaiting approval" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="mono border border-accent/45 bg-accent/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
                    >
                      Approve & deploy
                    </button>
                    <button
                      type="button"
                      className="mono border border-line-subtle px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-fg-muted transition-colors hover:border-accent/40 hover:text-fg"
                    >
                      Review diff
                    </button>
                    <button
                      type="button"
                      className="mono border border-line-subtle px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-fg-muted transition-colors hover:border-danger/60 hover:text-danger"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
