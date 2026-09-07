export interface SalonSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  timezone: string;
  openTime: string;
  closeTime: string;
  slotDurationMinutes: number;
  allowOnlineBooking: boolean;
  requireDepositForBooking: boolean;
}

export type SalonSettingsInput = SalonSettings;
