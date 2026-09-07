import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { mockFetchSettingsRecord, mockUpdateSettingsRecord } from "@/lib/mock/store";
import type { SalonSettings, SalonSettingsInput } from "./types";

export async function fetchSettings(): Promise<SalonSettings> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<SalonSettings>("/admin/settings");
      return data;
    },
    () => mockFetchSettingsRecord()
  );
}

export async function updateSettings(input: SalonSettingsInput): Promise<SalonSettings> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<SalonSettings>("/admin/settings", input);
      return data;
    },
    () => mockUpdateSettingsRecord(input)
  );
}
