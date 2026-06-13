"use client";
import { useEffect, useState } from "react";
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

const colors = [
  "#ff5f73",
  "#f0b24a",
  "#f0b24a",
  "#6da8ff",
  "#4cc9ff",
  "#647189",
  "#647189",
];

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
        <span className="text-accent">{count}</span> AI agents
      </div>
    </div>
  );
}

export default function RiskChart({
  data,
}: {
  data: Array<{ category: string; count: number }>;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64" />;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          barCategoryGap={10}
        >
          <CartesianGrid
            horizontal={false}
            stroke="rgba(76,201,255,0.08)"
          />
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
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
