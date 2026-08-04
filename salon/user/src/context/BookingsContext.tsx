import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export interface Booking {
  id: string;
  service: string;
  barber: string;
  branch?: string;
  date: Date; // scheduled appointment date/time
  duration: string;
  price: number;
  status: BookingStatus;
  createdAt: Date; // when the booking was placed
  customerName?: string;
  customerPhone?: string;
  couponCode?: string;
  discountAmount?: number;
}

interface NewBookingInput {
  service: string;
  barber: string;
  branch?: string;
  date: Date;
  duration: string;
  price: number;
  customerName?: string;
  customerPhone?: string;
  couponCode?: string;
  discountAmount?: number;
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (input: NewBookingInput) => Booking;
  cancelBooking: (id: string) => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);
const STORAGE_KEY = "glamaura_bookings";

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Bookings should not survive a page refresh — clear any leftover
    // data from a previous session instead of restoring it.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  }, []);

  const persist = (list: Booking[]) => {
    setBookings(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  };

  const addBooking = (input: NewBookingInput): Booking => {
    const newBooking: Booking = {
      id: `BK${Date.now()}`,
      status: "Confirmed",
      createdAt: new Date(),
      ...input,
    };
    persist([newBooking, ...bookings]);
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    persist(bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" as BookingStatus } : b)));
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingsProvider");
  return ctx;
};
