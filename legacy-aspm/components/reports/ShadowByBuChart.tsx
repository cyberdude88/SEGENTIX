"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ShadowByBuChart({
  data,
}: {
  data: Array<{ unit: string; shadow: number; registered: number }>;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
          barCategoryGap={28}
        >
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="unit"
            stroke="#71717a"
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
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
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
            iconType="square"
          />
          <Bar
            dataKey="registered"
            stackId="a"
            fill="#1D9E75"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="shadow"
            stackId="a"
            fill="#E24B4A"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
