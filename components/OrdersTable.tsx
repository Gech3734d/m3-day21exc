import Link from "next/link";
import { formatDate, formatETB, type Order, type SortDirection, type SortKey } from "@/lib/orders";

type Props = { orders: Order[]; sort: SortKey; direction: SortDirection; page: number; pageSize: number; total: number };
const columns: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "date", label: "Order date" }, { key: "customer", label: "Customer" },
  { key: "status", label: "Status" }, { key: "total", label: "Total", numeric: true }
];
function sortHref(key: SortKey, active: SortKey, direction: SortDirection) {
  const nextDirection = active === key && direction === "asc" ? "desc" : "asc";
  return `/?sort=${key}&direction=${nextDirection}&page=1`;
}
export default function OrdersTable({ orders, sort, direction, page, pageSize, total }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, total);
  return <section className="panel table-panel" aria-labelledby="orders-title">
    <div className="table-title"><div><h3 id="orders-title">Recent orders</h3><p>Sort by selecting a column heading.</p></div><span className="pill">{total} orders</span></div>
    <div className="table-wrap">
      <table className="orders">
        <caption>Orders with order date, customer, status, and total. Totals are shown in Ethiopian birr. Activate a column heading to sort.</caption>
        <thead><tr>
          <th scope="col">Order</th>
          {columns.map(column => <th key={column.key} scope="col" className={column.numeric ? "numeric" : ""} aria-sort={sort === column.key ? (direction === "asc" ? "ascending" : "descending") : "none"}>
            <Link href={sortHref(column.key, sort, direction)}>{column.label}{sort === column.key ? (direction === "asc" ? " ↑" : " ↓") : ""}</Link>
          </th>)}
        </tr></thead>
        <tbody>{orders.map(order => <tr key={order.id}>
          <td><div className="customer">{order.id}</div><div className="order-id">{order.items} item{order.items === 1 ? "" : "s"}</div></td>
          <td>{formatDate(order.date)}</td>
          <td><div className="customer">{order.customer}</div><div className="order-id">{order.email}</div></td>
          <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
          <td className="numeric">{formatETB(order.total)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="pagination"><p>Showing {first}–{last} of {total} orders</p><nav className="page-links" aria-label="Order table pages">
      {page > 1 && <Link className="page-link" href={`/?sort=${sort}&direction=${direction}&page=${page - 1}`}>← Previous</Link>}
      {Array.from({ length: pages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2 || p === 1 || p === pages).map((p, i, arr) => <span key={p} style={{ display: "contents" }}>
        {i > 0 && p - arr[i - 1] > 1 && <span aria-hidden="true" className="page-link">…</span>}
        <Link className="page-link" href={`/?sort=${sort}&direction=${direction}&page=${p}`} aria-current={p === page ? "page" : undefined}>{p}</Link>
      </span>)}
      {page < pages && <Link className="page-link" href={`/?sort=${sort}&direction=${direction}&page=${page + 1}`}>Next →</Link>}
    </nav></div>
  </section>;
}