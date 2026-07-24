export interface Holiday {
  _id: string;
  date: string; // ISO date
  reason: string;
  closedAllDay: boolean;
  openTime?: string;
  closeTime?: string;
  branchId?: string; // unset = applies to all branches
}

export interface HolidayInput {
  date: string;
  reason: string;
  closedAllDay: boolean;
  openTime?: string;
  closeTime?: string;
  branchId?: string;
}
