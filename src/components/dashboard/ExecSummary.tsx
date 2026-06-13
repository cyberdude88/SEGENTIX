"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ExecKpi } from "@/lib/types";
import { cn } from "@/lib/utils";

type ChartKind = "donut" | "segments" | "spark";

function chartFor(k: ExecKpi): ChartKind {
  if (k.unit === "%" || k.unit === "/100") return "donut";
  if (k.value.includes("/")) return "segments";
  return "spark";
}

function seededSeries(seed: string, n: number, base: number, jitter: number) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const r = ((s >>> 0) % 1000) / 1000;
    out.push(base + (r - 0.5) * 2 * jitter);
  }
  return out;
}

function Donut({ pct, tone }: { pct: number; tone: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(1, pct / 100));
  return (
    <svg viewBox="0 0 60 60" className="h-16 w-16">
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-line-subtle"
        strokeWidth="6"
      />
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke="currentColor"
        className={tone}
        strokeWidth="6"
        strokeDasharray={`${c * filled} ${c}`}
        strokeDashoffset={c * 0.25}
        transform="rotate(-90 30 30)"
        strokeLinecap="round"
      />
      <text
        x="30"
        y="34"
        textAnchor="middle"
        className={cn("tabular-nums", tone)}
        fontSize="14"
        fontWeight="600"
        fill="currentColor"
      >
        {Math.round(pct)}
      </text>
    </svg>
  );
}

function Segments({
  done,
  total,
  tone,
}: {
  done: number;
  total: number;
  tone: string;
}) {
  return (
    <div className="flex h-16 w-full flex-col justify-center gap-1.5">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 flex-1 border",
              i < done
                ? cn("border-transparent", toneBg(tone))
                : "border-line-subtle bg-surface-2/40",
            )}
          />
        ))}
      </div>
      <div className="mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
        {done} of {total} controls
      </div>
    </div>
  );
}

function toneBg(tone: string) {
  if (tone.includes("danger")) return "bg-danger";
  if (tone.includes("warn")) return "bg-warn";
  if (tone.includes("info")) return "bg-info";
  return "bg-accent";
}

function Spark({
  series,
  tone,
}: {
  series: number[];
  tone: string;
}) {
  const w = 100;
  const h = 32;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-10 w-full"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        className={tone}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function KpiChart({ k, tone }: { k: ExecKpi; tone: string }) {
  const kind = chartFor(k);
  if (kind === "donut") {
    const numeric = parseFloat(k.value);
    const pct = k.unit === "/100" ? numeric : numeric;
    return (
      <div className="flex items-center justify-center pt-2">
        <Donut pct={pct} tone={tone} />
      </div>
    );
  }
  if (kind === "segments") {
    const [a, b] = k.value.split("/").map((n) => parseInt(n, 10));
    return (
      <div className="pt-2">
        <Segments done={a} total={b} tone={tone} />
      </div>
    );
  }
  const base = parseFloat(k.value) || 10;
  const series = seededSeries(k.label, 14, base, Math.max(1, base * 0.25));
  series[series.length - 1] = base;
  return (
    <div className="pt-2">
      <Spark series={series} tone={tone} />
      <div className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
        14d trend
      </div>
    </div>
  );
}

function toneFor(k: ExecKpi, positive: boolean): string {
  if (k.label.toLowerCase().includes("risk")) return "text-danger";
  if (k.label.toLowerCase().includes("shadow")) return "text-warn";
  return positive ? "text-accent" : "text-danger";
}

function KpiCard({ k }: { k: ExecKpi }) {
  const [open, setOpen] = useState(true);
  const up = k.delta > 0;
  const positive = (up && k.good === "up") || (!up && k.good === "down");
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const Toggle = open ? ChevronUp : ChevronDown;
  const tone = toneFor(k, positive);

  return (
    <div className="flex flex-col border border-line-subtle bg-surface-2/40 px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          {k.label}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? `Collapse ${k.label}` : `Expand ${k.label}`}
          aria-expanded={open}
          className="-mr-1 -mt-1 inline-flex h-5 w-5 items-center justify-center text-fg-subtle transition-colors hover:text-fg"
        >
          <Toggle size={13} />
        </button>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-fg">
          {k.value}
        </span>
        {k.unit ? (
          <span className="text-[12px] text-fg-subtle">{k.unit}</span>
        ) : null}
      </div>
      <div
        className={cn(
          "mono mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.16em]",
          positive ? "text-accent" : "text-danger",
        )}
      >
        <Arrow size={11} />
        {Math.abs(k.delta)}
        {k.unit === "%" ? "pp" : ""} · 30d
      </div>
      {open ? <KpiChart k={k} tone={tone} /> : null}
    </div>
  );
}

export default function ExecSummary({ kpis }: { kpis: ExecKpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 px-5 py-4 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((k) => (
        <KpiCard key={k.label} k={k} />
      ))}
    </div>
  );
}
