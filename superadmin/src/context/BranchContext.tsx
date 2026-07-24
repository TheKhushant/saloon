import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBranches } from "@/features/branches/api";
import type { Branch } from "@/features/branches/types";

export const ALL_BRANCHES = "all";

interface BranchContextValue {
  branches: Branch[];
  loading: boolean;
  selectedBranchId: string; // ALL_BRANCHES or a Branch._id
  selectedBranch?: Branch;
  setSelectedBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

const STORAGE_KEY = "salon_admin_selected_branch";

export function BranchProvider({ children }: { children: ReactNode }) {
  const branchesQ = useQuery({ queryKey: ["branches"], queryFn: fetchBranches });
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? ALL_BRANCHES
  );

  const setSelectedBranchId = (id: string) => {
    setSelectedBranchIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const branches = branchesQ.data ?? [];

  // If the previously-selected branch no longer exists (e.g. mock data
  // reset), fall back to "All Branches" instead of showing empty data.
  useEffect(() => {
    if (
      selectedBranchId !== ALL_BRANCHES &&
      branches.length > 0 &&
      !branches.some((b) => b._id === selectedBranchId)
    ) {
      setSelectedBranchId(ALL_BRANCHES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches]);

  const selectedBranch = branches.find((b) => b._id === selectedBranchId);

  const value = useMemo<BranchContextValue>(
    () => ({
      branches,
      loading: branchesQ.isLoading,
      selectedBranchId,
      selectedBranch,
      setSelectedBranchId,
    }),
    [branches, branchesQ.isLoading, selectedBranchId, selectedBranch]
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within a BranchProvider");
  return ctx;
}
