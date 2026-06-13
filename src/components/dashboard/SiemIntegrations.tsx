"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo } from "@/lib/utils";
import type { SiemConnector } from "@/lib/types";

const variant: Record<SiemConnector["status"], "low" | "warn" | "neutral"> = {
  Connected: "low",
  Degraded: "warn",
  "Not configured": "neutral",
};

export default function SiemIntegrations({
  connectors,
}: {
  connectors: SiemConnector[];
}) {
  const [selected, setSelected] = useState<string | null>(connectors[0]?.name ?? null);
  const active = connectors.find((c) => c.name === selected) ?? null;

  return (
    <div className="px-5 py-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {connectors.map((c) => {
          const isActive = c.name === selected;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelected(isActive ? null : c.name)}
              aria-pressed={isActive}
              className={cn(
                "border bg-surface-2/40 px-3 py-2.5 text-left transition-colors",
                "hover:bg-surface-2/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
                isActive
                  ? "border-accent/70 bg-surface-2/80"
                  : "border-line-subtle",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-[13px] text-fg">{c.name}</div>
                <Badge variant={variant[c.status]} dot>
                  {c.status}
                </Badge>
              </div>
              <div className="mono mt-1 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                {c.category}
              </div>
              <div className="mt-2 flex items-baseline justify-between text-[11px]">
                <span className="text-fg-subtle">
                  {c.lastEvent ? timeAgo(c.lastEvent) : "never"}
                </span>
                <span className="mono tabular-nums text-fg-muted">
                  {c.eventsPer24h.toLocaleString()} / 24h
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {active && <ConnectorKpis connector={active} />}
    </div>
  );
}

function ConnectorKpis({ connector: c }: { connector: SiemConnector }) {
  const max = Math.max(1, ...c.sparkline);
  return (
    <div className="mt-4 border border-line-subtle bg-surface-2/30 px-4 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[13px] text-fg">{c.name} · KPIs</div>
        <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          24h window
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Events / 24h" value={c.eventsPer24h.toLocaleString()} />
        <Kpi label="Active detections" value={c.detectionsActive.toString()} />
        <Kpi label="Open alerts" value={c.alertsOpen.toString()} />
        <Kpi
          label="Ingest"
          value={c.ingestGb24h > 0 ? `${c.ingestGb24h.toFixed(1)} GB` : "—"}
        />
        <Kpi
          label="P95 latency"
          value={c.latencyMs > 0 ? `${c.latencyMs} ms` : "—"}
        />
        <Kpi label="Last event" value={c.lastEvent ? timeAgo(c.lastEvent) : "never"} />
        <Kpi label="Status" value={c.status} />
        <Kpi label="Category" value={c.category} />
      </div>
      <div className="mt-3">
        <div className="mono mb-1 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          Events / hour
        </div>
        <div className="flex h-10 items-end gap-[2px]">
          {c.sparkline.map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-accent/60"
              style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? 2 : 0 }}
            />
          ))}
        </div>
      </div>
      {c.notes && (
        <div className="mt-3 text-[11px] text-fg-muted">{c.notes}</div>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        {label}
      </div>
      <div className="mono mt-0.5 tabular-nums text-[14px] text-fg">{value}</div>
    </div>
  );
}
