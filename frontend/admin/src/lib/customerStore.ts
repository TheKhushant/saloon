import type { Customer } from "@/data/mockData";
import { addCustomerApi, deleteCustomerApi, getCustomersApi, updateCustomerApi } from "./adminApi";

export async function getCustomers(): Promise<Customer[]> {
  return getCustomersApi();
}

export async function addCustomer(
  customer: Omit<Customer, "id" | "totalBookings" | "lastBooking" | "totalSpent">
): Promise<Customer> {
  return addCustomerApi(customer);
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
  return updateCustomerApi(id, updates);
}

export async function deleteCustomer(id: string): Promise<void> {
  return deleteCustomerApi(id);
}
