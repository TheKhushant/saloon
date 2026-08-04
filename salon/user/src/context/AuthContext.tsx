import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthUser {
  name: string;
  email: string;
}

interface RegisteredUser extends AuthUser {
  password: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signup: (input: { name: string; email: string; password: string }) => AuthResult;
  login: (input: { email: string; password: string }) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "glamaura_auth_user";
const USERS_KEY = "glamaura_registered_users";

// Hardcoded shortcut account — lets anyone log straight in without signing up first.
const HARDCODED_EMAIL = "user@123";
const HARDCODED_PASSWORD = "user123";

const getRegisteredUsers = (): RegisteredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users: RegisteredUser[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore storage failures (e.g. private browsing quota)
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const persistSession = (authUser: AuthUser | null) => {
    setUser(authUser);
    if (authUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  const signup = ({ name, email, password }: { name: string; email: string; password: string }): AuthResult => {
    const users = getRegisteredUsers();
    const emailKey = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === emailKey)) {
      return { success: false, error: "An account with this email already exists. Please sign in instead." };
    }

    const newUser: RegisteredUser = { name: name.trim(), email: email.trim(), password };
    saveRegisteredUsers([...users, newUser]);
    persistSession({ name: newUser.name, email: newUser.email });
    return { success: true };
  };

  const login = ({ email, password }: { email: string; password: string }): AuthResult => {
    const emailKey = email.trim().toLowerCase();

    if (emailKey === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      persistSession({ name: "User", email: HARDCODED_EMAIL });
      return { success: true };
    }

    const users = getRegisteredUsers();
    const found = users.find((u) => u.email.toLowerCase() === emailKey);

    if (!found) {
      return { success: false, error: "No account found for this email. Please sign up first." };
    }
    if (found.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    persistSession({ name: found.name, email: found.email });
    return { success: true };
  };

  const logout = () => {
    persistSession(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
