"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo } from "@/lib/utils";
import type { UnapprovedCaller, CallerEnforcement } from "@/lib/types";

const enforcementVariant: Record<
  CallerEnforcement,
  "high" | "warn" | "neutral"
> = {
  Blocked: "high",
  Warned: "warn",
  Observed: "neutral",
};

const filters = ["All", "Blocked", "Warned", "Observed"] as const;
type Filter = (typeof filters)[number];

export default function UnapprovedCallers({
  callers,
}: {
  callers: UnapprovedCaller[];
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState<string>(callers[0]?.id ?? "");

  const visible = useMemo(
    () =>
      filter === "All"
        ? callers
        : callers.filter((c) => c.enforcement === filter),
    [callers, filter],
  );

  const totals = useMemo(() => {
    const t = { Blocked: 0, Warned: 0, Observed: 0, calls: 0 };
    for (const c of callers) {
      t[c.enforcement] += 1;
      t.calls += c.callCount24h;
    }
    return t;
  }, [callers]);

  const selected =
    visible.find((c) => c.id === selectedId) ?? visible[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="border-b border-accent/15 lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-accent/15">
          <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-muted">
            {totals.calls.toLocaleString()} calls / 24h
          </div>
          <div className="ml-auto flex items-center gap-1">
            {filters.map((f) => {
              const count =
                f === "All"
                  ? callers.length
                  : (totals[f as keyof typeof totals] as number);
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "mono border px-2 py-1 text-[10px] uppercase tracking-[0.18em] transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-accent/25 text-fg-muted hover:border-accent/60 hover:text-fg",
                  )}
                >
                  {f} · {count}
                </button>
              );
            })}
          </div>
        </div>
        <ul className="divide-y divide-line-subtle max-h-[460px] overflow-y-auto">
          {visible.map((c) => {
            const isActive = selected?.id === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full text-left px-5 py-3 flex items-start gap-3 transition-colors border-l-2",
                    isActive
                      ? "border-accent bg-accent/5"
                      : "border-transparent hover:bg-accent/5",
                  )}
                >
                  <Badge variant={enforcementVariant[c.enforcement]} dot>
                    {c.enforcement}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium truncate">
                        {c.identity}
                      </span>
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                        {c.identityType}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-fg-muted truncate mt-0.5">
                      {c.surface} · {c.endpoint}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] font-semibold tabular-nums">
                      {c.callCount24h.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-fg-subtle">
                      {timeAgo(c.lastSeen)}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-5 py-8 text-center text-[12px] text-fg-subtle">
              No callers match this filter.
            </li>
          )}
        </ul>
      </div>

      {selected && (
        <div className="p-5 space-y-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.24em] text-fg-muted">
              Caller
            </div>
            <div className="mt-1 text-[14px] font-semibold">
              {selected.identity}
            </div>
            <div className="text-[11px] text-fg-subtle">
              {selected.identityType} · from {selected.sourceEnv}
            </div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.24em] text-fg-muted">
              Why flagged
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-fg">
              {selected.reason}
            </p>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.24em] text-fg-muted">
              Enforcement
            </div>
            <div className="mt-1">
              <Badge variant={enforcementVariant[selected.enforcement]} dot>
                {selected.enforcement} at gateway
              </Badge>
            </div>
          </div>
          {selected.suggestedAgent && (
            <div className="border border-accent/25 bg-accent/5 px-3 py-2">
              <div className="mono text-[10px] uppercase tracking-[0.24em] text-accent">
                Suggested action
              </div>
              <div className="mt-1 text-[12px]">{selected.suggestedAgent}</div>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="mono flex-1 border border-accent/45 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/10"
            >
              Register caller
            </button>
            <button
              type="button"
              className="mono flex-1 border border-danger/45 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-danger transition-colors hover:bg-danger/10"
            >
              Block at gateway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
