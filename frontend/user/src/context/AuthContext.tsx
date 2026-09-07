import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginApi, signupApi, updateProfileApi, USER_TOKEN_KEY } from "@/lib/authApi";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  // Deliberately does NOT log the user in - creates the real account on the
  // backend and returns success/failure only. The signup page sends the
  // customer to /login afterward rather than straight into the dashboard,
  // so they log in for real with the credentials they just chose.
  signup: (input: { name: string; email: string; phone: string; password: string }) => Promise<AuthResult>;
  login: (input: { email: string; password: string }) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (input: { name: string; email: string; phone?: string }) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "glamaura_auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (stored && token) setUser(JSON.parse(stored));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const persistSession = (authUser: AuthUser | null, token: string | null) => {
    setUser(authUser);
    if (authUser && token) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
      localStorage.setItem(USER_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_TOKEN_KEY);
    }
  };

  const signup = async ({
    name,
    email,
    phone,
    password,
  }: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      await signupApi({ name: name.trim(), email: email.trim(), phone, password });
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to create account" };
    }
  };

  const login = async ({ email, password }: { email: string; password: string }): Promise<AuthResult> => {
    try {
      const data = await loginApi({ email: email.trim(), password });
      persistSession({ id: data.id, name: data.name, email: data.email, phone: data.phone }, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Invalid email or password" };
    }
  };

  const logout = () => {
    persistSession(null, null);
  };

  const updateProfile = async ({
    name,
    email,
    phone,
  }: {
    name: string;
    email: string;
    phone?: string;
  }): Promise<AuthResult> => {
    const token = localStorage.getItem(USER_TOKEN_KEY);
    if (!user || !token) {
      return { success: false, error: "You must be logged in to update your profile." };
    }
    if (!name.trim() || !email.trim()) {
      return { success: false, error: "Name and email can't be empty." };
    }

    try {
      const updated = await updateProfileApi(token, { name: name.trim(), email: email.trim(), phone });
      persistSession({ id: updated.id, name: updated.name, email: updated.email, phone: updated.phone }, token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update profile" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
