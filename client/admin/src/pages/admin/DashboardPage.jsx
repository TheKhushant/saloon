import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { Store, GitBranch, CalendarDays, Users, Clock } from "lucide-react";

export default function DashboardPage() {

  const [counts, setCounts] = useState({
    vendors: 0,
    branches: 0,
    bookings: 0,
    customers: 0,
    today: 0
  });

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const token = localStorage.getItem("adminToken");

        const res = await fetch("http://localhost:5000/api/analytics", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        setCounts({
          vendors: data.totalVendors || 0,
          bookings: data.totalBookings || 0,
          customers: data.totalCustomers || 0,
          branches: data.totalBranches || 0,
          today: data.todayBookings || 0
        });

      } catch (error) {

        console.error("Error loading dashboard", error);

      }

    };

    fetchAnalytics();

  }, []);

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          title="Total Vendors"
          value={counts.vendors}
          icon={Store}
        />

        <StatCard
          title="Total Branches"
          value={counts.branches}
          icon={GitBranch}
        />

        <StatCard
          title="Total Bookings"
          value={counts.bookings}
          icon={CalendarDays}
        />

        <StatCard
          title="Total Customers"
          value={counts.customers}
          icon={Users}
        />

        <StatCard
          title="Today's Appointments"
          value={counts.today}
          icon={Clock}
        />

      </div>

    </div>

  );
}