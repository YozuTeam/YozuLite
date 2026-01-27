"use client";

import { Role } from "@yozu/contracts";
import { createContext, useContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean | null;
  role: Role | null;
  isOnboarded: boolean | null;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
