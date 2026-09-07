import type { Booking } from "@/data/mockData";
import {
  createBookingApi,
  deleteBookingApi,
  getBookingsApi,
  updateBookingStatusApi,
  type CreateBookingPayload,
} from "./adminApi";

export async function getBookings(): Promise<Booking[]> {
  return getBookingsApi();
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return createBookingApi(payload);
}

export async function updateBookingStatus(id: string, status: Booking["status"]): Promise<void> {
  return updateBookingStatusApi(id, status);
}

export async function deleteBooking(id: string): Promise<void> {
  return deleteBookingApi(id);
}
