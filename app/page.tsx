import Link from "next/link";
import Charts from "@/components/Charts";
import OrdersTable from "@/components/OrdersTable";
import { aggregateOrders, allOrders, type SortDirection, type SortKey } from "@/lib/orders";

type SearchParams = Promise<{ state?: string; sort?: string; direction?: string; page?: string }>;
const PAGE_SIZE = 8;
const validSorts: SortKey[] = ["date", "customer", "status", "total"];

function EmptyState() {
  return <section className="empty" aria-labelledby="empty-title">
    <div className="empty-icon" aria-hidden="true">▤</div>
    <h3 id="empty-title">No orders to show yet</h3>
    <p>Your order analytics will appear here once your first order is recorded. You can preview the populated dashboard with sample data.</p>
    <div className="actions"><Link className="btn primary" href="/?state=populated">Preview sample dashboard</Link><Link className="btn" href="/?state=empty">Keep empty state</Link></div>
    <p className="state-note">Empty state · Designed to explain what happens next, not leave a blank screen.</p>
  </section>;
}

export default async function Dashboard({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const forceEmpty = params.state === "empty" || (process.env.DASHBOARD_EMPTY === "true" && params.state !== "populated");
  const state = params.state;
  const sort = validSorts.includes(params.sort as SortKey) ? params.sort as SortKey : "date";
  const direction: SortDirection = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  // All order aggregation stays on the server. Only small chart summary data crosses into client chart components.
  const summary = aggregateOrders(allOrders);
  const sorted = [...allOrders].sort((a, b) => {
    let result = 0;
    if (sort === "date") result = a.date.localeCompare(b.date);
    if (sort === "customer") result = a.customer.localeCompare(b.customer);
    if (sort === "status") result = a.status.localeCompare(b.status);
    if (sort === "total") result = a.total - b.total;
    return direction === "asc" ? result : -result;
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const pageOrders = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><div className="logo" aria-hidden="true">B</div><div><h1>Addis Eats</h1><p>Merchant workspace</p></div></div>
      <span className="pill"><span className="dot" /> Analytics overview</span>
    </header>
    <div className="page-heading"><div><p className="eyebrow">Dashboard / Orders</p><h2>Order analytics</h2><p className="subheading">A clear view of your store's performance.</p></div>
      <div className="actions"><Link className="btn" href="/?state=empty">Force empty</Link><Link className="btn primary" href="/?state=populated">Load sample data</Link></div>
    </div>
    {forceEmpty ? <EmptyState /> : <>
      <section className="metrics" aria-label="Order summary">
        <div className="metric"><div className="metric-label">Total orders</div><div className="metric-value">{summary.totalOrders}</div><div className="metric-foot">All recorded orders</div></div>
        <div className="metric"><div className="metric-label">Completed revenue</div><div className="metric-value">{new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(summary.revenue)}</div><div className="metric-foot">Completed orders only</div></div>
        <div className="metric"><div className="metric-label">Pending orders</div><div className="metric-value">{summary.pending}</div><div className="metric-foot">Awaiting fulfillment</div></div>
        <div className="metric"><div className="metric-label">Average order value</div><div className="metric-value">{new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(summary.averageOrder)}</div><div className="metric-foot">Per completed order</div></div>
      </section>
      <Charts data={summary.chartData} />
      <OrdersTable orders={pageOrders} sort={sort} direction={direction} page={page} pageSize={PAGE_SIZE} total={sorted.length} />
      <p className="state-note">Sample dashboard · Values are demo data for UI development, not real business records.</p>
    </>}
    <footer className="footer"><span>© 2026 Addis Eats Analytics</span><span>Built for clarity and accessibility</span></footer>
  </main>;
}