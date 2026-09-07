import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, TOKEN_KEY } from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId?: string | null;
  avatar?: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "salon_admin_user";

// Shape returned by POST /api/auth/admin/login (see AuthResponse on the backend).
interface AdminLoginResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId: string | null;
  token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post<AdminLoginResponse>("/auth/admin/login", { email, password });

      const loggedInUser: AdminUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        branchId: data.branchId,
        avatar: "https://avatar.iran.liara.run/public",
      };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));

      setToken(data.token);
      setUser(loggedInUser);
    } catch (err: any) {
      // Surface the backend's actual {message: "..."} body instead of
      // Axios's generic "Request failed with status code 401".
      const backendMessage = err?.response?.data?.message;
      throw new Error(backendMessage || "Invalid email or password");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
