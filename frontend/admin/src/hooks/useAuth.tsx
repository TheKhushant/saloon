// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  role: "admin" | "branch_admin";
  email: string;
  branchId?: string;
  branchName?: string;
}

// Shape returned by POST /api/auth/admin/login (see AuthResponse on the backend).
interface AdminLoginResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
  branchId: string | null;
  token: string;
  message?: string; // present on error responses instead of the fields above
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Page reload pe localStorage se user load karo
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data: AdminLoginResponse = await api("/auth/admin/login", "POST", { email, password });

      // Set the token first - fetching the branch name below needs it for
      // the Authorization header.
      localStorage.setItem("adminToken", data.token);

      let branchName: string | undefined;
      if (data.branchId) {
        try {
          const branch: { name: string } = await api(`/admin/branches/${data.branchId}`);
          branchName = branch.name;
        } catch {
          // Non-fatal - the branch name is only used for display (page
          // titles etc.), login itself still succeeds without it.
        }
      }

      const loggedInUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        // This app is built for branch-level admins; a superadmin logging in
        // here still works but is mapped to the "admin" role literal since
        // "branch_admin" implies a specific branchId is set.
        role: data.role === "SUPERADMIN" ? "admin" : "branch_admin",
        branchId: data.branchId ?? undefined,
        branchName,
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch (err) {
      console.error("Login failed:", err instanceof Error ? err.message : err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
  };

  const signOut = () => {
    logout();
  };

  return { user, loading, login, logout, signOut };
}
