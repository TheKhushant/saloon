const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiSettings {
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  currency: string;
  timezone: string;
  openTime: string;
  closeTime: string;
  slotDurationMinutes: number;
  maxBookingsPerSlot: number;
  allowOnlineBooking: boolean;
  requireDepositForBooking: boolean;
  depositPercentage: number;
}

export async function fetchPublicSettings(): Promise<ApiSettings> {
  const res = await fetch(`${API_URL}/public/settings`);
  if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);
  return res.json();
}
