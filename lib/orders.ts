export type OrderStatus = "Completed" | "Pending" | "Cancelled";
export type Order = { id: string; customer: string; email: string; date: string; items: number; total: number; status: OrderStatus };

const customers = [
  ["Mekdes Tadesse", "mekdes@example.com"], ["Abel Girma", "abel@example.com"],
  ["Hana Bekele", "hana@example.com"], ["Dawit Alemu", "dawit@example.com"],
  ["Sara Mohammed", "sara@example.com"], ["Samuel Kebede", "samuel@example.com"],
  ["Liya Tesfaye", "liya@example.com"], ["Nahom Worku", "nahom@example.com"],
  ["Rahel Getachew", "rahel@example.com"], ["Yonas Desta", "yonas@example.com"],
  ["Mimi Kassahun", "mimi@example.com"], ["Bereket Fikru", "bereket@example.com"]
] as const;

export const allOrders: Order[] = Array.from({ length: 37 }, (_, i) => {
  const c = customers[i % customers.length];
  const day = (i * 3 + Math.floor(i / 4)) % 30;
  const statuses: OrderStatus[] = ["Completed", "Completed", "Pending", "Completed", "Cancelled", "Completed"];
  return {
    id: `BM-${String(1048 + i).padStart(5, "0")}`,
    customer: c[0],
    email: c[1],
    date: new Date(Date.UTC(2026, 8, 30 - day, 9 + (i % 9), (i * 7) % 60)).toISOString(),
    items: 1 + ((i * 7) % 5),
    total: 180 + ((i * 379 + 117) % 6800),
    status: statuses[i % statuses.length]
  };
});

export type SortKey = "date" | "customer" | "status" | "total";
export type SortDirection = "asc" | "desc";

export function aggregateOrders(orders: Order[]) {
  const completed = orders.filter(o => o.status === "Completed");
  const revenue = completed.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter(o => o.status === "Pending").length;
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 8, 24 + index));
    const key = date.toISOString().slice(0, 10);
    const dayOrders = completed.filter(o => o.date.slice(0, 10) === key);
    return {
      day: date.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short" }),
      date: key,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length
    };
  });
  return { totalOrders: orders.length, revenue, pending, averageOrder: completed.length ? Math.round(revenue / completed.length) : 0, chartData: days };
}

export function formatETB(amount: number) {
  return new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(amount);
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}