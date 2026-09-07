import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId, withIds } from "@/lib/normalizeId";
import {
  mockCreateBranch,
  mockDeleteBranchRecord,
  mockFetchBranchList,
  mockUpdateBranchRecord,
} from "@/lib/mock/store";
import type { Branch, BranchInput } from "./types";

export async function fetchBranches(): Promise<Branch[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Branch[]>("/admin/branches");
      return withIds(data);
    },
    () => mockFetchBranchList()
  );
}

export async function createBranch(input: BranchInput): Promise<Branch> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Branch>("/admin/branches", input);
      return withId(data);
    },
    () => mockCreateBranch(input)
  );
}

export async function updateBranch(id: string, input: BranchInput): Promise<Branch> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Branch>(`/admin/branches/${id}`, input);
      return withId(data);
    },
    () => mockUpdateBranchRecord(id, input)
  );
}

export async function deleteBranch(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/branches/${id}`);
    },
    () => mockDeleteBranchRecord(id)
  );
}
