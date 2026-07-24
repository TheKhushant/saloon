import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { mockFetchBranchList } from "@/lib/mock/store";
import type { Branch } from "./types";

export async function fetchBranches(): Promise<Branch[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Branch[]>("/admin/branches");
      return data;
    },
    () => mockFetchBranchList()
  );
}
