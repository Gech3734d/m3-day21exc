 "use client";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
type Point = { day: string; date: string; revenue: number; orders: number };
export default function OrdersLineChart({ data }: { data: Point[] }) {
  return <div className="chart" role="img" aria-label="Line chart showing completed orders per day, measured in orders, from September 24 to September 30, 2026. An equivalent data table follows.">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 2 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9efeb" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#66756f", fontSize: 11 }} />
        <YAxis allowDecimals={false} width={30} tickLine={false} axisLine={false} tick={{ fill: "#66756f", fontSize: 10 }} />
        <Tooltip formatter={(value) => [Number(value), "Orders"]} labelFormatter={(label) => `Day: ${label}`} />
        <Line type="monotone" dataKey="orders" name="Orders" stroke="#cb8740" strokeWidth={3} dot={{ r: 4, fill: "#cb8740", strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>;
}