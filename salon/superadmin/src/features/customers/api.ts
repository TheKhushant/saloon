import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockCreateCustomer,
  mockDeleteCustomerRecord,
  mockFetchCustomerList,
  mockUpdateCustomerRecord,
} from "@/lib/mock/store";
import type { Customer, CustomerInput } from "./types";

export async function fetchCustomers(branchId?: string): Promise<Customer[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Customer[]>("/admin/customers", { params: { branchId } });
      return data;
    },
    () => mockFetchCustomerList(branchId)
  );
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Customer>("/admin/customers", input);
      return data;
    },
    () => mockCreateCustomer(input)
  );
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<Customer> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Customer>(`/admin/customers/${id}`, input);
      return data;
    },
    () => mockUpdateCustomerRecord(id, input)
  );
}

export async function deleteCustomer(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/customers/${id}`);
    },
    () => mockDeleteCustomerRecord(id)
  );
}
