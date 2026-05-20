import { api } from "@/lib/api";
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

export async function fetchOverview(): Promise<OverviewStats> {
  const { data } = await api.get<OverviewStats>("/admin/stats/overview");
  return data;
}

export async function fetchUpcomingAppointments(limit = 10): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/admin/bookings/upcoming", {
    params: { limit },
  });
  return data;
}

export async function fetchPopularServices(): Promise<PopularService[]> {
  const { data } = await api.get<PopularService[]>("/admin/stats/popular-services");
  return data;
}
