export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface Booking {
  _id: string;
  bookingId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  serviceId?: string;
  barber: string;
  barberId?: string;
  branchId: string;
  date: string; // ISO
  time: string; // "HH:mm"
  total: number;
  status: BookingStatus;
  createdAt?: string;
  notes?: string;
}

export interface BookingListResponse {
  data: Booking[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BookingsQuery {
  status?: BookingStatus | "";
  from?: string;
  to?: string;
  barberId?: string;
  branchId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}
