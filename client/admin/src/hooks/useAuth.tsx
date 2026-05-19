// hooks/useAuth.ts
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Local Admin Credentials (Change kar sakte ho)
  const ADMIN_CREDENTIALS = {
    username: "admin@gmail.com",
    password: "admin123",   // ← Yeh change kar lo
  };

  useEffect(() => {
    // Page reload pe localStorage se user load karo
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("adminToken");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (token) {
      setUser({
        id: "1",
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
      });
    }

    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser: User = {
        id: "1",
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
      };

      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return true;
    }
    return false;
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