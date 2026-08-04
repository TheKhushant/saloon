import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import { StatsGrid } from "./components/StatsGrid";
import { UpcomingAppointments } from "./components/UpcomingAppointments";
import { PopularServicesChart } from "./components/PopularServicesChart";
import { OccupancyCard } from "./components/OccupancyCard";
import { fetchOverview, fetchPopularServices, fetchUpcomingAppointments } from "./api";

export default function DashboardPage() {
  const { selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const overview = useQuery({
    queryKey: ["dashboard", "overview", branchId],
    queryFn: () => fetchOverview(branchId),
  });
  const upcoming = useQuery({
    queryKey: ["dashboard", "upcoming", branchId],
    queryFn: () => fetchUpcomingAppointments(8, branchId),
  });
  const popular = useQuery({
    queryKey: ["dashboard", "popular", branchId],
    queryFn: () => fetchPopularServices(branchId),
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={
          selectedBranch ? `Overview of today's activity at ${selectedBranch.name}` : "Overview of today's activity across all branches"
        }
      />
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
