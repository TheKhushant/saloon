import { CalendarCheck, CalendarDays, DollarSign, Percent } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import type { OverviewStats } from "../api";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function StatsGrid({
  stats,
  loading,
}: {
  stats?: OverviewStats;
  loading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Bookings Today"
        icon={CalendarCheck}
        value={stats?.todayBookings ?? 0}
        loading={loading}
      />
      <StatCard
        label="Bookings This Month"
        icon={CalendarDays}
        value={stats?.monthBookings ?? 0}
        loading={loading}
      />
      <StatCard
        label="Revenue (Month)"
        icon={DollarSign}
        value={currency(stats?.monthRevenue ?? 0)}
        hint={stats ? `${currency(stats.todayRevenue)} today` : undefined}
        loading={loading}
      />
      <StatCard
        label="Occupancy"
        icon={Percent}
        value={`${Math.round(stats?.occupancyRate ?? 0)}%`}
        loading={loading}
      />
    </div>
  );
}
