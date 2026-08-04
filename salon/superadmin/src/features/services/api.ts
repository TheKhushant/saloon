import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockCreateService,
  mockDeleteServiceRecord,
  mockFetchServiceList,
  mockUpdateServiceRecord,
} from "@/lib/mock/store";
import type { Service, ServiceInput } from "./types";

export async function fetchServices(branchId?: string): Promise<Service[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Service[]>("/admin/services", { params: { branchId } });
      return data;
    },
    () => mockFetchServiceList(branchId)
  );
}

export async function createService(input: ServiceInput): Promise<Service> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Service>("/admin/services", input);
      return data;
    },
    () => mockCreateService(input)
  );
}

export async function updateService(id: string, input: ServiceInput): Promise<Service> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Service>(`/admin/services/${id}`, input);
      return data;
    },
    () => mockUpdateServiceRecord(id, input)
  );
}

export async function deleteService(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/services/${id}`);
    },
    () => mockDeleteServiceRecord(id)
  );
}
