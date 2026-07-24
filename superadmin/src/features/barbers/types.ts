export interface Barber {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  specialties?: string[];
  active: boolean;
  branchId: string;
}

export interface BarberInput {
  name: string;
  phone: string;
  email?: string;
  specialties?: string[];
  active: boolean;
  branchId: string;
}
