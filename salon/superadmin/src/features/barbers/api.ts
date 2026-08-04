import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockCreateBarber,
  mockDeleteBarberRecord,
  mockFetchBarberList,
  mockUpdateBarberRecord,
} from "@/lib/mock/store";
import type { Barber, BarberInput } from "./types";

export async function fetchBarbers(branchId?: string): Promise<Barber[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Barber[]>("/admin/barbers", { params: { branchId } });
      return data;
    },
    () => mockFetchBarberList(branchId)
  );
}

export async function createBarber(input: BarberInput): Promise<Barber> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Barber>("/admin/barbers", input);
      return data;
    },
    () => mockCreateBarber(input)
  );
}

export async function updateBarber(id: string, input: BarberInput): Promise<Barber> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Barber>(`/admin/barbers/${id}`, input);
      return data;
    },
    () => mockUpdateBarberRecord(id, input)
  );
}

export async function deleteBarber(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/barbers/${id}`);
    },
    () => mockDeleteBarberRecord(id)
  );
}
