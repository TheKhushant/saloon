import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { mockFetchReportSummary } from "@/lib/mock/store";
import type { ReportSummary } from "./types";

export async function fetchReportSummary(rangeDays: number, branchId?: string): Promise<ReportSummary> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<ReportSummary>("/admin/reports/summary", {
        params: { rangeDays, branchId },
      });
      return data;
    },
    () => mockFetchReportSummary(rangeDays, branchId)
  );
}
