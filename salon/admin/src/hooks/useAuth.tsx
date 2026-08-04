// hooks/useAuth.ts
import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  role: "admin" | "branch_admin";
  email: string;
  branchId?: string;
  branchName?: string;
}

interface Account {
  email: string;
  password: string;
  user: User;
}

// Local accounts (Change kar sakte ho). Branch-scoped admins only — each
// only sees and manages their own branch's data.
const ACCOUNTS: Account[] = [
  {
    email: "shankarnagarGA@gmail.com",
    password: "shankarnagar123",
    user: {
      id: "B001",
      name: "Shankar Nagar Admin",
      role: "branch_admin",
      email: "shankarnagarGA@gmail.com",
      branchId: "B001",
      branchName: "Shankar Nagar",
    },
  },
  {
    email: "hingnaGA@gmail.com",
    password: "hingna123",
    user: {
      id: "B002",
      name: "Hingna Admin",
      role: "branch_admin",
      email: "hingnaGA@gmail.com",
      branchId: "B002",
      branchName: "Hingna",
    },
  },
  {
    email: "sadarGA@gmail.com",
    password: "sadar123",
    user: {
      id: "B003",
      name: "Sadar Admin",
      role: "branch_admin",
      email: "sadarGA@gmail.com",
      branchId: "B003",
      branchName: "Sadar",
    },
  },
  {
    email: "mahalchowkGA@gmail.com",
    password: "mahalchowk123",
    user: {
      id: "B004",
      name: "Mahal Chowk Admin",
      role: "branch_admin",
      email: "mahalchowkGA@gmail.com",
      branchId: "B004",
      branchName: "Mahal Chowk",
    },
  },
];

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Page reload pe localStorage se user load karo
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    const match = ACCOUNTS.find(
      (acc) =>
        acc.email.toLowerCase() === username.trim().toLowerCase() &&
        acc.password === password
    );

    if (match) {
      setUser(match.user);
      localStorage.setItem("user", JSON.stringify(match.user));
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