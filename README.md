# Addis Eats — Order Analytics Dashboard

A Next.js App Router dashboard that starts with a useful empty state and supports sample populated data, server-side aggregation, accessible charts, sortable orders, and URL-based pagination.

## Requirements

- Node.js 20.9+
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

On Windows PowerShell, copy the environment example with:

```powershell
Copy-Item .env.example .env.local
```

Then visit:
- `/` — populated demo dashboard by default
- `/?state=empty` — force the empty state
- `/?state=populated` — force sample data even when `DASHBOARD_EMPTY=true`
- `/?sort=total&direction=asc&page=2` — sort and paginate through the orders

Set `DASHBOARD_EMPTY=true` in `.env.local` if you want a fresh empty state by default. Restart the dev server after changing environment variables.

## Production build

```bash
npm run build
npm run start
```

## How requirements are applied

1. **Empty state first:** `EmptyState` provides a title, explanation, and next actions. The `state=empty` URL makes the state deterministic for review.
2. **Server aggregation:** `app/page.tsx` calls `aggregateOrders` on the server. It passes only seven small daily summary points to the chart components, never the complete order collection.
3. **Revenue chart:** `RevenueChart` uses a fixed 250px chart region and formats axis ticks as ETB. The formatter uses Ethiopian birr (`ETB`) and no fractional digits for readable dashboard labels.
4. **Orders-per-day line chart:** The heading names the date range and unit (`orders/day`).
5. **Non-SVG alternative:** Each chart is followed by an HTML data table that repeats the chart's dates, revenue, and order counts.
6. **Semantic order table:** `OrdersTable` uses a real `<table>`, a caption, table headers, and right-aligned numeric totals. (Date and total cells are both right-aligned.)
7. **URL sorting:** Sort links update `searchParams`; the active column gets `aria-sort="ascending"` or `"descending"`. Other headers use `aria-sort="none"`.
8. **URL pagination:** Previous, numbered, and Next controls are Next.js `Link` elements and preserve the current sort settings.

## Four states to verify

The four review states are reproducible using query strings:

| State | URL | Expected result |
| --- | --- | --- |
| Empty | `/?state=empty` | Empty-state guidance and actions, no charts/table |
| Populated | `/?state=populated` | Summary cards, both charts, accessible data tables, orders table |
| Sorted | `/?state=populated&sort=total&direction=asc&page=1` | Lowest totals first; Total header marked ascending |
| Paginated | `/?state=populated&sort=date&direction=desc&page=2` | Second page; 8 orders per page; sort preserved |

### Manual verification checklist

- [ ] Open `/?state=empty`, confirm the empty-state title and useful next action.
- [ ] Open `/?state=populated`, confirm metrics, both charts, their matching HTML tables, and order rows.
- [ ] Open `/?state=populated&sort=total&direction=asc&page=1`, confirm totals are ascending and `aria-sort` is present on Total.
- [ ] Open `/?state=populated&sort=date&direction=desc&page=2`, confirm page 2 and working Next/Previous links.
- [ ] Use keyboard navigation to reach sort and pagination links.
- [ ] Build for production using `npm run build`, then run Lighthouse against `npm run start`.

## Data and implementation notes

The order list is deterministic in-memory demo data in `lib/orders.ts`; no database or secret is required. Replace `allOrders` with a server-side database query when integrating a real backend. Keep aggregation on the server and pass only the summary values needed by visualizations to client components.

The charts use Recharts and therefore render SVG. The adjacent semantic tables expose the same data without requiring users to interpret the SVG. The chart region has an explicit height to avoid responsive chart sizing collapse.

## GitHub

Commit the source and `.env.example`. Do **not** commit `.env.local`, secrets, `.next`, or `node_modules`.
