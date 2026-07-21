"use client";

import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export function PieChartCard({ data }: { data: ChartData[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-xs text-muted py-4 text-center">No lead data yet</p>;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <ResponsiveContainer width="60%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "13px" }}
            itemStyle={{ color: "#ededed" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2.5 w-full sm:w-auto">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-3 text-xs">
            <span className="size-3 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-muted min-w-[90px]">{d.label}</span>
            <span className="text-foreground font-medium">{d.value}</span>
            <span className="text-muted/50">({Math.round((d.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChartCard({ data }: { data: { date: string; count: number }[] }) {
  if (data.every(d => d.count === 0)) return <p className="text-xs text-muted py-4 text-center">No lead data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "#a0a0a0", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#a0a0a0", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "13px" }}
          itemStyle={{ color: "#00f5ff" }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="url(#barGradient)" />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#ff00aa" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
