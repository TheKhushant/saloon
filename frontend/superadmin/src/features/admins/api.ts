import { api } from "@/lib/api";
import type { AdminAccount, AdminAccountInput } from "./types";

// Creates a branch-scoped admin login. Superadmin-only - enforced backend
// side by @PreAuthorize("hasRole('SUPERADMIN')") on POST /api/auth/admin/register.
//
// Deliberately NOT wrapped in withMockFallback like the rest of this app's
// API calls: those fall back to fake local data when the backend is
// unreachable, which is fine for browsing demo data but wrong here - a
// "login created" success message must mean a real, working login exists,
// never a mocked one.
//
// Also note: there is currently no backend endpoint to list existing admin
// accounts, so this module only supports creating one - there's no way yet
// to see who already has a login for a branch, or to edit/deactivate one,
// from this app.
export async function registerBranchAdmin(input: AdminAccountInput): Promise<AdminAccount> {
  const { data } = await api.post<AdminAccount>("/auth/admin/register", {
    ...input,
    role: "ADMIN",
  });
  return data;
}
