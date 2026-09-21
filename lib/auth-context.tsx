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
const AUTH_TOKEN_KEY = "charity-admin-token";
const AUTH_USER_KEY = "charity-admin-user";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5454/api";
}

function getAuthHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = window.localStorage.getItem(AUTH_USER_KEY);
        if (!token || !savedUser) return;

        const response = await fetch(`${getApiBaseUrl()}/dashboard/summary`, {
          headers: getAuthHeaders(token),
        });
        if (!response.ok) {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
          window.localStorage.removeItem(AUTH_USER_KEY);
          return;
        }

        setUser(JSON.parse(savedUser) as User);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${getApiBaseUrl()}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    window.localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(authenticatedUser),
    );
    setUser(authenticatedUser);
  };

  const logout = () => {
    setUser(null);
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    if (token) {
      void fetch(`${getApiBaseUrl()}/auth/admin/logout`, {
        method: "POST",
        headers: getAuthHeaders(token),
      });
    }
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
