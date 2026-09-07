import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookings } from "@/lib/bookingStore";
import useAuth from "@/hooks/useAuth";
import type { Booking } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // No frontend-side branch filtering needed: the backend already scopes
    // /api/admin/bookings to the admin's own branch automatically.
    getBookings().then(setBookings);
  }, []);

  const completedBookings = bookings.filter(
    (b) => b.status === "Completed"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "Cancelled"
  ).length;
  const pendingBookings = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  // Both charts below used to read static sample arrays from mockData
  // (bookingsPerDay, topServices) - those exports were removed, so we
  // derive the same shapes from the real bookings fetched above.
  const bookingsPerDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      bookings: bookings.filter((b) => b.date === iso).length,
    };
  });

  const topServices = Object.entries(
    bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.service] = (acc[b.service] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        {isBranchAdmin ? `${user?.branchName} Analytics` : "Analytics"}
      </h1>

      {/* Statistics Cards: 2x2 on mobile, single row from small screens up */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-2 sm:p-4 text-center">
            <p className="text-[11px] sm:text-sm text-muted-foreground truncate">
              Total Bookings
            </p>
            <p className="text-lg sm:text-3xl font-semibold">
              {bookings.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4 text-center">
            <p className="text-[11px] sm:text-sm text-muted-foreground truncate">
              Completed
            </p>
            <p className="text-lg sm:text-3xl font-semibold text-green-600">
              {completedBookings}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4 text-center">
            <p className="text-[11px] sm:text-sm text-muted-foreground truncate">
              Pending
            </p>
            <p className="text-lg sm:text-3xl font-semibold">
              {pendingBookings}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4 text-center">
            <p className="text-[11px] sm:text-sm text-muted-foreground truncate">
              Cancelled
            </p>
            <p className="text-lg sm:text-3xl font-semibold text-red-600">
              {cancelledBookings}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts: side by side from laptop (lg) screens up, stacked and auto-width on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bookings Per Day</CardTitle>
          </CardHeader>

          <CardContent className="px-2 sm:px-3">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bookingsPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="bookings"
                  fill="hsl(34 52% 49%)"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>

          <CardContent className="px-2 sm:px-3">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topServices} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="hsl(163 20% 46%)"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}