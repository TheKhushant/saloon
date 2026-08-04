import { bookings as seedBookings, type Booking } from "@/data/mockData";

const STORAGE_KEY = "admin_bookings";
const VERSION_KEY = "admin_bookings_version";
// Bump this whenever the seed data in mockData.ts changes, so stale
// browser-cached bookings get replaced instead of lingering forever.
const SEED_VERSION = "2";

function load(): Booking[] {
  const cachedVersion = localStorage.getItem(VERSION_KEY);
  if (cachedVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return seedBookings;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Booking[];
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
  return seedBookings;
}

function save(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getBookings(): Booking[] {
  return load();
}

export function addBooking(booking: Omit<Booking, "id">): Booking {
  const bookings = load();
  const newBooking: Booking = { ...booking, id: `BK${Date.now()}` };
  save([newBooking, ...bookings]);
  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking["status"]): void {
  const bookings = load().map((b) => (b.id === id ? { ...b, status } : b));
  save(bookings);
}

export function deleteBooking(id: string): void {
  save(load().filter((b) => b.id !== id));
}
