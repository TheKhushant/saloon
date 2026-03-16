import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingsPerDay, topServices, activeVendorsChart, bookings, vendors, customers } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;
  const activeVendors = vendors.filter((v) => v.status === "Active").length;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground font-body">Total Bookings</p>
            <p className="text-2xl font-heading font-semibold">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground font-body">Completed</p>
            <p className="text-2xl font-heading font-semibold text-status-active">{completedBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground font-body">Cancelled</p>
            <p className="text-2xl font-heading font-semibold text-destructive">{cancelledBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground font-body">Active Vendors</p>
            <p className="text-2xl font-heading font-semibold">{activeVendors}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Bookings Per Day</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bookingsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 15% 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(36 5% 45%)" />
                <YAxis tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(36 5% 45%)" />
                <Tooltip contentStyle={{ fontFamily: "Inter", fontSize: 13, borderRadius: 8 }} />
                <Bar dataKey="bookings" fill="hsl(34 52% 49%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Top Services</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 15% 88%)" />
                <XAxis type="number" tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(36 5% 45%)" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(36 5% 45%)" />
                <Tooltip contentStyle={{ fontFamily: "Inter", fontSize: 13, borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(163 20% 46%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-heading text-lg">Vendor Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activeVendorsChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 15% 88%)" />
                <XAxis type="number" tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(36 5% 45%)" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontFamily: "Inter" }} stroke="hsl(36 5% 45%)" />
                <Tooltip contentStyle={{ fontFamily: "Inter", fontSize: 13, borderRadius: 8 }} />
                <Bar dataKey="bookings" fill="hsl(34 52% 49%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
