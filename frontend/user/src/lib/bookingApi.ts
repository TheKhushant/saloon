const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiBranch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  active?: boolean;
}

export interface ApiService {
  id: string;
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
}

export interface ApiBarber {
  id: string;
  name: string;
  specialties?: string[];
}

export interface Availability {
  closed: boolean;
  holiday: unknown | null;
  bookedSlots: { time: string; barberId: string | null }[];
  maxBookingsPerSlot: number;
  remainingCapacityByTime: Record<string, number>;
}

export interface CreateBookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  barberId?: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
  notes?: string;
  offerCode?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API_URL}${path}${qs}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export const fetchBranches = () => get<ApiBranch[]>("/public/branches");
export const fetchServices = () => get<ApiService[]>("/public/services");
export const fetchBarbers = (branchId: string) => get<ApiBarber[]>("/public/barbers", { branchId });

export const checkAvailability = (branchId: string, date: string, barberId?: string) =>
  get<Availability>("/public/availability", { branchId, date, ...(barberId ? { barberId } : {}) });

export interface EarliestSlot {
  branchId: string;
  branchName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

/**
 * Finds the soonest open slot for a service at EACH branch that offers it,
 * sorted earliest-first - lets a customer compare "where can I get this
 * fastest" across the whole chain instead of committing to a branch before
 * knowing when it's actually free. Only meaningful for a real (non-mock)
 * service id, since mock ids don't exist in the backend.
 */
export const fetchEarliestAvailability = (serviceId: string, daysAhead = 14) =>
  get<EarliestSlot[]>(`/public/services/${serviceId}/earliest-availability`, {
    daysAhead: String(daysAhead),
  });

/**
 * Creates a real booking against the backend, which enforces the per-slot
 * capacity limit (default 5 concurrent bookings per branch+date+time,
 * configurable by a superadmin) atomically under a database lock. A 409
 * response specifically means "this slot just filled up" - callers should
 * show that distinctly from a generic error so the customer knows to just
 * pick a different time, not that something is broken.
 */
export async function createBooking(payload: CreateBookingPayload) {
  const res = await fetch(`${API_URL}/public/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, body?.message || "Couldn't create the booking. Please try again.");
  }

  return body;
}
