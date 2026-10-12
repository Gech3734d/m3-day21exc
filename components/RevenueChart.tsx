 "use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatETB } from "@/lib/orders";

type Point = { day: string; date: string; revenue: number; orders: number };
export default function RevenueChart({ data }: { data: Point[] }) {
  return <div className="chart" role="img" aria-label="Bar chart showing completed order revenue in Ethiopian birr for each day from September 24 to September 30, 2026. An equivalent data table follows.">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 5, bottom: 2 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9efeb" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#66756f", fontSize: 11 }} />
        <YAxis width={68} tickLine={false} axisLine={false} tick={{ fill: "#66756f", fontSize: 10 }} tickFormatter={(v: number) => `ETB ${(v / 1000).toFixed(v >= 1000 ? 0 : 1)}k`} />
        <Tooltip formatter={(value) => [formatETB(Number(value)), "Revenue"]} labelFormatter={(label) => `Day: ${label}`} />
        <Bar dataKey="revenue" name="Revenue" fill="#24845e" radius={[5, 5, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
}