"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserSession {
  id?: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "CLIENT" | "EMPLOYEE";
  avatar?: string;
  companyName?: string;
  department?: string;
  jobTitle?: string;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserSession, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read session from localStorage on mount
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("nuvexora_user");
        const storedToken = localStorage.getItem("nuvexora_token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Failed to restore auth session:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const login = (userData: UserSession, tokenStr: string) => {
    setUser(userData);
    setToken(tokenStr);
    if (typeof window !== "undefined") {
      localStorage.setItem("nuvexora_user", JSON.stringify(userData));
      localStorage.setItem("nuvexora_token", tokenStr);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("nuvexora_user");
      localStorage.removeItem("nuvexora_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
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
  return useContext(AuthContext);
}
