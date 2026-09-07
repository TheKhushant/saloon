// import { useEffect, useState } from "react";
// import { StatCard } from "@/components/admin/StatCard";
// import { StatusBadge } from "@/components/admin/StatusBadge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CalendarDays, Users, Clock } from "lucide-react";
// import { bookingsPerDay } from "@/data/mockData";
// import { getBookings } from "@/lib/bookingStore";
// import { getCustomers } from "@/lib/customerStore";
// import useAuth from "@/hooks/useAuth";
// import type { Booking } from "@/data/mockData";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// export default function DashboardPage() {
//   const { user } = useAuth();
//   const isBranchAdmin = user?.role === "branch_admin";
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [customerCount, setCustomerCount] = useState(0);

//   useEffect(() => {
//     // No frontend-side branch filtering needed: the backend already scopes
//     // /api/admin/bookings (and /customers) to the admin's own branch
//     // automatically.
//     getBookings().then(setBookings);
//     getCustomers().then((all) => setCustomerCount(all.length));
//   }, []);

//   const today = new Date().toISOString().slice(0, 10);
//   const todaysBookings = bookings.filter((b) => b.date === today).length;
//   const completedBookings = bookings.filter((b) => b.status === "Completed").length;
//   const recentBookings = [...bookings]
//     .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1))
//     .slice(0, 5);

//   return (
//     <div className="space-y-6">
//       <h1 className="font-heading text-2xl font-semibold text-foreground">
//         {isBranchAdmin ? `${user?.branchName} Dashboard` : "Admin Dashboard"}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {isBranchAdmin ? (
//           <>
//             <StatCard title="Total Bookings" value={bookings.length} icon={CalendarDays} />
//             <StatCard title="Today's Appointments" value={todaysBookings} icon={Clock} />
//             <StatCard title="Completed" value={completedBookings} icon={Users} />
//           </>
//         ) : (
//           <>
//             <StatCard title="Total Bookings" value={bookings.length} icon={CalendarDays} />
//             <StatCard title="Total Customers" value={customerCount} icon={Users} />
//             <StatCard title="Today's Appointments" value={todaysBookings} icon={Clock} />
//           </>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="font-heading text-lg">Bookings This Week</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={260}>
//               <BarChart data={bookingsPerDay}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="day" tickLine={false} axisLine={false} />
//                 <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
//                 <Tooltip />
//                 <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="font-heading text-lg">Recent Bookings</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {recentBookings.map((b) => (
//               <div key={b.id} className="flex items-center justify-between gap-2">
//                 <div className="min-w-0">
//                   <p className="font-body text-sm font-medium text-foreground truncate">{b.customerName}</p>
//                   <p className="text-xs text-muted-foreground font-body truncate">{b.service} · {b.date}</p>
//                 </div>
//                 <StatusBadge status={b.status} />
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Clock } from "lucide-react";
import { getBookings } from "@/lib/bookingStore";
import { getCustomers } from "@/lib/customerStore";
import useAuth from "@/hooks/useAuth";
import type { Booking } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    // No frontend-side branch filtering needed: the backend already scopes
    // /api/admin/bookings (and /customers) to the admin's own branch
    // automatically.
    getBookings().then(setBookings);
    getCustomers().then((all) => setCustomerCount(all.length));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((b) => b.date === today).length;
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;
  const recentBookings = [...bookings]
    .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1))
    .slice(0, 5);

  // Last 7 days, oldest to newest, counted from the real bookings we
  // already fetched above (mockData's bookingsPerDay was static sample
  // data and is no longer exported).
  const bookingsPerDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      bookings: bookings.filter((b) => b.date === iso).length,
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        {isBranchAdmin ? `${user?.branchName} Dashboard` : "Admin Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isBranchAdmin ? (
          <>
            <StatCard title="Total Bookings" value={bookings.length} icon={CalendarDays} />
            <StatCard title="Today's Appointments" value={todaysBookings} icon={Clock} />
            <StatCard title="Completed" value={completedBookings} icon={Users} />
          </>
        ) : (
          <>
            <StatCard title="Total Bookings" value={bookings.length} icon={CalendarDays} />
            <StatCard title="Total Customers" value={customerCount} icon={Users} />
            <StatCard title="Today's Appointments" value={todaysBookings} icon={Clock} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Bookings This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bookingsPerDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{b.customerName}</p>
                  <p className="text-xs text-muted-foreground font-body truncate">{b.service} · {b.date}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}