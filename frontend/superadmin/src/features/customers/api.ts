import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId, withIds } from "@/lib/normalizeId";
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
      return withIds(data);
    },
    () => mockFetchCustomerList(branchId)
  );
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Customer>("/admin/customers", input);
      return withId(data);
    },
    () => mockCreateCustomer(input)
  );
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<Customer> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Customer>(`/admin/customers/${id}`, input);
      return withId(data);
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
