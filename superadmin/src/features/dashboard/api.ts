import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { mockFetchOverview, mockFetchPopularServices, mockFetchUpcomingAppointments } from "@/lib/mock/store";
import type { Booking } from "@/features/bookings/types";

export interface OverviewStats {
  todayBookings: number;
  monthBookings: number;
  todayRevenue: number;
  monthRevenue: number;
  occupancyRate: number;
}

export interface PopularService {
  name: string;
  count: number;
}

export async function fetchOverview(branchId?: string): Promise<OverviewStats> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<OverviewStats>("/admin/stats/overview", {
        params: { branchId },
      });
      return data;
    },
    () => mockFetchOverview(branchId)
  );
}

export async function fetchUpcomingAppointments(limit = 10, branchId?: string): Promise<Booking[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Booking[]>("/admin/bookings/upcoming", {
        params: { limit, branchId },
      });
      return data;
    },
    () => mockFetchUpcomingAppointments(limit, branchId)
  );
}

export async function fetchPopularServices(branchId?: string): Promise<PopularService[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<PopularService[]>("/admin/stats/popular-services", {
        params: { branchId },
      });
      return data;
    },
    () => mockFetchPopularServices(branchId)
  );
}
