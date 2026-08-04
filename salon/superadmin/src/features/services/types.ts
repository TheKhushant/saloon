export interface Service {
  _id: string;
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  description?: string;
  /** Branch this service is offered at. Omitted/undefined means "all branches". */
  branchId?: string;
}

export interface ServiceInput {
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  description?: string;
  branchId?: string;
}
