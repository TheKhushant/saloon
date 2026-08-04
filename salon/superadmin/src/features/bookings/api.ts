import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockDeleteBooking,
  mockFetchBarbers,
  mockFetchBookings,
  mockRescheduleBooking,
  mockUpdateBookingStatus,
} from "@/lib/mock/store";
import type { Booking, BookingListResponse, BookingsQuery, BookingStatus } from "./types";

export async function fetchBookings(query: BookingsQuery): Promise<BookingListResponse> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<BookingListResponse | Booking[]>("/admin/bookings", {
        params: query,
      });
      // Tolerate both array and paginated response shapes.
      if (Array.isArray(data)) {
        return {
          data,
          total: data.length,
          page: query.page ?? 1,
          pageSize: query.pageSize ?? data.length,
        };
      }
      return data;
    },
    () => mockFetchBookings(query)
  );
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Booking>(`/admin/bookings/${id}/status`, { status });
      return data;
    },
    () => mockUpdateBookingStatus(id, status)
  );
}

export async function rescheduleBooking(id: string, date: string, time: string) {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Booking>(`/admin/bookings/${id}/reschedule`, { date, time });
      return data;
    },
    () => mockRescheduleBooking(id, date, time)
  );
}

export async function deleteBooking(id: string) {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/bookings/${id}`);
    },
    () => mockDeleteBooking(id)
  );
}

export async function fetchBarbers(branchId?: string): Promise<{ _id: string; name: string; branchId: string }[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<{ _id: string; name: string; branchId: string }[]>("/admin/barbers", {
        params: { branchId },
      });
      return data;
    },
    () => mockFetchBarbers(branchId)
  );
}
