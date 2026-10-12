import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";
import { formatETB } from "@/lib/orders";

type Point = { day: string; date: string; revenue: number; orders: number };
function AccessibleDataTable({ data }: { data: Point[] }) {
  return <table className="chart-table">
    <caption>Daily revenue and completed order counts, September 24–30, 2026. This table provides the same data as the charts.</caption>
    <thead><tr><th scope="col">Day</th><th scope="col">Revenue (ETB)</th><th scope="col">Orders</th></tr></thead>
    <tbody>{data.map(point => <tr key={point.date}><th scope="row">{point.day}</th><td>{formatETB(point.revenue)}</td><td>{point.orders}</td></tr>)}</tbody>
  </table>;
}
export default function Charts({ data }: { data: Point[] }) {
  return <section className="charts" aria-label="Order analytics charts">
    <div className="panel">
      <div className="panel-heading"><div><h3>Revenue over time</h3><p>Daily completed revenue · ETB</p></div><span className="pill">7 days</span></div>
      <RevenueChart data={data} />
      <AccessibleDataTable data={data} />
    </div>
    <div className="panel">
      <div className="panel-heading"><div><h3>Orders per day · Sep 24–30, 2026</h3><p>Completed orders · unit: orders/day</p></div><span className="pill">7 days</span></div>
      <OrdersLineChart data={data} />
      <AccessibleDataTable data={data} />
    </div>
  </section>;
}