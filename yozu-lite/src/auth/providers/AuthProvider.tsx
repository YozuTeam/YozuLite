"use client";

import { Role } from "@yozu/contracts";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { authService } from "../services";
import { getAccessToken, getRefreshToken } from "../storage";
import { isTokenExpired, parseJwt } from "../utils";

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const effectRan = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setRole(null);
    setIsOnboarded(null);
    router.replace("/login");
  };

  const updateProfileStatus = async (userRole: Role) => {
    const completed = await authService.getOnboardingStatus(userRole);
    setIsOnboarded(completed);
  };

  const checkAuthStatus = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
      setIsAuthenticated(false);
      setRole(null);
      setIsOnboarded(null);
      return;
    }

    let validToken = accessToken;

    if (!accessToken || isTokenExpired(accessToken)) {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        const refreshed = await authService.refreshAccessToken();
        validToken = refreshed?.accessToken || null;
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setIsOnboarded(null);
        return;
      }
    }

    if (validToken) {
      const decoded = parseJwt(validToken);
      const userRole = decoded?.role as Role;
      setIsAuthenticated(true);
      setRole(userRole);
      if (userRole) {
        await updateProfileStatus(userRole);
      }
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setIsOnboarded(null);
    }
  };

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, isOnboarded, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}
