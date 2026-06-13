"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Agent, RiskClass } from "@/lib/types";

type ToolDatum = { name: string; count: number };

const RISK_COLOR: Record<RiskClass, string> = {
  Read: "#7fb3c7",
  Write: "#4cc9ff",
  Modify: "#c084fc",
  Execute: "#facc15",
  Delete: "#fb7185",
  Admin: "#f87171",
};

export default function TopToolsChart({
  data,
  agents,
}: {
  data: ToolDatum[];
  agents: Agent[];
}) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string | null>(
    data[0]?.name ?? null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const matchingAgents = useMemo(() => {
    if (!selected) return [];
    return agents
      .filter((a) => a.tools.some((t) => t.name === selected))
      .map((a) => ({
        agent: a,
        tool: a.tools.find((t) => t.name === selected)!,
      }));
  }, [agents, selected]);

  if (!mounted) {
    return <div className="h-64" />;
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="lg:w-1/2">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {data.map((d) => {
            const active = d.name === selected;
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => setSelected(d.name)}
                className={`border px-2 py-0.5 text-[11px] transition-colors ${
                  active
                    ? "border-[#4cc9ff] bg-[rgba(76,201,255,0.12)] text-fg"
                    : "border-[rgba(76,201,255,0.18)] text-fg-muted hover:text-fg"
                }`}
              >
                {d.name}
                <span className="ml-1 text-fg-muted">{d.count}</span>
              </button>
            );
          })}
        </div>
        <div className="h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={1}
            minHeight={1}
          >
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
            >
              <CartesianGrid vertical={false} stroke="rgba(76,201,255,0.08)" />
              <XAxis
                dataKey="name"
                stroke="#647189"
                tick={{ fill: "#8a95a8", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-22}
                textAnchor="end"
                height={50}
              />
              <YAxis
                stroke="#647189"
                tick={{ fill: "#647189", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#0a0f1c",
                  border: "1px solid rgba(76,201,255,0.2)",
                  borderRadius: 0,
                  fontSize: 12,
                  color: "#e6edf6",
                }}
              />
              <Bar
                dataKey="count"
                radius={[0, 0, 0, 0]}
                onClick={(d: { name?: string }) =>
                  d?.name && setSelected(d.name)
                }
                cursor="pointer"
              >
                {data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={d.name === selected ? "#4cc9ff" : "#2b6886"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-[rgba(76,201,255,0.15)] bg-[rgba(10,15,28,0.5)] p-3 lg:w-1/2">
        {selected ? (
          <>
            <div className="mb-2 flex items-baseline justify-between">
              <div>
                <div className="text-[13px] font-medium text-fg">
                  {selected}
                </div>
                <div className="text-[11px] text-fg-muted">
                  {matchingAgents.length} agent
                  {matchingAgents.length === 1 ? "" : "s"} using this tool
                </div>
              </div>
            </div>
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {matchingAgents.map(({ agent, tool }) => (
                <div
                  key={agent.id}
                  className="border border-[rgba(76,201,255,0.1)] bg-[rgba(255,255,255,0.02)] p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[12px] text-fg">
                      {agent.name}
                    </div>
                    <div
                      className={`text-[10px] uppercase tracking-wide ${
                        agent.risk === "High"
                          ? "text-[#fb7185]"
                          : agent.risk === "Medium"
                            ? "text-[#facc15]"
                            : "text-fg-muted"
                      }`}
                    >
                      {agent.risk}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[10px] text-fg-muted">
                    {agent.platform} · {agent.environment} ·{" "}
                    {tool.authMethod}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tool.actions.map((a) => (
                      <span
                        key={a.name}
                        className="border px-1.5 py-0.5 text-[10px]"
                        style={{
                          borderColor: `${RISK_COLOR[a.risk]}55`,
                          color: RISK_COLOR[a.risk],
                        }}
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {matchingAgents.length === 0 && (
                <div className="text-[11px] text-fg-muted">
                  No agents use this tool.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-[11px] text-fg-muted">
            Click a bar or chip to see which agents use that tool.
          </div>
        )}
      </div>
    </div>
  );
}
