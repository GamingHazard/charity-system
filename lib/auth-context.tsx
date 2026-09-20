"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  hasPermission,
  normalizeRole,
  Permission,
  UserRole,
} from "@/lib/permissions";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${baseUrl}/auth/admin/me`, {
          credentials: "include",
        });
        if (!response.ok) return;

        const saved = await response.json();
        const role = normalizeRole(saved.role);
        if (role) {
          setUser({
            id: String(saved.id),
            email: saved.email || saved.username,
            name: saved.name || saved.username,
            role,
          });
        }
      } finally {
        setIsLoading(false);
      }

    };

    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
    const response = await fetch(`${baseUrl}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Invalid credentials");

    const role = normalizeRole(data.role);
    if (!role) throw new Error("This account has an unsupported role");

    const authenticatedUser: User = {
      id: String(data.id),
      email,
      name: data.username,
      role,
    };
    setUser(authenticatedUser);
  };

  const logout = () => {
    setUser(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
    void fetch(`${baseUrl}/auth/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        can: (permission) => hasPermission(user?.role, permission),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
