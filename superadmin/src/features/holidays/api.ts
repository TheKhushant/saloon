import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockCreateHoliday,
  mockDeleteHolidayRecord,
  mockFetchHolidayList,
  mockUpdateHolidayRecord,
} from "@/lib/mock/store";
import type { Holiday, HolidayInput } from "./types";

export async function fetchHolidays(branchId?: string): Promise<Holiday[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Holiday[]>("/admin/holidays", { params: { branchId } });
      return data;
    },
    () => mockFetchHolidayList(branchId)
  );
}

export async function createHoliday(input: HolidayInput): Promise<Holiday> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Holiday>("/admin/holidays", input);
      return data;
    },
    () => mockCreateHoliday(input)
  );
}

export async function updateHoliday(id: string, input: HolidayInput): Promise<Holiday> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Holiday>(`/admin/holidays/${id}`, input);
      return data;
    },
    () => mockUpdateHolidayRecord(id, input)
  );
}

export async function deleteHoliday(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/holidays/${id}`);
    },
    () => mockDeleteHolidayRecord(id)
  );
}
