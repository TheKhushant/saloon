import { api } from "@/lib/api";
import type { Booking, BookingListResponse, BookingsQuery, BookingStatus } from "./types";

export async function fetchBookings(query: BookingsQuery): Promise<BookingListResponse> {
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
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { data } = await api.patch<Booking>(`/admin/bookings/${id}/status`, { status });
  return data;
}

export async function rescheduleBooking(id: string, date: string, time: string) {
  const { data } = await api.patch<Booking>(`/admin/bookings/${id}/reschedule`, { date, time });
  return data;
}

export async function deleteBooking(id: string) {
  await api.delete(`/admin/bookings/${id}`);
}

export async function fetchBarbers(): Promise<{ _id: string; name: string }[]> {
  const { data } = await api.get<{ _id: string; name: string }[]>("/admin/barbers");
  return data;
}
