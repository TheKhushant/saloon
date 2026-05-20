import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "./components/StatsGrid";
import { UpcomingAppointments } from "./components/UpcomingAppointments";
import { PopularServicesChart } from "./components/PopularServicesChart";
import { OccupancyCard } from "./components/OccupancyCard";
import { fetchOverview, fetchPopularServices, fetchUpcomingAppointments } from "./api";

export default function DashboardPage() {
  const overview = useQuery({ queryKey: ["dashboard", "overview"], queryFn: fetchOverview });
  const upcoming = useQuery({
    queryKey: ["dashboard", "upcoming"],
    queryFn: () => fetchUpcomingAppointments(8),
  });
  const popular = useQuery({
    queryKey: ["dashboard", "popular"],
    queryFn: fetchPopularServices,
  });

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of today's activity" />
      <div className="space-y-6">
        <StatsGrid stats={overview.data} loading={overview.isLoading} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PopularServicesChart data={popular.data} loading={popular.isLoading} />
          </div>
          <OccupancyCard rate={overview.data?.occupancyRate} loading={overview.isLoading} />
        </div>
        <UpcomingAppointments bookings={upcoming.data} loading={upcoming.isLoading} />
      </div>
    </>
  );
}
