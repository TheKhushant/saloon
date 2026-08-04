import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { ALL_BRANCHES, useBranch } from "@/context/BranchContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportSummaryCards } from "./components/ReportSummaryCards";
import { RevenueTrendChart } from "./components/RevenueTrendChart";
import { NamedBarChart } from "./components/NamedBarChart";
import { fetchReportSummary } from "./api";

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export default function ReportsPage() {
  const { selectedBranchId, selectedBranch } = useBranch();
  const branchId = selectedBranchId === ALL_BRANCHES ? undefined : selectedBranchId;

  const [range, setRange] = useState("30");
  const rangeDays = Number(range);

  const reportQ = useQuery({
    queryKey: ["reports", "summary", rangeDays, branchId],
    queryFn: () => fetchReportSummary(rangeDays, branchId),
  });

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description={
          selectedBranch
            ? `Revenue and booking trends at ${selectedBranch.name}`
            : "Revenue and booking trends across all branches"
        }
        actions={
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-4">
        <ReportSummaryCards data={reportQ.data} loading={reportQ.isLoading} />

        <RevenueTrendChart data={reportQ.data?.revenueTrend} loading={reportQ.isLoading} />

        <div className="grid gap-4 md:grid-cols-3">
          <NamedBarChart
            title="Bookings by status"
            data={reportQ.data?.bookingsByStatus.map((s) => ({ name: s.status, count: s.count }))}
            loading={reportQ.isLoading}
          />
          <NamedBarChart
            title="Top services"
            data={reportQ.data?.topServices}
            loading={reportQ.isLoading}
            formatLabel={(v) => v}
          />
          <NamedBarChart
            title="Top barbers"
            data={reportQ.data?.topBarbers}
            loading={reportQ.isLoading}
            formatLabel={(v) => v}
          />
        </div>
      </div>
    </>
  );
}
