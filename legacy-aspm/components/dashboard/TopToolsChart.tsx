"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TopToolsChart({
  data,
}: {
  data: Array<{ name: string; count: number }>;
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
        >
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            stroke="#71717a"
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-22}
            textAnchor="end"
            height={50}
          />
          <YAxis
            stroke="#71717a"
            tick={{ fill: "#71717a", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#1a1a1a",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              fontSize: 12,
              color: "#f5f5f5",
            }}
          />
          <Bar dataKey="count" fill="#1D9E75" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
