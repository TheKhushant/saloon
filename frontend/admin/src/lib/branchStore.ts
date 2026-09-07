// Real backend-backed store (was localStorage-only). Function names/
// signatures are kept identical to before so consuming pages only need to
// switch from synchronous calls to awaited ones, not rewrite their imports.
import type { Branch } from "@/data/mockData";
import { addBranchApi, deleteBranchApi, getBranchesApi, updateBranchApi } from "./adminApi";

export async function getBranches(): Promise<Branch[]> {
  return getBranchesApi();
}

export async function addBranch(branch: Omit<Branch, "id">): Promise<Branch> {
  return addBranchApi(branch);
}

export async function getBranch(id: string): Promise<Branch | undefined> {
  const all = await getBranchesApi();
  return all.find((b) => b.id === id);
}

export async function updateBranch(id: string, updates: Partial<Branch>): Promise<void> {
  return updateBranchApi(id, updates);
}

export async function deleteBranch(id: string): Promise<void> {
  return deleteBranchApi(id);
}
