export interface AdminAccountInput {
  name: string;
  email: string;
  password: string;
  branchId: string;
}

// Mirrors the backend's AuthResponse, returned from
// POST /api/auth/admin/register - notably no password/hash. `token` is a
// live session token for the account just created; the superadmin doesn't
// need it (they're not logging in as that admin), so it's ignored here.
export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId?: string;
  token?: string;
}
