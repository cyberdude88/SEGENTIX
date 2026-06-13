"use client";
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
import type { Agent, RiskClass } from "@/lib/types";

const riskTone: Record<RiskClass, "low" | "info" | "warn" | "high"> = {
  Read: "low",
  Write: "info",
  Modify: "info",
  Delete: "warn",
  Admin: "high",
};

export default function AgentDetailPanel({
  agent,
  onClose,
}: {
  agent: Agent | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!agent} onOpenChange={(o) => !o && onClose()}>
      {agent && (
        <SheetContent>
          <SheetHeader>
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
                  agent.risk === "High"
                    ? "high"
                    : agent.risk === "Medium"
                      ? "medium"
                      : "low"
                }
                dot
              >
                {agent.risk}
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
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
