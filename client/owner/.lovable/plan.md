
# Salon Admin Dashboard — Round 1

Convert the current TanStack Start app to a plain Vite + React SPA, then build the auth shell, sidebar, Dashboard, and Bookings page. All data comes from `http://localhost:5000/api/...` via Axios. Stub routes for the remaining 10 sections so the sidebar works end-to-end.

## 1. Stack changes

- Remove TanStack Start / TanStack Router / TanStack Query Start integration.
- Switch entry to a standard Vite SPA: `index.html` + `src/main.tsx` rendering `<App />`.
- Update `vite.config.ts` to a plain React + Tailwind v4 config (drop the start plugin).
- Delete `src/router.tsx`, `src/routes/`, `src/routeTree.gen.ts`, `src/server.ts`, `src/start.ts`, `wrangler.jsonc`.
- Keep Tailwind v4 setup in `src/styles.css` (already good), shadcn/ui components, lucide-react.
- Add deps: `react-router-dom`, `axios`, `@tanstack/react-table`, `@tanstack/react-query`, `recharts`, `date-fns`, `react-hook-form`, `zod`, `@hookform/resolvers`, `next-themes` (dark mode).

## 2. Folder structure

```text
src/
  main.tsx
  App.tsx
  index.css                  (rename styles.css -> index.css)
  lib/
    api.ts                   (axios instance, baseURL, JWT interceptor)
    utils.ts
    queryClient.ts
  context/
    AuthContext.tsx          (JWT in localStorage, login/logout/user)
    ThemeProvider.tsx
  components/
    ui/...                   (existing shadcn)
    layout/
      AdminLayout.tsx        (sidebar + topbar + <Outlet/>)
      Sidebar.tsx
      Topbar.tsx
      ProtectedRoute.tsx
    common/
      DataTable.tsx          (generic tanstack-table wrapper)
      StatCard.tsx
      ConfirmDialog.tsx
      PageHeader.tsx
  features/
    auth/
      LoginPage.tsx
      schema.ts
    dashboard/
      DashboardPage.tsx
      components/
        StatsGrid.tsx
        UpcomingAppointments.tsx
        PopularServicesChart.tsx
        OccupancyCard.tsx
      api.ts
    bookings/
      BookingsPage.tsx
      components/
        BookingsTable.tsx
        BookingFilters.tsx
        BookingDetailsDialog.tsx
        RescheduleDialog.tsx
      api.ts
      types.ts
  pages/stub/
    PlaceholderPage.tsx      (used for the 10 not-yet-built sections)
  types/
    booking.ts
    common.ts
```

## 3. Routing (`App.tsx`)

`BrowserRouter` with these routes:

- `/login` → `LoginPage`
- `/` → `ProtectedRoute` → `AdminLayout` with nested:
  - `index` → `DashboardPage`
  - `bookings` → `BookingsPage`
  - `services`, `barbers`, `customers`, `products`, `offers`, `blogs`, `holidays`, `payments`, `reports`, `settings` → `PlaceholderPage` (real ones come in later rounds)
- `*` → 404

`ProtectedRoute` reads `AuthContext`; if no token, redirect to `/login`.

## 4. Auth

- `AuthContext` stores `{ user, token }` in `localStorage` (`salon_admin_token`).
- `login(email, password)` → `POST /api/admin/auth/login`, expects `{ token, user }`.
- Axios request interceptor attaches `Authorization: Bearer <token>`.
- Response interceptor: on 401 → clear token, redirect to `/login`.
- Login form: React Hook Form + Zod, sonner toast on error.

## 5. Sidebar

- Collapsible sidebar (desktop persistent, mobile sheet via shadcn `Sheet`).
- Items with lucide icons: LayoutDashboard, CalendarCheck, Scissors, Users, UserRound, Package, Tag, Newspaper, CalendarOff, CreditCard, BarChart3, Settings.
- Active item highlighted via `NavLink` `isActive`.
- Topbar: page title, dark-mode toggle (`next-themes`), user menu (avatar, logout).
- Fully responsive; sidebar becomes off-canvas under `md`.

## 6. Dashboard

Endpoints assumed:

- `GET /api/admin/stats/overview` → `{ todayBookings, monthBookings, todayRevenue, monthRevenue, occupancyRate }`
- `GET /api/admin/bookings/upcoming?limit=10`
- `GET /api/admin/stats/popular-services` → `[{ name, count }]`

UI:
- 4 `StatCard`s (Today Bookings, Month Bookings, Today Revenue, Occupancy %).
- `UpcomingAppointments` list (avatar, customer, service, barber, time).
- `PopularServicesChart` (Recharts bar chart).
- `OccupancyCard` (Recharts radial / progress).
- React Query for fetching, skeleton loading states, error toasts.

## 7. Bookings page

Endpoints assumed:

- `GET /api/admin/bookings?status=&from=&to=&barberId=&q=&page=&pageSize=`
- `PATCH /api/admin/bookings/:id/status` body `{ status: 'confirmed'|'cancelled' }`
- `PATCH /api/admin/bookings/:id/reschedule` body `{ date, time }`
- `DELETE /api/admin/bookings/:id`

UI:
- Tabs: Today / Upcoming / Past / Confirmed / Cancelled (drives `status`/date filters).
- Filters row: search (customer name/phone/id), date-range picker (date-fns), barber select.
- TanStack Table columns: Booking ID, Customer, Phone, Service, Barber, Date, Time, Total, Status (badge), Actions.
- Row actions menu: View (details dialog), Confirm, Cancel (ConfirmDialog), Reschedule (dialog with date/time form), Delete (ConfirmDialog).
- Server-side pagination.
- Mutations via React Query with optimistic invalidation; sonner toasts.

## 8. UX polish

- Dark mode via `next-themes` with `class` strategy; tokens already in `styles.css`.
- Sonner `<Toaster />` mounted in `App.tsx`.
- All forms use RHF + Zod with shadcn `Form` components.
- Loading: shadcn `Skeleton`; errors: inline + toast.
- Confirm dialogs reuse `ConfirmDialog` (shadcn `AlertDialog`).

## 9. Out of scope (this round)

Services, Barbers, Customers, Products, Offers, Blogs, Holidays, Payments, Reports, Settings — sidebar links go to a clean `PlaceholderPage` showing the section name and a "Coming next" note. You'll request these one by one.

## Notes / assumptions to flag

- The `localhost:5000` API is only reachable from your own browser, not from the Lovable preview sandbox, so live data will only work when you run the admin locally (`bun dev`). The preview will show empty states / network errors — that's expected.
- Exact endpoint paths above are best guesses; I'll centralize them in `features/*/api.ts` so they're trivial to rename to match your real backend.
- This rip-and-replace will delete the current TanStack route files. Confirm before I proceed if you have any custom code in `src/routes/` worth preserving (I only see the placeholder index right now).
