import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId, withIds } from "@/lib/normalizeId";
import {
  mockDeleteBooking,
  mockFetchBarbers,
  mockFetchBookings,
  mockRescheduleBooking,
  mockUpdateBookingStatus,
} from "@/lib/mock/store";
import type { Booking, BookingListResponse, BookingsQuery, BookingStatus } from "./types";

// Backend BookingStatus enum serializes as uppercase with underscores
// ("NO_SHOW"); this app's type is lowercase ("no_show") - same casing
// convention, so a plain lowercase works for every value.
function normalizeBooking(booking: Booking): Booking {
  return withId({
    ...booking,
    status: (String(booking.status).toLowerCase() as BookingStatus),
  });
}

export async function fetchBookings(query: BookingsQuery): Promise<BookingListResponse> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<BookingListResponse | Booking[]>("/admin/bookings", {
        params: query,
      });
      // Tolerate both array and paginated response shapes.
      if (Array.isArray(data)) {
        return {
          data: data.map(normalizeBooking),
          total: data.length,
          page: query.page ?? 1,
          pageSize: query.pageSize ?? data.length,
        };
      }
      return { ...data, data: data.data.map(normalizeBooking) };
    },
    () => mockFetchBookings(query)
  );
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Booking>(`/admin/bookings/${id}/status`, { status });
      return normalizeBooking(data);
    },
    () => mockUpdateBookingStatus(id, status)
  );
}

export async function rescheduleBooking(id: string, date: string, time: string) {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Booking>(`/admin/bookings/${id}/reschedule`, { date, time });
      return normalizeBooking(data);
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
      return withIds(data);
    },
    () => mockFetchBarbers(branchId)
  );
}
