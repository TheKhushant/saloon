export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  totalSpent: number;
  active: boolean;
  notes?: string;
  branchId?: string; // customer's home branch; unset = visits any branch
}

export interface CustomerInput {
  name: string;
  phone: string;
  email?: string;
  active: boolean;
  notes?: string;
  branchId?: string;
}
