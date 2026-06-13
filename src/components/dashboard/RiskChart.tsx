"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import type { Agent } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const colors = [
  "#ff5f73",
  "#f0b24a",
  "#f0b24a",
  "#6da8ff",
  "#4cc9ff",
  "#647189",
  "#647189",
];

type Datum = { category: string; count: number };

function matchAgents(category: string, agents: Agent[]): Agent[] {
  switch (category) {
    case "Excessive privileges":
      return agents.filter((a) =>
        a.tools.some((t) =>
          t.actions.some((act) => act.risk === "Admin" || act.risk === "Delete"),
        ),
      );
    case "Unknown owner":
      return agents.filter((a) => !a.owner);
    case "Shadow AI":
      return agents.filter((a) => a.origin === "Shadow");
    case "Production access":
      return agents.filter(
        (a) => a.flags.includes("Production access") || a.hasProdCreds,
      );
    case "Administrative":
      return agents.filter((a) => a.hasAdmin);
    case "Dormant":
      return agents.filter((a) => !a.active);
    case "Unapproved tools":
      return agents.filter((a) => a.origin === "Shadow" || a.hasAdmin).slice(0, 12);
    default:
      return [];
  }
}

function RiskTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const count = payload[0]?.value;
  return (
    <div className="border border-accent/25 bg-bg px-3 py-2 shadow-xl">
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        {label}
      </div>
      <div className="mt-1 text-sm text-fg">
        <span className="text-accent">{count}</span> AI agents · click to view
      </div>
    </div>
  );
}

export default function RiskChart({
  data,
  agents = [],
}: {
  data: Datum[];
  agents?: Agent[];
}) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const matching = useMemo(
    () => (selected ? matchAgents(selected, agents) : []),
    [selected, agents],
  );

  if (!mounted) {
    return <div className="h-64" />;
  }

  return (
    <div className="space-y-3">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            barCategoryGap={10}
          >
            <CartesianGrid horizontal={false} stroke="rgba(76,201,255,0.08)" />
            <XAxis
              type="number"
              stroke="#647189"
              tick={{ fill: "#647189", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="#8a95a8"
              tick={{ fill: "#8a95a8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={130}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 60 }}
              content={<RiskTooltip />}
            />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              barSize={14}
              cursor="pointer"
              onClick={(d: { category?: string }) =>
                d?.category && setSelected(d.category)
              }
            >
              {data.map((d, i) => (
                <Cell
                  key={d.category}
                  fill={
                    selected && selected !== d.category
                      ? "#2b3a52"
                      : colors[i % colors.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border border-[rgba(76,201,255,0.15)] bg-[rgba(10,15,28,0.5)] p-3">
        {selected ? (
          <>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <div>
                <div className="text-[13px] font-medium text-fg">{selected}</div>
                <div className="text-[11px] text-fg-muted">
                  {matching.length} agent{matching.length === 1 ? "" : "s"} in
                  this category
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-[11px] text-fg-muted hover:text-fg"
              >
                Clear
              </button>
            </div>
            <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {matching.map((a) => (
                <Link
                  key={a.id}
                  href={`/agents?focus=${a.id}`}
                  className="block border border-[rgba(76,201,255,0.1)] bg-[rgba(255,255,255,0.02)] p-2 hover:border-[rgba(76,201,255,0.35)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[12px] text-fg">{a.name}</div>
                    <div
                      className={`text-[10px] uppercase tracking-wide ${
                        a.risk === "High"
                          ? "text-[#fb7185]"
                          : a.risk === "Medium"
                            ? "text-[#facc15]"
                            : "text-fg-muted"
                      }`}
                    >
                      {a.risk}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[10px] text-fg-muted">
                    {a.platform} · {a.environment} · {a.businessUnit} ·{" "}
                    {a.owner ?? "no owner"} · {timeAgo(a.lastActiveAt)}
                  </div>
                </Link>
              ))}
              {matching.length === 0 && (
                <div className="text-[11px] text-fg-muted">
                  No agents match this category.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-[11px] text-fg-muted">
            Click a bar to see the agents in that category.
          </div>
        )}
      </div>
    </div>
  );
}
